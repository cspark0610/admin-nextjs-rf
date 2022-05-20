// types
import {
  PetDataType,
  FamilyDataType,
  TenantDataType,
  FamilyMemberDataType,
  ExternalStudentDataType,
  followUpActionsType,
} from 'types/models/Family'
import { ReviewDataType } from 'types/models/Review'
import { StudentRoomDataType } from 'types/models/Home'
import { DocumentDataType } from 'types/models/Documents'

type validateUpdateFamilyProps = {
  data: FamilyDataType
}

export const validateUpdateFamily = ({
  data,
}: validateUpdateFamilyProps): string[] => {
  const errors: string[] = []

  /**
   * Verify Host Data
   */
  data.mainMembers?.forEach((member, idx) => {
    if (idx === 1 && !member.relationshipWithThePrimaryHost)
      errors.push('Relationship with the primary host is required')
    if (!member.cellPhoneNumber) errors.push('Cell phone number is required')
    if (!member.spokenLanguages?.length)
      errors.push('What language(s) do you speak? is required')
    if (idx === 0 && !member.mainLanguagesSpokenAtHome?.length)
      errors.push('Main languages spoken at home is required')
    if (!member.gender) errors.push('Gender is required')
    if (!member.occupation && !member.occupationFreeComment)
      errors.push('Occupation is required')
    if (!member.email) errors.push('Email is required')
    if (!member.lastName) errors.push('Last name is required')
    if (!member.firstName) errors.push('First name is required')
  })

  /**
   * Verify Home Data
   */
  if (!data.home?.homeType) errors.push('Home type is required')
  if (!data.home?.houseRooms?.length) errors.push('Inside rooms is required')
  if (!data.home?.services?.length)
    errors.push('Household amenities is required')
  if (!data.home?.country) errors.push('Country is required')
  if (!data.home?.province) errors.push('Province is required')
  if (!data.home?.city && !data.home?.cityFreeComment)
    errors.push('City is required')
  if (!data.home?.address) errors.push('Address is required')
  if (!data.home?.postalCode) errors.push('Postal code is required')

  /**
   * Verify Family Data
   */
  if (!data.welcomeStudentGenders?.length)
    errors.push('Our family welcomes is required')

  return errors
}

/**
 * Verify FamilyMembers
 */
export const validateUpdateFamilyMembers = (data: FamilyMemberDataType[]) => {
  const errors: string[] = []
  data.forEach((member) => {
    if (!member.situation) errors.push('Situation is required')
    if (!member.familyRelationship)
      errors.push('Family relationship is required')
    if (!member.spokenLanguages?.length)
      errors.push('What language(s) do you speak? is required')
    if (!member.gender) errors.push('Gender is required')
    if (!member.lastName) errors.push('Last name is required')
    if (!member.firstName) errors.push('First name is required')
  })
  return errors
}

/**
 * Verify Pets
 */
export const validateUpdatePets = (data: PetDataType[]) => {
  const errors: string[] = []
  data.forEach((pet) => {
    if (!pet.type) errors.push('Species is required')
  })
  return errors
}

/**
 * Verify Tenants
 */
export const validateUpdateTenants = (data: TenantDataType[]) => {
  const errors: string[] = []
  data.forEach((tenant) => {
    if (!tenant.firstName) errors.push('FirstName is required')
    if (!tenant.lastName) errors.push('LastName is required')
    if (!tenant.gender) errors.push('Gender is required')
    if (!tenant.occupation) errors.push('Occupation is required')
  })
  return errors
}

/**
 * Verify External Student
 */
export const validateUpdateExternalStudent = (
  data: ExternalStudentDataType[]
) => {
  const errors: string[] = []
  data.forEach((student) => {
    if (!student.name) errors.push('FirstName is required')
    if (!student.gender) errors.push('Gender is required')
    if (!student.nationality) errors.push('Nationality is required')
    if (!student.stayingSince) errors.push('Staying since is required')
    if (!student.stayingUntil) errors.push('Staying until is required')
  })
  return errors
}

/**
 * Verify Bedrooms
 */
export const validateUpdateBedrooms = (data: StudentRoomDataType[]) => {
  const errors: string[] = []
  data.forEach((room) => {
    if (!room.type) errors.push('Room type is required')
    if (!room.bathType) errors.push('Bathroom type is required')
    if (!room.aditionalFeatures?.length)
      errors.push('Additional features is required')
    if (!room.bedType) errors.push('Bed type is required')
    if (!room.floor) errors.push('Bedroom level is required')
    if (!room.bathroomLocation) errors.push('Bathroom location is required')
    if (!room.availability?.length) errors.push('Availability is required')
  })
  return errors
}

/**
 * Verify Documents
 */
export const validateUpdateDocuments = (data: DocumentDataType) => {
  const errors: string[] = []
  if (!data.family) errors.push('Family is required')
  if (!data.name) errors.push('Name is required')
  if (!data.file) errors.push('Document is required')
  if (!data.owner) errors.push('Owner is required')
  if (!data.remarks) errors.push('Remark is required')
  if (!data.isDeclaration || data.isPoliceCheck)
    errors.push('Type of document is required')

  return errors
}

/**
 * Verify Reviews
 */
export const validateUpdateReviews = (data: ReviewDataType) => {
  const errors: string[] = []

  if (!data.studentName) errors.push('Name is required')
  if (!data.studentNationality) errors.push('Nationality is required')
  if (!data.program) errors.push('Course or program is required')
  if (!data.studentSchool) errors.push('School is required')
  if (!data.date) errors.push('Date is required')
  if (!data.feedback) errors.push('Feedback is required')
  if (!data.treatment) errors.push('Treatment is required')
  if (!data.communication) errors.push('Communication is required')
  if (!data.meals) errors.push('Meals is required')
  if (!data.room) errors.push('Room is required')
  if (!data.overallScore) errors.push('Overall score is required')

  return errors
}

/**
 * Verify Follow Up Actions
 */
 export const validateUpdateFollowUp = (data: followUpActionsType[]) => {
  const errors: string[] = []

  data.forEach((floowUp) => {
    if (!floowUp.actionType) errors.push('Action type is required')
    if (!floowUp.date) errors.push('Date of verification is required')
    if (!floowUp.comments) errors.push('Comments is required')
  })

  return errors
}