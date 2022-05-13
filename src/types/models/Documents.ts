import { FamilyDataType } from './Family'

export type DocumentDataType = {
  _id?: string
  file?: string
  name?: string
  remarks?: string
  updatedAt?: string
  createdAt?: string
  family?: FamilyDataType | string
  isDeclaration?: boolean
  isPoliceCheck?: boolean
  owner?: {
    id?: string
    _id?: string
    kind?: string
    lastName?: string
    firstName?: string
  }
}
