import { OrganizationType } from './organization-type'

export interface UserType {
  _id: string
  name: string
  email: string
  organization: OrganizationType[]
  voteParticipation: []
}
