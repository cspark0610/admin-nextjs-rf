import { FamilyDataType } from './Family'

export type DocumentOwnerDataType = {
  _id?: string
  kind?: string
  lastName?: string
  firstName?: string
}

export type DocumentDataType = {
  _id?: string
  name?: string
  remarks?: string
  updatedAt?: string
  createdAt?: string
  isDeclaration?: boolean
  isPoliceCheck?: boolean
  file?: string | File | null
  family?: FamilyDataType | string
  owner?: DocumentOwnerDataType | null
}
