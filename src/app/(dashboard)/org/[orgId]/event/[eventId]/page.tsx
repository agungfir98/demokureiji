'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { APIReturnType, apiGet, apiPut } from '@/utils/api'
import { useTokenSlice } from '@/slice/tokenStore'
import { CandidateType, VoteEventType } from '@/types/vote-event-type'
import { MainHeading } from '@/components/heading'
import Button from '@/components/Button'
import {
  PlayCircleOutlined,
  StopOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import Chip from '@/components/chip'
import {
  Card,
  Form,
  Input,
  List,
  Modal,
  Skeleton,
  Upload,
  UploadProps,
} from 'antd'
import PieChart from '@/components/chart/piechart'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useGlobalStateSlice } from '@/slice/globalslice'
import { useCandidateSlice } from '@/slice/candidateslices'
import { UploadChangeParam } from 'antd/es/upload'

interface EventDataType extends APIReturnType<VoteEventType> {
  status: string
  isUserRegistered: boolean
  hasVoted: boolean
  isAdmin: boolean
  userId: string
}

interface EditCandidate extends CandidateType {
  avatar: UploadChangeParam['file'][]
}

const CandidateModal: React.FC = () => {
  const { orgId, eventId } = useParams()
  const { candidate } = useCandidateSlice((s) => s)
  const { accessToken } = useTokenSlice((s) => s)
  const { showCandidateModal, toggleCandidateModal } = useGlobalStateSlice(
    (s) => s,
  )

  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation({
    mutationKey: ['edit-candidate'],
    mutationFn: (payload: EditCandidate) =>
      apiPut(
        `/org/${orgId}/event/${eventId}/update/${candidate._id}`,
        payload,
        accessToken,
      ),
    onSettled() {
			toast.success('Candidate successfully changed')
      queryClient.invalidateQueries({ queryKey: ['event-detail'] })
    },
  })

  const normFile = (e: UploadProps) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  const SubmitEdit = (payload: EditCandidate) => {
    const data = new FormData()
    data.append('calonKetua', payload.calonKetua)
    data.append('calonWakil', payload.calonWakil)
    data.append('description', payload.description)
    if (Array.isArray(payload.avatar) && !!payload.avatar.length) {
      data.append('image', payload.avatar[0].originFileObj as File)
    }
    if (!!candidate.image && !!candidate.image.url) {
      data.append('avatar', candidate.image.url)
    }
    mutate(data as unknown as EditCandidate)
  }

  return (
    <Modal
      title="Detail Candidate"
      open={showCandidateModal}
      onCancel={() => toggleCandidateModal(false)}
      footer={null}
      destroyOnClose
    >
      <Form onFinish={SubmitEdit} layout="vertical" className="mt-10">
        <Form.Item
          name="avatar"
          label="Image"
          valuePropName="list"
          getValueFromEvent={normFile}
        >
          <Upload
            maxCount={1}
            listType="picture-card"
            name="avatar"
            beforeUpload={() => false}
          >
            <UploadOutlined />
          </Upload>
        </Form.Item>
        <div className="flex gap-2">
          <Form.Item<EditCandidate>
            name="calonKetua"
            label="main candidate"
            initialValue={candidate.calonKetua || ''}
            className="w-full"
            rules={[{ required: true, message: 'please input this field' }]}
          >
            <Input placeholder="main candidate" />
          </Form.Item>
          <Form.Item<EditCandidate>
            name="calonWakil"
            label="vice candidate"
            initialValue={candidate.calonWakil || ''}
            className="w-full"
          >
            <Input placeholder="main candidate" />
          </Form.Item>
        </div>
        <Form.Item<EditCandidate>
          name="description"
          label="description"
          initialValue={candidate.description || ''}
        >
          <Input.TextArea placeholder="main candidate" rows={5} />
        </Form.Item>
        <Button
          variant="primary"
          size="md"
          shape="round"
          className="w-full mt-10"
          loading={isLoading}
        >
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

const EventDetail: React.FC = () => {
  const queryClient = useQueryClient()
  const { eventId, orgId } = useParams()
  const { accessToken } = useTokenSlice((s) => s)
  const { toggleCandidateModal } = useGlobalStateSlice((s) => s)
  const { setCandidate } = useCandidateSlice((s) => s)

  const { data, isLoading } = useQuery({
    queryKey: ['event-detail'],
    queryFn: () =>
      apiGet<EventDataType>(`/org/${orgId}/event/${eventId}`, accessToken).then(
        (res) => res.data,
      ),
    enabled: !!accessToken,
  })
  const eventStatusMutation = useMutation({
    mutationKey: ['event-status'],
    mutationFn: (payload: { status: VoteEventType['status'] }) =>
      apiPut(`/org/${orgId}/event/${eventId}/start`, payload, accessToken).then(
        (res) => res.data,
      ),
    onError() {
      toast.error('terjadi kesalahan')
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['event-detail'] })
    },
  })

  const handleOpenModalCandidate = (data: CandidateType) => {
    setCandidate(data)
    toggleCandidateModal(true)
  }

  return (
    <div className="max-h-full overflow-auto flex flex-col gap-5 relative">
      <CandidateModal />
      <Skeleton loading={isLoading} active>
        <div className="flex justify-between">
          <div>
            <MainHeading>{data?.result.voteTitle}</MainHeading>
            <p>Holder: {data?.result.holder.organization}</p>
            {data?.result.status === 'active' && (
              <Chip variant="success">Active</Chip>
            )}
            {data?.result.status === 'inactive' && (
              <Chip variant="default">Inactive</Chip>
            )}
            {data?.result.status === 'finished' && (
              <Chip variant="primary">Finished</Chip>
            )}
          </div>
          <div className="mx-4">
            {data?.result.status === 'active' && (
              <Button
                variant="danger"
                size="sm"
                shape="round"
                className="mx-4"
                onClick={() =>
                  eventStatusMutation.mutate({ status: 'finished' })
                }
              >
                <StopOutlined /> End
              </Button>
            )}
            {data?.result.status === 'inactive' && (
              <Button
                variant="success"
                size="sm"
                shape="round"
                onClick={() => eventStatusMutation.mutate({ status: 'active' })}
              >
                <PlayCircleOutlined /> Start
              </Button>
            )}
          </div>
        </div>
        <div>
          <h2>Candidates</h2>
          <div className="flex justify-center gap-2">
            {data?.result.candidates.map((item, index) => (
              <Card
                key={index}
                size="small"
                className="w-[250px]"
                bordered
                hoverable={!!item.image || data.isAdmin}
                onClick={() => handleOpenModalCandidate(item)}
                cover={
                  item.image && (
                    <div className="h-[300px] w-full ">
                      <Image
                        unoptimized
                        alt=""
                        src={item.image.url as string}
                        width="0"
                        height="0"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={
                    <p>
                      {item.calonKetua}{' '}
                      {item.calonWakil && (
                        <>
                          {' & '} {item.calonWakil}
                        </>
                      )}
                    </p>
                  }
                />
                {!item.image && <p className="mt-3">{item.description}</p>}
              </Card>
            ))}
          </div>
        </div>
        <div
          className={`${
            data?.result.status === 'inactive' ? 'hidden' : ''
          } mt-5`}
        >
          <h2>Stats</h2>
          <div className="flex justify-center">
            <div className="sm:w-96">
              {data && (
                <PieChart
                  data={[...data.result.candidates.map((v) => v.numOfVotes)]}
                  labels={[
                    ...data.result.candidates.map(
                      (v) =>
                        `${v.calonKetua} ${
                          v.calonWakil ? 'with' + v.calonWakil : ''
                        }`,
                    ),
                  ]}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h2>Registered Voters ({data?.result.registeredVoters.length})</h2>
          {
            <List
              dataSource={data?.result.registeredVoters}
              size="small"
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta title={item.voter.name} />
                </List.Item>
              )}
            />
          }
        </div>
      </Skeleton>
    </div>
  )
}

export default EventDetail
