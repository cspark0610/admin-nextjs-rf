// types
import { FamilyDataType } from './Family'
import { GenericDataType } from './Generic'

export type ReviewDataType = {
  _id?: string
  room?: number
  meals?: number
  show?: boolean
  feedback?: string
  createdAt?: string
  updatedAt?: string
  treatment?: number
  activities?: number
  date?: string | Date
  studentName?: string
  familyReply?: string
  studentPhoto?: string
  studentVideo?: string
  overallScore?: number
  communication?: number
  isRecommended?: boolean
  family?: FamilyDataType | string
  program?: GenericDataType | string
  studentSchool?: GenericDataType | string
  studentNationality?: GenericDataType | string
}
