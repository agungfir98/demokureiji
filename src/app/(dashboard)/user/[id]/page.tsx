'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { APIReturnType, apiGet } from '@/utils/api'
import { useTokenSlice } from '@/slice/tokenStore'
import { UserType } from '@/types/user-type'
import { List } from 'antd'
import Link from 'next/link'
import Chip from '@/components/chip'

const UserProfile: React.FC = () => {
  const { accessToken } = useTokenSlice((s) => s)

  const { data } = useQuery({
    queryKey: ['user-detail'],
    queryFn: () =>
      apiGet<APIReturnType<UserType>>(`/user/`, accessToken).then(
        (res) => res.data,
      ),
  })

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bold text-2xl">{data?.result.name}</h1>
      <div>
        <div>
          <h2 className="font-semibold mb-2">Vote History</h2>
          <List
            dataSource={data?.result.voteParticipation}
            itemLayout="horizontal"
            size="small"
            renderItem={(item, index) => (
              <List.Item key={`event-${index}`}>
                <List.Item.Meta
                  title={
                    <Link
                      href={`/org/${item.holder._id}/event/${item._id}`}
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
        </div>
      </div>
    </div>
  )
}

export default UserProfile
