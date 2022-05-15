// types
import { FamilyDataType } from './Family'
import { GenericDataType } from './Generic'

export type ReviewDataType = {
  show?: true
  _id?: string
  date?: string
  room?: number
  meals?: number
  feedback?: string
  createdAt?: string
  updatedAt?: string
  treatment?: number
  activities?: number
  studentName?: string
  familyReply?: string
  studentPhoto?: string
  studentVideo?: string
  overallScore?: number
  communication?: number
  family?: FamilyDataType
  isRecommended?: boolean
  program?: GenericDataType
  studentSchool?: GenericDataType
  studentNationality: GenericDataType
}
