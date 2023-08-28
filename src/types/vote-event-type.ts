import { OrganizationType } from './organization-type'

export interface CandidateType {
  _id: string
  calonKetua: string
  calonWakil: string
  description: string
  image: { url: string }
}

interface Candidates {
  numOfVotes: number
}
type Candidate = Candidates & CandidateType

export interface VoteEventType {
  _id: string
  voteTitle: string
  isActive: boolean
  status: 'inactive' | 'active' | 'finished'
  candidates: Candidate[]
  holder: OrganizationType
  registeredVoters: {
    voter: { _id: string; name: string }
    hasVoted: boolean
    _id: string
  }[]
}
