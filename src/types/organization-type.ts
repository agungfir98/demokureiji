import type { UserType } from './user-type'
import { VoteEventType } from './vote-event-type'

interface Member extends UserType {
  isAdmin: boolean
}
export interface OrganizationType {
  _id: string
  admin: { name: string }[]
  description: string
  members: Member[]
  organization: string
  updatedAt: string
  createdAt: string
  voteEvents: VoteEventType[]
}
