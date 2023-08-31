'use client'
import Button from '@/components/Button'
import { MainHeading } from '@/components/heading'
import { useTokenSlice } from '@/slice/tokenStore'
import { OrganizationType } from '@/types/organization-type'
import { APIReturnType, apiGet, apiPost } from '@/utils/api'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Form, Input, List, Modal, Skeleton } from 'antd'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface OrgForm {
  orgName: string
  description: string
}
interface OrgApiType<T> {
  status: string
  data: T
}

const Organization = () => {
  const [form] = Form.useForm()
  const [showModal, setShowModal] = useState<boolean>(false)
  const { accessToken } = useTokenSlice((s) => s)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['org-list'],
    queryFn: () =>
      apiGet<OrgApiType<OrganizationType>>('/org', accessToken).then(
        (res) => res.data,
      ),
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  })

  const orgMutation = useMutation({
    mutationKey: ['new-org'],
    mutationFn: (payload: OrgForm) =>
      apiPost<APIReturnType<OrganizationType>, OrgForm>(
        '/create_organization',
        payload,
        accessToken,
      ).then((res) => res.data.result),
    onSuccess() {
      toast.success('Organization successfully created')
      queryClient.invalidateQueries({ queryKey: ['org-list'] })
      setShowModal(false)
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError
        toast.error(err.response?.data as string)
      }
    },
  })

  const handleSubmitForm = (payload: OrgForm) => {
    orgMutation.mutate(payload)
  }

  return (
    <div>
      <Modal
        open={showModal}
        onOk={form.submit}
        onCancel={() => {
          setShowModal(false)
          form.resetFields()
        }}
        title="Create New Organization"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
          <Form.Item<OrgForm>
            name="orgName"
            label="Organization Name"
            rules={[{ required: true, message: 'Please input this field!' }]}
          >
            <Input placeholder="organization name" />
          </Form.Item>
          <Form.Item<OrgForm> name="description" label="description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>
      <div className="flex justify-between mb-5">
        <MainHeading>My Organization</MainHeading>
        <Button
          variant="primary"
          size="base"
          shape="round"
          onClick={() => setShowModal(true)}
        >
          <PlusOutlined />
          <TeamOutlined />
        </Button>
      </div>
      <Skeleton active loading={isLoading}>
        {
          <List
            dataSource={data?.data as unknown as OrganizationType[]}
            size="small"
            renderItem={(item, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  title={
                    <Link href={`/org/${item._id}`} className="inline-block">
                      <h2 className="text-base font-semibold">
                        {item.organization}
                      </h2>
                    </Link>
                  }
                  description={
                    <>
                      <p>admins: {item.admin.map((v) => `${v.name}, `)}</p>
                      <p>{item.description}</p>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        }
      </Skeleton>
    </div>
  )
}

export default Organization
