// types
import { FamilyDataType } from 'types/models/Family'

type validateUpdateFamilyProps = {
  data: FamilyDataType
}

export const validateUpdateFamily = ({
  data,
}: validateUpdateFamilyProps): string[] => {
  const errors: string[] = []

  errors.push(...verifyUserData(data))
  //   errors.concat(verifyHostsData(data))
  //   errors.concat(familyMembersData(data))
  //   errors.concat(preferencesData(data))
  //   errors.concat(lodgingData(data))
  //   errors.concat(homeData(data))

  return errors
}

const verifyUserData = (data: FamilyDataType): string[] => {
  const errors: string[] = []
  data.mainMembers?.forEach((member, idx: number) => {
    if (!member.occupation) errors.push('Occupation is required')
    if (!member.gender) errors.push('Gender is required')
    if (idx === 0 && member.mainLanguagesSpokenAtHome?.length === 0)
      errors.push('Main language(s) spoken at home is required')
    if (member.spokenLanguages?.length === 0)
      errors.push('What language(s) do you speak? is required')
    if (!member.cellPhoneNumber) errors.push('Cell phone number is required')
    if (idx === 1 && !member.relationshipWithThePrimaryHost)
      errors.push('Relation with the primary host is required')
  })

  return errors
}

const verifyHostsData = (data: FamilyDataType): string[] => {
  let error: string[] = []

  return error
}

const familyMembersData = (data: FamilyDataType): string[] => {
  let error: string[] = []

  return error
}

const preferencesData = (data: FamilyDataType): string[] => {
  let error: string[] = []

  return error
}

const lodgingData = (data: FamilyDataType): string[] => {
  let error: string[] = []

  return error
}

const homeData = (data: FamilyDataType): string[] => {
  let error: string[] = []

  return error
}
