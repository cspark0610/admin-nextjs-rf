import { GenericDataType } from './Generic'

export type MainMemberDataType = {
  email?: string
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
  beenHostingStudentsSince?: null
  workedWithOtherCompany?: boolean
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
  spokenLanguages?: GenericDataType
  familyRelationship?: GenericDataType
}

export type FamilyDataType = {
  _id?: string
  tenants?: false
  tenantList?: []
  familyPictures?: []
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
  welcomeStudentGenders?: GenericDataType[]
  contactAccounts?: { [key: string]: string }
  familyInternalData?: FamilyInternalDataType
  familyScore?: 'NOT_DEFINED' | 'GOLD' | 'SILVER' | 'BRONZE'
}
