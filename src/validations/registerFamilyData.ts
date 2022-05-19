import { INITIAL_STATE } from 'reducers/FamilyReducers'

type validateRegisterFamilyProps = {
  idx: number
  data: typeof INITIAL_STATE
}

export const validateRegisterFamily = ({
  idx,
  data,
}: validateRegisterFamilyProps): string => {
  switch (idx) {
    case 0:
      return verifyUserData(data)
    case 1:
      return verifyHostsData(data)
    case 2:
      return familyMembersData(data)
    case 3:
      return preferencesData(data)
    case 4:
      return lodgingData(data)
    case 5:
      return homeData(data)
    default:
      return ''
  }
}

const verifyUserData = (data: typeof INITIAL_STATE) => {
  if (!data.user.firstName) return 'First name is required'
  if (!data.user.lastName) return 'Last name is required'
  if (!data.user.email) return 'Email is required'
  if (!data.user.userType) return 'User type is required'
  if (!data.user.password) return 'Password is required'
  if (
    data.user.confirmPassword &&
    data.user.confirmPassword !== data.user.password
  )
    return "Passwords aren't equals"

  return ''
}

const verifyHostsData = (data: typeof INITIAL_STATE) => {
  let error = ''
  data.mainMembers.forEach((member, idx: number) => {
    if (idx === 1 && !member.relationshipWithThePrimaryHost)
      error = 'Relationship with the primary host is required'
    if (!member.cellPhoneNumber) error = 'Cell phone number is required'
    if (!member.spokenLanguages)
      error = 'What language(s) do you speak? is required'
    if (idx === 0 && !member.mainLanguagesSpokenAtHome)
      error = 'Main languages spoken at home is required'
    if (!member.birthDate) error = 'D.O.B is required'
    if (!member.gender) error = 'Gender is required'
    if (!member.occupation && !member.occupationFreeComment)
      error = 'Occupation is required'
    if (!member.email) error = 'Email is required'
    if (!member.lastName) error = 'Last name is required'
    if (!member.firstName) error = 'First name is required'
  })

  return error
}

const familyMembersData = (data: typeof INITIAL_STATE) => {
  let error = ''
  data.familyMembers.forEach((member) => {
    if (!member.situation) error = 'Situation is required'
    if (!member.familyRelationship) error = 'Family relationship is required'
    if (member.spokenLanguages?.length === 0)
      error = 'What language(s) do you speak? is required'
    if (!member.gender) error = 'Gender is required'
    if (!member.lastName) error = 'Last name is required'
    if (!member.firstName) error = 'First name is required'
  })
  return error
}

const preferencesData = (data: typeof INITIAL_STATE) => {
  let error = ''

  if (data.welcomeStudentGenders.length === 0)
    return 'Our family welcomes is required'
  data.pets.forEach((pet) => {
    if (!pet.type) error = 'Species is required'
  })

  return error
}

const lodgingData = (data: typeof INITIAL_STATE) => {
  let error = ''

  if (!data.home.country) return 'Country is required'
  if (!data.home.province) return 'Province is required'
  if (!data.home.city) return 'City is required'
  if (!data.home.address) return 'Address is required'
  if (!data.home.postalCode) return 'Postal code is required'
  if (!data.home.mainIntersection) return 'Main intersection is required'
  if (!data.home.description) return 'Description is required'

  return error
}

const homeData = (data: typeof INITIAL_STATE) => {
  let error = ''

  if (!data.home.homeType) return 'Home type is required'
  if (data.home.houseRooms?.length === 0) return 'Inside rooms is required'
  if (data.home.services?.length === 0) return 'Household amenities is required'
  if (data.home.nearbyServices?.length === 0)
    return 'Nearby services is required'

  if (data.home.studentRooms?.length === 0) return 'Bedrooms is required'
  data.home.studentRooms?.forEach((room) => {
    if (!room.type) error = 'Room type is required'
    if (!room.bathType) error = 'Bathroom type is required'
    if (room.aditionalFeatures?.length === 0)
      error = 'Additional features is required'
    if (!room.bedType) error = 'Bed type is required'
    if (!room.floor) error = 'Bedroom level is required'
    if (!room.bathroomLocation) error = 'Bathroom location is required'
  })

  return error
}
