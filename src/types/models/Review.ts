// types
import { FamilyDataType } from './Family'
import { GenericDataType } from './Generic'

//optional field identified by ?
export type ReviewDataType = {
  show?: true
  _id: string
  room?: number
  date: string
  meals?: number
  feedback: string
  familyReply?: string
  treatment?: number
  createdAt: string
  updatedAt: string
  activities?: number
  studentName: string
  studentPhoto?: string
  studentVideo?: string
  overallScore?: number
  communication?: number
  isRecommended?: boolean
  family: FamilyDataType
  program: GenericDataType
  studentSchool: GenericDataType
  studentNationality: GenericDataType
}
