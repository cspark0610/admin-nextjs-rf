// main tools
import dayjs from 'dayjs'

// reduers
import { INITIAL_STATE } from './FamilyReducers'

// types
import { HomeDataType, StudentRoomDataType } from 'types/models/Home'
import {
  PetDataType,
  FamilyDataType,
  PictureDataType,
  FamilyMemberDataType,
} from 'types/models/Family'
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { CheckboxChangeParams } from 'primereact/checkbox'
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
 * handle main members change
 */
export const handlePhoneVerificationChanges = (
  state: typeof INITIAL_STATE,
  payload: { ev: CheckboxChangeParams; idx: number }
) => {
  const update = [...state.mainMembers]
  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.checked,
  }

  return { ...state, mainMembers: update }
}

/**
 * handle add/remove picture main member
 */
export const handleAddMainMemberFile = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: {
    file: File
    index?: number
  }
) => {
  const mainMembers = state.mainMembers ? state.mainMembers : []

  if (typeof payload.index === 'number' && mainMembers[payload.index]) {
    mainMembers[payload.index].photo = payload.file
  }

  return {
    ...state,
    mainMembers: [...mainMembers],
  }
}

export const handleRemoveMainMemberFile = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: number
) => {
  const mainMembers = state.mainMembers ? state.mainMembers : []

  if (typeof payload === 'number' && mainMembers[payload])
    mainMembers[payload].photo = null

  return {
    ...state,
    mainMembers: [...mainMembers],
  }
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

/**
 * handle contact account change
 */
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
) => ({
  ...state,
  [payload.ev.target.name]: payload.ev.target.value,
})

/**
 * handle add family member
 */
export const handleAddFamiliar = (state: typeof INITIAL_STATE) => ({
  ...state,
  familyMembers: [...state.familyMembers, { ...INITIAL_FAMILIAR_STATE }],
})

/**
 * handle remove family member
 */
export const handleRemoveFamiliar = (state: typeof INITIAL_STATE) => {
  const update = [...state.familyMembers]
  update.pop()

  return { ...state, familyMembers: update }
}

/**
 * handle add family member
 */
export const addFamilyMember = (
  state: typeof INITIAL_STATE,
  payload: number
) => {
  const update = [...state.familyMembers]

  if (!update[payload]) {
    update[payload] = {}
  }

  return { ...state, familyMembers: update }
}

export const updateFamilyMembers = (
  state: typeof INITIAL_STATE,
  payload: FamilyMemberDataType[]
) => {
  const update = [...(payload || [])]

  return { ...state, familyMembers: update }
}

/**
 * handle remove not created Member
 */
export const removeNotCreatedMember = (
  state: typeof INITIAL_STATE,
  payload: number
) => {
  const update = [...state.familyMembers]

  return {
    ...state,
    familyMembers: update.filter((_, index) => index !== payload),
  }
}

/**
 * handle add family member
 */
export const addPet = (state: typeof INITIAL_STATE, payload: number) => {
  const update = [...state.pets]

  if (!update[payload]) {
    update[payload] = {}
  }

  return { ...state, pets: update }
}

/**
 * handle remove not created Member
 */
export const removeNotCreatedPet = (
  state: typeof INITIAL_STATE,
  payload: number
) => {
  const update = [...state.pets]

  return {
    ...state,
    pets: update.filter((_, index) => index !== payload),
  }
}

/**
 * handle family member data change
 */
export const handleFamiliarChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...state.familyMembers]

  if (!update[payload.idx]) {
    update[payload.idx] = {}
  }

  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { ...state, familyMembers: update }
}

/**
 * handle add family video
 */
export const handleAddFamilyVideo = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: File
) => ({ ...state, video: payload })

/**
 * handle remove family video
 */
export const handleRemoveFamilyVideo = (
  state: typeof INITIAL_STATE | FamilyDataType
) => ({ ...state, video: null })

/**
 * handle add family picture
 */
export const handleAddFamilyPicture = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: File
) => ({
  ...state,
  familyPictures: [
    ...((state as FamilyDataType).familyPictures || []),
    payload,
  ],
})

/**
 * handle add family picture
 */
export const handleRemoveFamilyPicture = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: { picture: PictureDataType }
) => {
  const pictureToRemove = (state as FamilyDataType).familyPictures?.find(
    (pic) => pic === payload.picture
  )

  return {
    ...state,
    familyPictures: (state as FamilyDataType).familyPictures?.filter(
      (pic) => pic !== pictureToRemove
    ),
  }
}

/**
 * handle add pet
 */
export const handleAddPet = (state: typeof INITIAL_STATE) => ({
  ...state,
  pets: [...state.pets, { ...INITIAL_PET_STATE }],
})

/**
 * handle remove pet
 */
export const handleRemovePet = (state: typeof INITIAL_STATE) => {
  const update = [...state.pets]
  update.pop()

  return { ...state, pets: update }
}

/**
 * handle pet data data change
 */
export const handlePetsChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...state.pets]

  if (!update[payload.idx]) update[payload.idx] = {}

  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { ...state, pets: update }
}

/**
 * handle  info change
 */
export const handleLodgingChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType }
) => ({
  ...state,
  home: { ...state.home, [payload.ev.target.name]: payload.ev.target.value },
})

export const handleAddHomeData = (
  state: typeof INITIAL_STATE,
  payload: HomeDataType
) => ({
  ...state,
  home: payload,
})

/**
 * handle add new student room
 */
export const handleAddRoom = (state: typeof INITIAL_STATE) => ({
  ...state,
  home: {
    ...state.home,
    studentRooms: [
      ...(state.home.studentRooms || []),
      { ...INITIAL_ROOM_STATE },
    ],
  },
})

/**
 * handle add new student room
 */
export const handleRemoveRoom = (state: typeof INITIAL_STATE) => {
  const update = [...(state.home.studentRooms || [])]
  update.pop()

  return { ...state, home: { ...state.home, studentRooms: update } }
}

/**
 * handle remove by id new student room
 */
export const handleRemoveRoomByIdx = (
  state: typeof INITIAL_STATE,
  payload: string[]
) => {
  const update = [...(state.home.studentRooms || [])]
  const newUpdate = update.filter(({ _id }) => _id && !payload.includes(_id))

  return { ...state, home: { ...state.home, studentRooms: newUpdate } }
}

/**
 * handle remove family members by id
 */
export const handleRemoveMembersByIdx = (
  state: typeof INITIAL_STATE,
  payload: string[]
) => {
  const update = [...(state.familyMembers || [])]
  const newUpdate = update.filter(({ _id }) => _id && !payload.includes(_id))

  return { ...state, familyMembers: newUpdate }
}

/**
 * handle remove pets by id
 */
export const handleRemovePetsByIdx = (
  state: typeof INITIAL_STATE,
  payload: string[]
) => {
  const update = [...(state.pets || [])]
  const newUpdate = update.filter(({ _id }) => _id && !payload.includes(_id))

  return { ...state, pets: newUpdate }
}

/**
 * handle remove pets by id
 */
export const updatePets = (
  state: typeof INITIAL_STATE,
  payload: PetDataType[]
) => {
  const update = [...(payload || [])]

  return { ...state, pets: update }
}

/**
 * handle student room change
 */
export const handleRoomsChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...(state.home.studentRooms || [])]
  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { ...state, home: { ...state.home, studentRooms: update } }
}

/**
 * handle change student room availability
 */
export const handleAvailabilityChange = (
  state: typeof INITIAL_STATE,
  payload: { value: Date[]; idx: number }
) => {
  const update = [...(state.home.studentRooms || [])]

  update[payload.idx].availability = update[payload.idx].availability
    ? [
        ...(update[payload.idx].availability as Date[]),
        ...getAllDates(payload.value),
      ]
    : getAllDates(payload.value)

  // let i = 0
  // const max = update[payload.idx].availability.length
  // const arrayWithoutDuplicates = []

  // while (i < max) {
  //   const dateToSave =
  //     typeof update[payload.idx].availability[i] === 'string'
  //       ? new Date(update[payload.idx].availability[i])
  //       : update[payload.idx].availability[i]
  //   let found = false

  //   for (let j = 0; j < arrayWithoutDuplicates.length; j++) {
  //     if (
  //       dateToSave.getDate() === arrayWithoutDuplicates[j].getDate() &&
  //       dateToSave.getMonth() === arrayWithoutDuplicates[j].getMonth() &&
  //       dateToSave.getFullYear() === arrayWithoutDuplicates[j].getFullYear()
  //     )
  //       found = true
  //     if (found) break
  //   }

  //   if (!found) arrayWithoutDuplicates.push(dateToSave)

  //   i++
  // }

  // update[payload.idx].availability = arrayWithoutDuplicates

  return { ...state, home: { ...state.home, studentRooms: update } }
}

/**
 * handle remove available dates
 */
export const handleRemoveAvailability = (
  state: typeof INITIAL_STATE,
  payload: { value: Date[]; idx: number }
) => {
  const remove = [
    ...((state.home.studentRooms &&
      state.home.studentRooms) as StudentRoomDataType[]),
  ]

  const itemsToRemove = [
    ...getAllDates(payload.value)
      .filter(
        (item: Date) =>
          remove[payload.idx].availability
            ?.map((item) => (item as Date).toISOString())
            .indexOf(item.toISOString()) !== -1
      )
      .map((item: Date) => item.toISOString()),
  ]

  const removedItems = (remove[payload.idx].availability as Date[])?.filter(
    (item) => itemsToRemove.indexOf(item.toISOString()) === -1
  )

  remove[payload.idx].availability = removedItems

  return { ...state, home: { ...state.home, studentRooms: remove } }
}

/**
 * handle clear availability calendar
 */
export const handleClearAvailability = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...(state.home.studentRooms || [])]
  update[payload.idx] = { ...update[payload.idx], availability: [] }

  return { ...state, home: { ...state.home, studentRooms: update } }
}

/**
 * handle change family internal data
 */
export const handleInternalDataChange = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: ChangeType
) => ({
  ...state,
  familyInternalData: {
    ...(state as FamilyDataType).familyInternalData,
    [payload.target.name]: payload.target.value,
  },
})

/**
 * handle add home video
 */
export const handleAddHomeVideo = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: File
) => ({ ...state, home: { ...(state as FamilyDataType).home, video: payload } })

/**
 * handle remove home video
 */
export const handleRemoveHomeVideo = (
  state: typeof INITIAL_STATE | FamilyDataType
) => ({
  ...state,
  home: { ...(state as FamilyDataType).home, video: null },
})

/**
 * handle add home pictures
 */
export const handleAddHomePictures = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: { file: File; category: string }
) => {
  const group = state.home?.photoGroups?.find(
    (photoGroup) => photoGroup.name === payload.category
  ) || { name: payload.category, photos: [] }

  const update =
    state.home?.photoGroups?.filter(
      (photoGroup) => photoGroup.name !== payload.category
    ) || []

  group.photos.push(payload.file)

  update.push(group)

  return { ...state, home: { ...state.home, photoGroups: update } }
}

/**
 * handle remove home pictures
 */
export const handleRemoveHomePictures = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: { picture: File; category: string }
) => {
  const group = state.home?.photoGroups?.find(
    (photoGroup) => photoGroup.name === payload.category
  )
  const updateGroup = {
    name: group?.name,
    photos: group?.photos.filter((pic) => pic !== payload.picture),
  }
  const updatePhotoGroups =
    state.home?.photoGroups?.filter(
      (photoGroup) => photoGroup.name !== payload.category
    ) || []
  updatePhotoGroups.push(
    updateGroup as { name: string; photos: (File | PictureDataType)[] }
  )

  return { ...state, home: { ...state.home, photoGroups: updatePhotoGroups } }
}

// ---------------- INITIAL STATES ----------------
export const INITIAL_MAIN_MEMBER_STATE = {
  email: '',
  photo: null,
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

export const INITIAL_ROOM_STATE = {
  type: null,
  photos: [],
  floor: null,
  bedType: null,
  roomNumber: 0,
  bathType: null,
  availability: [],
  aditionalFeatures: [],
  bathroomLocation: 'IN_THE_ROOM',
}

const INITIAL_SCHOOLS_STATE = {
  school: {},
  transports: [],
}

// ------------------------- UTILS -------------------------

/**
 * handle get all dates between two other dates
 */
const getAllDates = ([start, end]: Date[]) => {
  const formattedStart = dayjs(start)
  const formattedEnd = dayjs(end)
  let actualDate = formattedStart
  const updateDates = []

  while (actualDate.isBefore(formattedEnd) || actualDate.isSame(formattedEnd)) {
    updateDates.push(actualDate.toDate())
    actualDate = actualDate.add(1, 'days')
  }

  return updateDates
}
