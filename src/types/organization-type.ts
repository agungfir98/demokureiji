import type { UserType } from './user-type'
import { VoteEventType } from './vote-event-type'

export interface OrganizationType {
  _id: string
  admin: string[]
  description: string
  members: UserType[]
  organization: string
  updatedAt: string
  createdAt: string
  voteEvents: VoteEventType[]
}
