import { FamilyScores, FamilyStatusOptions } from 'utils/commons'
import { GenericDataType } from './Generic'
import { HomeDataType } from './Home'

export type MainMemberDataType = {
  email?: string
  photo?: string
  lastName?: string
  firstName?: string
  cellPhoneNumber?: string
  homePhoneNumber?: string
  workPhoneNumber?: string
  gender?: GenericDataType
  birthDate?: string | Date
  isWorkHomeVerified?: boolean
  occupation?: GenericDataType
  isCellPhoneVerified?: boolean
  isHomePhoneVerified?: boolean
  occupationFreeComment?: string
  spokenLanguages?: GenericDataType[]
  mainLanguagesSpokenAtHome?: GenericDataType[]
  relationshipWithThePrimaryHost?: GenericDataType
}

type FamilyInternalDataType = {
  availablePrograms?: []
  workshopsAttended?: []
  otherCompanyName?: null
  localManager?: GenericDataType
  beenHostingStudentsSince?: null
  workedWithOtherCompany?: boolean
  status?: keyof typeof FamilyStatusOptions
}

export type PetDataType = {
  age?: number
  name?: string
  race?: string
  remarks?: string
  type?: GenericDataType
  isHipoalergenic?: boolean
}

export type FamilyMemberDataType = {
  lastName?: string
  firstName?: string
  gender?: GenericDataType
  birthDate?: string | Date
  situation?: GenericDataType
  spokenLanguages?: GenericDataType[]
  familyRelationship?: GenericDataType
}

export type FamilyDataType = {
  _id?: string
  name?: string
  tenants?: false
  tenantList?: []
  home?: HomeDataType
  pets?: PetDataType[]
  noRedLeafStudentsList?: []
  schools?: GenericDataType[]
  noRedLeafStudents?: boolean
  workshops?: GenericDataType[]
  interests?: GenericDataType[]
  specialDiet?: GenericDataType
  mainMembers?: MainMemberDataType[]
  acceptableDiets?: GenericDataType[]
  rulesForStudents?: GenericDataType[]
  familyMembers?: FamilyMemberDataType[]
  culturalActivities?: GenericDataType[]
  familyScore?: keyof typeof FamilyScores
  welcomeStudentGenders?: GenericDataType[]
  contactAccounts?: { [key: string]: string }
  familyInternalData?: FamilyInternalDataType
  familyPictures?: { caption: string; picture: string }[]
}
