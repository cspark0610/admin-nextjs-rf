import { FamilyScores, FamilyStatusOptions } from 'utils/commons'
import { GenericDataType } from './Generic'
import { ReviewDataType } from './Review'
import { HomeDataType } from './Home'
import { UserDataType } from './User'

export type MainMemberDataType = {
  _id?: string
  email?: string
  lastName?: string
  firstName?: string
  photo?: string | File
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
  _id?: string
  age?: number
  name?: string
  race?: string
  remarks?: string
  type?: GenericDataType
  isHipoalergenic?: boolean
}

export type FamilyMemberDataType = {
  _id?: string
  lastName?: string
  firstName?: string
  gender?: GenericDataType
  birthDate?: string | Date
  situation?: GenericDataType
  spokenLanguages?: GenericDataType[]
  familyRelationship?: GenericDataType
}

export type PictureDataType = { picture: string; caption: string }

export type FamilyLocationDataType = {
  _id?: string
  latitude: number
  longitude: number
  description?: string
}

export type TenantDataType = {
  _id?: string
  lastName?: string
  firstName?: string
  birthDate?: string
  gender?: GenericDataType
  occupation?: GenericDataType
}

export type ExternalStudentDataType = {
  _id?: string
  name?: string
  gender?: GenericDataType
  birthDate?: string | Date
  stayingSince?: string | Date
  stayingUntil?: string | Date
  nationality?: GenericDataType
}

export type SchoolDataType = {
  school: GenericDataType
  transports: GenericDataType[]
}

export type FamilyDataType = {
  _id?: string
  name?: string
  video?: string
  tenants?: false
  home?: HomeDataType
  user?: UserDataType
  pets?: PetDataType[]
  welcomeLetter?: string
  schools?: SchoolDataType[]
  labels?: GenericDataType[]
  reviews?: ReviewDataType[]
  mealPlan?: GenericDataType
  noRedLeafStudents?: boolean
  tenantList?: TenantDataType[]
  workshops?: GenericDataType[]
  interests?: GenericDataType[]
  specialDiet?: GenericDataType
  location?: FamilyLocationDataType
  mainMembers?: MainMemberDataType[]
  acceptableDiets?: GenericDataType[]
  rulesForStudents?: GenericDataType[]
  familyMembers?: FamilyMemberDataType[]
  culturalActivities?: GenericDataType[]
  familyScore?: keyof typeof FamilyScores
  welcomeStudentGenders?: GenericDataType[]
  contactAccounts?: { [key: string]: string }
  familyPictures?: (File | PictureDataType)[]
  familyInternalData?: FamilyInternalDataType
  noRedLeafStudentsList?: ExternalStudentDataType[]
}

export type UpdateFamilyFilesType = {
  mainMembers: { photo: File }[]
  familyPictures: { picture: File }[]
  video: File
}

export type FamilyPublicUrlDataType = {
  _id?: string
  name?: string
  password?: string
  expiresIn?: Date | string
}

export type situationFromStrapiDataType = {
  id: number
  name: string
  situationId: string
}
