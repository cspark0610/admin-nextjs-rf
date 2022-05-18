// types
import {
  PetDataType,
  FamilyDataType,
  TenantDataType,
  FamilyMemberDataType,
  ExternalStudentDataType,
} from 'types/models/Family'
import { ReviewDataType } from 'types/models/Review'
import { StudentRoomDataType } from 'types/models/Home'
import { DocumentDataType } from 'types/models/Documents'

type validateUpdateFamilyProps = {
  data: FamilyDataType
}

export const validateUpdateFamily = ({
  data,
}: validateUpdateFamilyProps): string => {
  let errors = ''

  /**
   * Verify Host Data
   */
  data.mainMembers?.forEach((member, idx) => {
    if (idx === 1 && !member.relationshipWithThePrimaryHost)
      return (errors = 'Relationship with the primary host is required')
    if (!member.cellPhoneNumber)
      return (errors = 'Cell phone number is required')
    if (!member.spokenLanguages?.length)
      return (errors = 'What language(s) do you speak? is required')
    if (idx === 0 && !member.mainLanguagesSpokenAtHome?.length)
      return (errors = 'Main languages spoken at home is required')
    if (!member.gender) return (errors = 'Gender is required')
    if (!member.occupation && !member.occupationFreeComment)
      return (errors = 'Occupation is required')
    if (!member.email) return (errors = 'Email is required')
    if (!member.lastName) return (errors = 'Last name is required')
    if (!member.firstName) return (errors = 'First name is required')
  })

  if (errors) return errors

  /**
   * Verify Home Data
   */
  if (!data.home?.homeType) return 'Home type is required'
  if (!data.home.houseRooms?.length) return 'Inside rooms is required'
  if (!data.home.services?.length) return 'Household amenities is required'
  if (!data.home?.country) return 'Country is required'
  if (!data.home?.province) return 'Province is required'
  if (!data.home?.city) return 'City is required'
  if (!data.home?.address) return 'Address is required'
  if (!data.home?.postalCode) return 'Postal code is required'

  /**
   * Verify Family Data
   */
  if (!data.welcomeStudentGenders?.length)
    return 'Our family welcomes is required'

  return ''
}

/**
 * Verify FamilyMembers
 */
export const validateUpdateFamilyMembers = (data: FamilyMemberDataType[]) => {
  let error = ''
  data.forEach((member) => {
    // if (!member.situation) error = 'Situation is required'
    // if (!member.familyRelationship) error = 'Family relationship is required'
    if (!member.spokenLanguages?.length)
      error = 'What language(s) do you speak? is required'
    if (!member.gender) error = 'Gender is required'
    if (!member.lastName) error = 'Last name is required'
    if (!member.firstName) error = 'First name is required'
  })
  return error
}

/**
 * Verify Pets
 */
export const validateUpdatePets = (data: PetDataType[]) => {
  let error = ''
  data.forEach((pet) => {
    if (!pet.type) error = 'Species is required'
  })
  return error
}

/**
 * Verify Tenants
 */
export const validateUpdateTenants = (data: TenantDataType[]) => {
  let error = ''
  data.forEach((tenant) => {
    if (!tenant.firstName) error = 'FirstName is required'
    if (!tenant.lastName) error = 'LastName is required'
    if (!tenant.gender) error = 'Gender is required'
    if (!tenant.occupation) error = 'Occupation is required'
  })
  return error
}

/**
 * Verify External Student
 */
export const validateUpdateExternalStudent = (
  data: ExternalStudentDataType[]
) => {
  let error = ''
  data.forEach((student) => {
    if (!student.name) error = 'FirstName is required'
    if (!student.gender) error = 'Gender is required'
    if (!student.nationality) error = 'Nationality is required'
    if (!student.stayingSince) error = 'Staying since is required'
    if (!student.stayingUntil) error = 'Staying until is required'
  })
  return error
}

/**
 * Verify Bedrooms
 */
export const validateUpdateBedrooms = (data: StudentRoomDataType[]) => {
  let error = ''
  data.forEach((room) => {
    if (!room.type) error = 'Room type is required'
    if (!room.bathType) error = 'Bathroom type is required'
    if (!room.aditionalFeatures?.length)
      error = 'Additional features is required'
    if (!room.bedType) error = 'Bed type is required'
    if (!room.floor) error = 'Bedroom level is required'
    if (!room.bathroomLocation) error = 'Bathroom location is required'
    if (!room.availability?.length) error = 'Availability is required'
  })
  return error
}

/**
 * Verify Documents
 */
export const validateUpdateDocuments = (data: DocumentDataType) => {
  // if (!data.family) return 'Family is required'
  if (!data.name) return 'Name is required'
  if (!data.file) return 'Document is required'
  // if (!data.owner) return 'Owner is required'
  if (!data.remarks) return 'Remark is required'
  // if (!data.isDeclaration || data.isPoliceCheck)
  //   return 'Type of document is required'
}

/**
 * Verify Reviews
 */
export const validateUpdateReviews = (data: ReviewDataType) => {
  if (!data.studentName) return 'Name is required'
  if (!data.studentNationality) return 'Nationality is required'
  if (!data.program) return 'Course or program is required'
  if (!data.studentSchool) return 'School is required'
  if (!data.date) return 'Date is required'
  if (!data.feedback) return 'Feedback is required'
  if (!data.treatment) return 'Treatment is required'
  if (!data.communication) return 'Communication is required'
  if (!data.meals) return 'Meals is required'
  if (!data.room) return 'Room is required'
  if (!data.overallScore) return 'Overall score is required'
}
