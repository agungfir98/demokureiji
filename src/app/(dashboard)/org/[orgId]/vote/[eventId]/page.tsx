'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { APIReturnType, apiGet, apiPut } from '@/utils/api'
import { useTokenSlice } from '@/slice/tokenStore'
import { VoteEventType } from '@/types/vote-event-type'
import { MainHeading } from '@/components/heading'
import Button from '@/components/Button'
import Chip from '@/components/chip'
import { Card, Modal, Skeleton } from 'antd'
import PieChart from '@/components/chart/piechart'
import Image from 'next/image'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useCandidateSlice } from '@/slice/candidateslices'
import { useGlobalStateSlice } from '@/slice/globalslice'

interface EventDataType extends APIReturnType<VoteEventType> {
  status: string
  isUserRegistered: boolean
  hasVoted: boolean
  isAdmin: boolean
  userId: string
}

const CandidateModal: React.FC = () => {
  const { candidate } = useCandidateSlice((s) => s)
  const { showCandidateModal, toggleCandidateModal } = useGlobalStateSlice(
    (s) => s,
  )

  return (
    <Modal
      title="Detail Candidate"
      open={showCandidateModal}
      onCancel={() => toggleCandidateModal(false)}
      footer={null}
      destroyOnClose
    >
      <div className="w-full">
        {
          <Image
            src={candidate.image?.url || ''}
            alt={candidate.calonKetua + ' & ' + candidate.calonWakil}
            width={9}
            height={0}
            className="object-cover w-full h-fit rounded-2xl"
            unoptimized
          />
        }
      </div>
      <div className="flex flex-col justify-center items-center my-2">
        <MainHeading>{candidate.calonKetua}</MainHeading>
        {candidate.calonWakil && <p className="font-semibold">&</p>}
        <MainHeading>{candidate.calonWakil}</MainHeading>
      </div>
      <div>
        <p>{candidate.description}</p>
      </div>
    </Modal>
  )
}

const EventDetail: React.FC = () => {
  const { eventId, orgId } = useParams()
  const { accessToken } = useTokenSlice((s) => s)
  const { toggleCandidateModal } = useGlobalStateSlice((s) => s)
  const { setCandidate } = useCandidateSlice((s) => s)
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['event-detail'],
    queryFn: () =>
      apiGet<EventDataType>(`/org/${orgId}/event/${eventId}`, accessToken).then(
        (res) => res.data,
      ),
    enabled: !!accessToken,
  })

  const sumVoter: number = data?.result.registeredVoters.length as number
  const numHasVoted: number = data?.result.registeredVoters.filter(
    (v) => v.hasVoted,
  ).length as number
  const percentVoted: number = numHasVoted / sumVoter

  const voteMutation = useMutation({
    mutationKey: ['vote'],
    mutationFn: (candidateId: string) =>
      apiPut<APIReturnType<VoteEventType>>(
        `/vote/${eventId}`,
        { candidateId, status: data?.result.status },
        accessToken,
      ).then((res) => res.data),
    onError(err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.msg)
      }
    },
    onSuccess() {
      toast.success('vote success')
      router.push(`/org/${orgId}/event/${eventId}`)
    },
  })

  return (
    <div className="max-h-full overflow-auto flex flex-col gap-5 relative">
      <CandidateModal />
      <Skeleton loading={isLoading} active>
        <div className="flex justify-between">
          <div>
            <MainHeading>{data?.result.voteTitle}</MainHeading>
            <p>Holder: {data?.result.holder.organization}</p>
            <Chip
              variant={
                data?.result.status === 'active'
                  ? 'success'
                  : data?.result.status === 'finished'
                  ? 'primary'
                  : 'default'
              }
            >
              {data?.result.status.charAt(0).toUpperCase()}
              {data?.result.status.slice(1)}
            </Chip>
            <Chip variant="success">{data?.hasVoted && 'you have voted'}</Chip>
          </div>
        </div>
        <div>
          <h2>Candidates</h2>
          <div className="flex justify-center gap-2">
            {data?.result.candidates.map((item, index) => (
              <Card
                key={index}
                size="small"
                className="w-[250px] hover:cursor-default"
                id="card"
                bordered
                hoverable={!!item.image || data.isAdmin}
                cover={
                  item.image && (
                    <div className="h-[300px] w-full ">
                      <Image
                        unoptimized
                        alt=""
                        src={item.image.url as string}
                        width="0"
                        height="0"
                        className="h-full w-full object-cover hover:cursor-pointer"
                        onClick={() => {
                          toggleCandidateModal(true)
                          setCandidate(item)
                        }}
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
                <div className="flex flex-col gap-4">
                  {!item.image && <p className="mt-3">{item.description}</p>}
                  {data.result.status === 'active' && !data.hasVoted && (
                    <Button
                      variant="primary"
                      size="sm"
                      shape="round"
                      id="votebtn"
                      className={!!item.image && 'mt-5'}
                      onClick={() => {
                        voteMutation.mutate(item._id)
                      }}
                    >
                      Vote
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default EventDetail
