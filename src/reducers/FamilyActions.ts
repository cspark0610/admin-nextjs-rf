// reduers
import { INITIAL_STATE } from './FamilyReducers'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { ChangeType } from 'types'

// ------------------- HANDLERS -------------------
/**
 * handle user change
 */
export const handleChangeUser = (
  state: typeof INITIAL_STATE,
  payload: ChangeType
) => ({
  ...state,
  user: { ...state.user, [payload.target.name]: payload.target.value },
})

/**
 * handle main members change
 */
export const handleMainMemberChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...state.mainMembers]
  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { ...state, mainMembers: update }
}

/**
 * handle add/remove other main member
 */
export const handleOtherMainMember = (
  state: typeof INITIAL_STATE,
  payload: { ev: SelectButtonChangeParams }
) => {
  if (payload.ev.value)
    state.mainMembers.length === 1 &&
      state.mainMembers.push({ ...INITIAL_MAIN_MEMBER_STATE })
  else state.mainMembers.length === 2 && state.mainMembers.pop()

  return { ...state }
}

export const handleContactAccountChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType }
) => ({
  ...state,
  contactAccounts: {
    ...state.contactAccounts,
    [payload.ev.target.name]: payload.ev.target.value,
  },
})

/**
 * handle family info change
 */
export const handleFamilyInfoChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType }
) => ({ ...state, [payload.ev.target.name]: payload.ev.target.value })

// ---------------- INITIAL STATES ----------------
export const INITIAL_MAIN_MEMBER_STATE = {
  email: '',
  gender: null,
  lastName: '',
  firstName: '',
  birthDate: null,
  occupation: null,
  cellPhoneNumber: '',
  homePhoneNumber: '',
  workPhoneNumber: '',
  spokenLanguages: null,
  occupationFreeComment: '',
  mainLanguagesSpokenAtHome: null,
  relationshipWithThePrimaryHost: null,
}

const INITIAL_FAMILIAR_STATE = {
  lastName: '',
  gender: null,
  firstName: '',
  situation: '',
  birthDate: null,
  spokenLanguages: [],
  familyRelationship: null,
}

const INITIAL_PET_STATE = {
  age: 0,
  name: '',
  race: '',
  type: null,
  remarks: '',
  isHipoalergenic: null,
}

const INITIAL_ROOM_STATE = {
  type: null,
  photos: [],
  floor: null,
  bedType: null,
  roomNumber: 0,
  bathType: null,
  availability: [],
  bathroomLocation: '',
  aditionalFeatures: [],
}

const INITIAL_SCHOOLS_STATE = {
  school: {},
  transports: [],
}
