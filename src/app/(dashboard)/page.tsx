'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/utils/api'
import { useTokenSlice } from '@/slice/tokenStore'
import { UserType } from '@/types/user-type'
import { List, Skeleton } from 'antd'
import Link from 'next/link'
import { EditTwoTone } from '@ant-design/icons'
import { MainHeading } from '@/components/heading'
import Chip from '@/components/chip'

const Home: React.FC = () => {
  const { accessToken } = useTokenSlice((state) => state)
  const { data, isLoading } = useQuery({
    queryKey: ['user-org', accessToken],
    queryFn: () =>
      apiGet<UserType>('/user', accessToken).then((res) => res.data),
    enabled: !!accessToken,
  })

  const activeEventList = data?.result.organization.flatMap((v) => {
    return v.voteEvents.filter((item) => item.isActive && item)
  })

  return (
    <div>
      <div>
        <MainHeading>Active Vote</MainHeading>
        <p className="text-sm text-slate-400">
          total: {activeEventList?.length}
        </p>
        <List
          dataSource={activeEventList}
          itemLayout="horizontal"
          renderItem={(item, index) => (
            <Skeleton loading={isLoading} active>
              <List.Item
                key={index}
                actions={[
                  <Link
                    key="vote"
                    href={`/org/${item.holder._id}/vote/${item._id}`}
                    className="flex items-center gap-1"
                  >
                    <EditTwoTone twoToneColor="blue" />
                    Vote
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link
                      href={`/org/${item.holder._id}/event/${item._id}`}
                      className="inline-block"
                    >
                      <p className="text-base font-semibold">
                        {item.voteTitle}
                      </p>
                    </Link>
                  }
                  description={
                    <>
                      <p>Candidates:</p>
                      <div className="flex gap-1 items-center">
                        {item.candidates.map((calon, i) => (
                          <Chip key={i}>
                            {calon.calonKetua}
                            {calon.wakitKetua && ' & ' + calon.wakitKetua}
                          </Chip>
                        ))}
                      </div>
                    </>
                  }
                />
                <div>
                  <Link href={`/org/${item.holder._id}`}>
                    {item.holder.organization}
                  </Link>
                </div>
              </List.Item>
            </Skeleton>
          )}
        />
      </div>
    </div>
  )
}

export default Home
