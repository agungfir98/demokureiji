import { OrganizationType } from './organization-type'

export interface VoteEventType {
  _id: string
  voteTitle: string
  isActive: boolean
  candidates: {
    calonKetua: string
    wakitKetua: string
    description: string
    numberOfVotes: number
    _id: string
  }[]
  holder: OrganizationType
  registeredVoters: {
    voter: string
    hasVoted: boolean
    _id: string
  }[]
}
