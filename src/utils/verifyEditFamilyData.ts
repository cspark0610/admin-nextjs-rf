import type { Family } from 'context/RegisterFamilyContext'

export const verifyEditFamilyData = (
  family: Family | any[] | any,
  actualStep: number
): string[] => {
  switch (actualStep) {
    case 0:
      return verifyUserData(family as Family)
    case 1:
      return verifyHostData(family)
    case 2:
      return verifyFamilyData(family as Family)
    case 3:
      return verifyWelcomeStudentGender(family as any[])
    case 4:
      return verifyLodgingData(family)
    case 5:
      return verifyHomeData(family)
    case 6:
      return verifyTenansError(family)
    default:
      return []
  }
}

const verifyUserData = ({ user }: Family): string[] => {
  const verify = []

  if (!user.first_name) verify.push('First name')
  if (!user.last_name) verify.push('Last name')
  if (!user.email) verify.push('Email')
  else if (!user.email.includes('@')) verify.push('Email')
  if (!user.password) verify.push('Password')
  if (!user.confirmPass) verify.push('Confirm password')

  return verify
}

const verifyHostData = (mainMembers: any): string[] => {
  const verify = []
  if (mainMembers.length === 0) verify.push('Main members')
  else
    mainMembers.map((member, idx) => {
      if (!member.firstName) verify.push(`Member ${idx + 1}: First name`)
      if (!member.lastName) verify.push(`Member ${idx + 1}: Last name`)
      if (!member.email) verify.push(`Member ${idx + 1}: Email`)
      else if (!member.email.includes('@')) verify.push('Email')
      if (!member.occupation) verify.push(`Member ${idx + 1}: Occupation`)
      if (!member.gender) verify.push(`Member ${idx + 1}: Gender`)
      if (!member.birthDate) verify.push(`Member ${idx + 1}: Date of birth`)
      if (!member.mainLanguagesSpokenAtHome)
        verify.push(`Member ${idx + 1}: Main languages spoken at home`)
      if (!member.spokenLanguages)
        verify.push(`Member ${idx + 1}: spoken languages`)
      if (!member.cellPhoneNumber)
        verify.push(`Member ${idx + 1}: Cellphone number`)
    })

  return verify
}

const verifyFamilyData = ({ familyMembers }: Family): string[] => {
  const verify = []
  if (familyMembers.length > 0) {
    familyMembers.map((member, idx) => {
      if (!member.firstName) verify.push(`Member ${idx + 1}: First name`)
      if (!member.lastName) verify.push(`Member ${idx + 1}: Last name`)
      if (!member.gender) verify.push(`Member ${idx + 1}: Gender`)
      if (!member.familyRelationship)
        verify.push(`Member ${idx + 1}: Relationship with primary host`)
      if (!member.birthDate) verify.push(`Member ${idx + 1}: Date of birth`)
      if (!member.spokenLanguages)
        verify.push(`Member ${idx + 1}: Spoken languages`)
      if (!member.situation) verify.push(`Member ${idx + 1}: situation`)
    })
  }
  return verify
}

const verifyWelcomeStudentGender = (
  welcomeStudentGenders: string[]
): string[] => {
  const verify = []
  if (welcomeStudentGenders.length === 0) verify.push('Our family welcomes')

  return verify
}

const verifyLodgingData = (home: any): string[] => {
  const verify = []

  if (!home?.country) verify.push('Country')
  if (!home?.province) verify.push('Province')
  if (!home?.city) verify.push('City')
  if (!home?.postalCode) verify.push('Postal code')
  if (!home?.address) verify.push('Address')

  return verify
}

const verifyHomeData = (home: any): string[] => {
  const verify = []

  if (!home?.homeType) verify.push('House type')
  if (home?.houseRooms?.length === 0) verify.push('Inside')
  if (home?.services?.length === 0) verify.push('Household amenities')
  if (!home.studentRooms || home?.studentRooms.length === 0)
    verify.push('Student Rooms')
  else
    home?.studentRooms.map((room, idx) => {
      if (!room.type) verify.push(`Room ${idx + 1}: Room Type`)
      if (!room.bathType) verify.push(`Room ${idx + 1}: Bath Type`)
      if (!room.bedType) verify.push(`Room ${idx + 1}: Bed Type`)
      if (!room.floor) verify.push(`Room ${idx + 1}: Room location`)
    })

  return verify
}

const verifyTenansError = (family: any): string[] => {
  const verify = []
  if (family.haveTenants === false && family.tenants.length > 0)
    verify.push(
      'You have registered a tenant, you must check the option tenants, or delete the tenants'
    )
  if (
    family.haveExternalStudents === false &&
    family.externalStudents.length > 0
  )
    verify.push(
      'You have registered an external student, you must check the option external students, or delete the external student'
    )

  return verify
}
