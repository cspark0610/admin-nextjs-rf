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

export interface IReview {
  room?: number
  show?: boolean
  date?: string | Date
  meals?: number
  program?: GenericDataType | string
  feedback?: string
  treatment?: number
  activities?: number
  familyReply?: string
  studentName?: string
  studentVideo?: Blob | File | string | null
  studentPhoto?: Blob | File | string | null
  isRecommended?: boolean
  communication?: number
  studentSchool?: GenericDataType | {}
  studentNationality?: GenericDataType | {}
}
