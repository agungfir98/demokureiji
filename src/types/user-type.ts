import { OrganizationType } from './organization-type'
import { VoteEventType } from './vote-event-type'

export interface UserType {
  _id: string
  name: string
  email: string
  organization: OrganizationType[]
  voteParticipation: VoteEventType[]
}
