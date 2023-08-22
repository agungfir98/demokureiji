import { OrganizationType } from './organization-type'

export interface VoteEventType {
  _id: string
  voteTitle: string
  isActive: boolean
  status: 'inactive' | 'active' | 'finished'
  candidates: {
    calonKetua: string
    wakitKetua: string
    description: string
    numOfVotes?: number
    _id?: string
    image: { url: string }
  }[]
  holder: OrganizationType
  registeredVoters: {
    voter: { _id: string; name: string }
    hasVoted: boolean
    _id: string
  }[]
}
