'use client'
import { MainHeading } from '@/components/heading'
import Chip from '@/components/chip'
import { useTokenSlice } from '@/slice/tokenStore'
import { OrganizationType } from '@/types/organization-type'
import { APIReturnType, apiDelete, apiGet, apiPost, apiPut } from '@/utils/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AutoComplete,
  Col,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Skeleton,
  Typography,
  Button as AntdButton,
  Dropdown,
} from 'antd'
import type { MenuProps } from 'antd'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Button from '@/components/Button'
import {
  DeleteOutlined,
  FileAddOutlined,
  MinusOutlined,
  PlusOutlined,
  SettingOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { useGlobalStateSlice } from '@/slice/globalslice'
import { toast } from 'react-hot-toast'
import { VoteEventType } from '@/types/vote-event-type'
import axios from 'axios'

interface OrgDataType extends APIReturnType<OrganizationType> {
  isAdmin: boolean
  status: string
  userId: string
}

interface EventField {
  voteTitle: string
  candidates: VoteEventType['candidates']
}

const AddMemberModal: React.FC = () => {
  const { accessToken } = useTokenSlice((state) => state)
  const { toggleMemberModal, showMemberModal } = useGlobalStateSlice((s) => s)
  const queryClient = useQueryClient()
  const { orgId } = useParams()

  const { data, isLoading, mutate } = useMutation({
    mutationKey: ['search-user'],
    mutationFn: ({ email }: { email: string }) =>
      apiPost<APIReturnType<{ email: string; name: string; _id: string }[]>>(
        '/search_user',
        { email },
        accessToken,
      ).then((res) => res.data),
  })

  const addMemberMutation = useMutation({
    mutationKey: ['add-member'],
    mutationFn: ({ id }: { id: string }) =>
      apiPut(`/org/${orgId}`, { id }, accessToken).then((res) => res.data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['org-detail'] })
    },
    onError() {
      toast.error(
        'something wrong happen during add member, please try again or reload the page',
      )
    },
  })

  return (
    <Modal
      open={showMemberModal}
      onCancel={() => toggleMemberModal(false)}
      title="Add Member"
      footer={null}
    >
      <div className="flex flex-col gap-3 my-10 ">
        <Form onFinish={(email) => mutate({ email })} layout="vertical">
          <Form.Item name="email" label="Search user">
            <div className="flex">
              <AutoComplete
                className="w-full"
                placeholder="example@mail.co.id"
                onSearch={(email) => mutate({ email })}
              />
            </div>
          </Form.Item>
        </Form>
        <Skeleton loading={isLoading} active>
          <List
            dataSource={data?.result}
            itemLayout="horizontal"
            renderItem={(item, index) => (
              <List.Item key={index}>
                <List.Item.Meta title={item.name} description={item.email} />
                <Popconfirm
                  title={`add ${item.name} to the organization?`}
                  okButtonProps={{ loading: addMemberMutation.isLoading }}
                  onConfirm={() => addMemberMutation.mutate({ id: item._id })}
                >
                  <Button variant="primary" shape="circle" size="sm">
                    <UserAddOutlined />
                  </Button>
                </Popconfirm>
              </List.Item>
            )}
          />
        </Skeleton>
      </div>
    </Modal>
  )
}

const NewEventModal = () => {
  const { orgId } = useParams()
  const queryClient = useQueryClient()
  const { accessToken } = useTokenSlice((s) => s)
  const { toggleNewEventModal, showNewEventModal } = useGlobalStateSlice(
    (s) => s,
  )

  const eventMutation = useMutation({
    mutationKey: ['new-event'],
    mutationFn: (payload: EventField) =>
      apiPost(`/org/${orgId}/add_event`, payload, accessToken).then(
        (res) => res.data,
      ),
    onError() {
      toast.error('Failed to create new event')
    },
    onSuccess() {
      toast.success('Success creating new event')
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['org-detail'] })
      toggleNewEventModal(false)
    },
  })
  const handleSubmit = (value: EventField) => {
    eventMutation.mutate(value)
  }

  return (
    <Modal
      open={showNewEventModal}
      onCancel={() => toggleNewEventModal(false)}
      footer={null}
      title="New Event"
    >
      <Form layout="vertical" className="my-5" onFinish={handleSubmit}>
        <Form.Item<EventField>
          name="voteTitle"
          label={<Typography.Title level={5}>Event Name</Typography.Title>}
          rules={[{ required: true, message: 'Title cannot be empty' }]}
        >
          <Input placeholder="event name" />
        </Form.Item>
        <Form.List
          name="candidates"
          rules={[
            {
              validator: async (_, candidates) => {
                if (!candidates || candidates.length < 2) {
                  return Promise.reject(new Error('At least 2 main candidates'))
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Col key={key}>
                  <Row className="items-center justify-between">
                    <Typography.Title level={5}>
                      Candidate {name + 1}
                    </Typography.Title>
                    {fields.length > 2 && (
                      <Button
                        variant="danger"
                        className="p-1"
                        shape="circle"
                        onClick={() => remove(name)}
                      >
                        <MinusOutlined />
                      </Button>
                    )}
                  </Row>
                  <div className="flex w-full gap-2">
                    <div className="w-full h-fit">
                      <Form.Item
                        {...restField}
                        initialValue={''}
                        name={[name, 'calonKetua']}
                        label="main Candidate"
                        rules={[
                          {
                            required: true,
                            message: 'Please input this field',
                          },
                        ]}
                      >
                        <Input placeholder="main candidate" />
                      </Form.Item>
                    </div>
                    <div className="w-full h-fit">
                      <Form.Item
                        {...restField}
                        initialValue={''}
                        name={[name, 'calonWakil']}
                        label="vice candidate"
                      >
                        <Input placeholder="vice candidate" />
                      </Form.Item>
                    </div>
                  </div>
                  <Form.Item
                    {...restField}
                    initialValue={''}
                    name={[name, 'description']}
                    label="description"
                    rules={[
                      { required: true, message: 'please input this field' },
                    ]}
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Col>
              ))}
              <Form.Item>
                <AntdButton
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add candidate
                </AntdButton>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Button
          variant="primary"
          size="base"
          className="w-full"
          type="submit"
          loading={eventMutation.isLoading}
        >
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

const Organization: React.FC = () => {
  const { orgId } = useParams()
  const { accessToken } = useTokenSlice((state) => state)
  const { toggleMemberModal, toggleNewEventModal } = useGlobalStateSlice(
    (s) => s,
  )
  const queryClient = useQueryClient()

  const [showModal, setShowModal] = useState<boolean>(false)

  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['org-detail'],
    queryFn: () =>
      apiGet<OrgDataType>(`/org/${orgId}`, accessToken).then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  })

  const deleteOrgMutation = useMutation({
    mutationKey: ['delete-org'],
    mutationFn: () => apiDelete(`/org/${orgId}`, accessToken),
    onError(err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data)
      }
    },
    onSuccess() {
      toast.success('Organization successfully disbanded')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/org')
    },
  })

  const items: MenuProps['items'] = [
    {
      key: '1',
      danger: true,
      label: (
        <>
          <Button variant="link" onClick={() => setShowModal(true)}>
            delete this org
          </Button>
        </>
      ),
      itemIcon: <DeleteOutlined />,
    },
  ]

  const disbandOrg = () => {
    deleteOrgMutation.mutate()
  }

  return (
    <div className="max-h-full overflow-auto">
      <AddMemberModal />
      <NewEventModal />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title={<MainHeading>Disband {data?.result.organization}</MainHeading>}
      >
        <Form layout="vertical" onFinish={disbandOrg}>
          <Form.Item<{ orgName: string }>
            name="orgName"
            label={
              <div>
                Input{' '}
                <span className="font-bold">{data?.result.organization}</span>{' '}
                on the field bellow
              </div>
            }
            rules={[
              () => ({
                validator(_, value) {
                  if (value === data?.result.organization) {
                    return Promise.resolve()
                  }
                  return Promise.reject("you input doesn't match")
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
          <Button
            variant="danger"
            size="md"
            className="w-full"
            loading={deleteOrgMutation.isLoading}
          >
            Confirm
          </Button>
        </Form>
      </Modal>
      <div>
        <Skeleton active loading={isLoading}>
          <div className="flex justify-between">
            <span>
              <MainHeading>{data?.result.organization}</MainHeading>
              <p>{data?.result.description}</p>
            </span>
            {data?.isAdmin && (
              <div className="mx-4">
                <Dropdown menu={{ items }} placement="bottomRight">
                  <SettingOutlined className="hover:cursor-pointer" />
                </Dropdown>
              </div>
            )}
          </div>
          <div className="mt-10">
            <div className="flex justify-between">
              <h2>Vote Events ({data?.result.voteEvents.length})</h2>
              {data?.isAdmin && (
                <Button
                  variant="primary"
                  size="sm"
                  shape="round"
                  className="mx-4"
                  onClick={() => toggleNewEventModal(true)}
                >
                  <FileAddOutlined />
                  New Event
                </Button>
              )}
            </div>
            {
              <List
                dataSource={data?.result.voteEvents}
                itemLayout="horizontal"
                size="small"
                renderItem={(item, index) => (
                  <List.Item key={`event-${index}`}>
                    <List.Item.Meta
                      title={
                        <Link
                          href={`/org/${orgId}/event/${item._id}`}
                          className="font-semibold"
                        >
                          {item.voteTitle}
                        </Link>
                      }
                      description={
                        <>
                          <p>Candidates:</p>
                          <span className="flex gap-1 flex-wrap">
                            {item.candidates.map((calon, index) => (
                              <Chip key={index}>
                                {calon.calonKetua}
                                {calon.calonWakil && ' & ' + calon.calonWakil}
                              </Chip>
                            ))}
                          </span>
                        </>
                      }
                    />
                    {item.status === 'active' && (
                      <Chip variant="success">{item.status}</Chip>
                    )}
                    {item.status === 'inactive' && <Chip>{item.status}</Chip>}
                    {item.status === 'finished' && (
                      <Chip variant="primary">{item.status}</Chip>
                    )}
                  </List.Item>
                )}
              />
            }
          </div>
          <div className="mt-5">
            <div className="flex justify-between">
              <h3>Members ({data?.result.members.length})</h3>
              {data?.isAdmin && (
                <Button
                  variant="primary"
                  size="sm"
                  shape="round"
                  className="mx-4"
                  onClick={() => toggleMemberModal(true)}
                >
                  <UserAddOutlined />
                  Member
                </Button>
              )}
            </div>
            {
              <List
                dataSource={data?.result.members}
                itemLayout="horizontal"
                size="small"
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta title={item.name} />
                    {item.isAdmin && <Chip variant="warning">admin</Chip>}
                  </List.Item>
                )}
              />
            }
          </div>
        </Skeleton>
      </div>
    </div>
  )
}

export default Organization
