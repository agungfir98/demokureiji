'use client'
import { useTokenSlice } from '@/slice/tokenStore'
import { OrganizationType } from '@/types/organization-type'
import { apiGet } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { List, Skeleton } from 'antd'
import { useParams } from 'next/navigation'
import React from 'react'

const Organization: React.FC = () => {
  const { orgId } = useParams()
  const { accessToken } = useTokenSlice((state) => state)

  const { data, isLoading } = useQuery({
    queryKey: ['org-detail'],
    queryFn: () =>
      apiGet<OrganizationType>(`/org/${orgId}`, accessToken).then(
        (res) => res.data,
      ),
  })

  return (
    <div className="max-h-full overflow-auto">
      <div>
        <Skeleton active loading={isLoading}>
          <h1 className="text-xl font-semibold">{data?.result.organization}</h1>
          <p>{data?.result.description}</p>
          <div>
            <h3>Members</h3>
            <ul></ul>
            {
              <List
                dataSource={data?.result.members}
                itemLayout="vertical"
                size="small"
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta title={item.name} />
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
