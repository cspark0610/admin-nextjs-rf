import { FamilyScores, FamilyStatusOptions } from 'utils/commons'
import { GenericDataType } from './Generic'
import { ReviewDataType } from './Review'
import { HomeDataType } from './Home'
import { UserDataType } from './User'

export type MainMemberDataType = {
  email?: string
  photo?: string | File
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

export type FamilyInternalDataType = {
  type?: string
  availablePrograms?: []
  workshopsAttended?: []
  dischargeDate?: string
  otherCompanyName?: string
  verificationDate?: string
  localManager?: UserDataType
  community?: GenericDataType
  workedWithOtherCompany?: boolean
  beenHostingStudentsSince?: string
  internalObservations?: GenericDataType[]
  status?: keyof typeof FamilyStatusOptions
  followUpActions?: { actionType: string; comments: string; date: string }[]
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
  user?: UserDataType
  pets?: PetDataType[]
  welcomeLetter?: string
  labels?: GenericDataType[]
  reviews?: ReviewDataType[]
  mealPlan?: GenericDataType
  noRedLeafStudentsList?: []
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
  schools?: { school: GenericDataType; transports: GenericDataType[] }[]
}

export type UpdateFamilyFilesType = {
  mainMembers: { photo: File }[]
}
