// types
import { FamilyDataType } from './Family'
import { GenericDataType } from './Generic'

export type ReviewDataType = {
  show: true
  _id: string
  room: number
  date: string
  meals: number
  feedback: string
  treatment: number
  createdAt: string
  updatedAt: string
  activities: number
  studentName: string
  studentPhoto: string
  overallScore: number
  communication: number
  isRecommended: boolean
  family: FamilyDataType
  program: GenericDataType
  studentSchool: GenericDataType
  studentNationality: GenericDataType
}
