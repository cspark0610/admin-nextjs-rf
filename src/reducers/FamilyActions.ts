// main tools
import dayjs from 'dayjs'

// reduers
import { INITIAL_STATE } from './FamilyReducers'

// types
import {
  PetDataType,
  FamilyDataType,
  TenantDataType,
  SchoolDataType,
  PictureDataType,
  FamilyMemberDataType,
  FamilyLocationDataType,
  ExternalStudentDataType,
  followUpActionsType,
} from 'types/models/Family'
import { HomeDataType, StudentRoomDataType } from 'types/models/Home'
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { GenericDataType } from 'types/models/Generic'
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
 * handle location data change
 */
export const handleFamilyLocationChange = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: FamilyLocationDataType
) => ({
  ...state,
  location: {
    ...(state as FamilyDataType).location,
    latitude: payload.latitude || (state as FamilyDataType).location?.latitude,
    longitude:
      payload.longitude || (state as FamilyDataType).location?.longitude,
  },
})

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
 * handle external student data change
 */
export const handleStudentChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...state.noRedLeafStudentsList]

  if (!update[payload.idx]) update[payload.idx] = {}

  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { ...state, noRedLeafStudentsList: update }
}

/**
 * handle add external student
 */
export const addStudent = (state: typeof INITIAL_STATE, payload: number) => {
  const update = [...state.noRedLeafStudentsList]

  if (!update[payload]) {
    update[payload] = {}
  }

  return {
    ...state,
    noRedLeafStudents: true,
    noRedLeafStudentsList: update,
  }
}

/**
 * handle remove not created external student
 */
export const removeNotCreatedStudent = (
  state: typeof INITIAL_STATE,
  payload: number
) => {
  const update = [...state.noRedLeafStudentsList]
  const newUpdate = update.filter((_, index) => index !== payload)

  return {
    ...state,
    noRedLeafStudents: !newUpdate.length ? false : true,
    noRedLeafStudentsList: newUpdate,
  }
}

/**
 * handle remove external student by id
 */
export const handleRemoveStudentByIdx = (
  state: typeof INITIAL_STATE,
  payload: string[]
) => {
  const update = [...(state.noRedLeafStudentsList || [])]
  const newUpdate = update.filter(({ _id }) => _id && !payload.includes(_id))

  return {
    ...state,
    noRedLeafStudents: !newUpdate.length ? false : true,
    noRedLeafStudentsList: newUpdate,
  }
}

/**
 * handle update external student
 */
export const updateStudent = (
  state: typeof INITIAL_STATE,
  payload: ExternalStudentDataType[]
) => {
  const update = [...(payload || [])]

  return { ...state, noRedLeafStudentsList: update }
}

/**
 * handle external student data change
 */
export const handleTenantsChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...state.tenantList]

  if (!update[payload.idx]) update[payload.idx] = {}

  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { ...state, tenantList: update }
}

/**
 * handle add external student
 */
export const addTenant = (state: typeof INITIAL_STATE, payload: number) => {
  const update = [...state.tenantList]

  if (!update[payload]) {
    update[payload] = {}
  }

  return {
    ...state,
    tenants: true,
    tenantList: update,
  }
}

/**
 * handle remove not created external student
 */
export const removeNotCreatedTenant = (
  state: typeof INITIAL_STATE,
  payload: number
) => {
  const update = [...state.tenantList]
  const newUpdate = update.filter((_, index) => index !== payload)

  return {
    ...state,
    tenantList: newUpdate,
  }
}

/**
 * handle remove external student by id
 */
export const handleRemoveTenantByIdx = (
  state: typeof INITIAL_STATE,
  payload: string[]
) => {
  const update = [...(state.tenantList || [])]
  const newUpdate = update.filter(({ _id }) => _id && !payload.includes(_id))

  return {
    ...state,
    tenantList: newUpdate,
  }
}

/**
 * handle update external student
 */
export const updatetenant = (
  state: typeof INITIAL_STATE,
  payload: TenantDataType[]
) => {
  const update = [...(payload || [])]

  return { ...state, tenantList: update }
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

/**
 * handle Services change
 */
 export const handleServicesChange = (
  state: typeof INITIAL_STATE,
  payload: { name: string, value: string }
) => ({
  ...state,
  home: { ...state.home, [payload.name]: payload.value },
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
 * handle add home pictures
 */
export const handleAddStudentRoomPictures = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: { file: File; bedroomIdx: number }
) => {
  const rooms = state.home?.studentRooms as StudentRoomDataType[]

  rooms[payload.bedroomIdx].photos = [
    ...(rooms[payload.bedroomIdx].photos || []),
    payload.file,
  ]

  return { ...state, home: { ...state.home, studentRooms: rooms } }
}

/**
 * handle remove home pictures
 */
export const handleRemoveStudentRoomPictures = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: { picture: File; bedroomIdx: number }
) => {
  const rooms = state.home?.studentRooms as StudentRoomDataType[]
  const pictureToRemove = rooms[payload.bedroomIdx].photos?.find(
    (pic) => pic === payload.picture
  )
  rooms[payload.bedroomIdx].photos = rooms[payload.bedroomIdx].photos?.filter(
    (pic) => pic !== pictureToRemove
  )

  return { ...state, home: { ...state.home, studentRooms: rooms } }
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

export const updateStudentRooms = (
  state: typeof INITIAL_STATE,
  payload: StudentRoomDataType[]
) => {
  const update = [...(payload || [])]

  return { ...state, home: { ...state.home, studentRooms: update } }
}

/**
 * handle remove not created Member
 */
export const removeNotCreatedBedrooms = (
  state: typeof INITIAL_STATE,
  payload: number
) => {
  const update = [...(state.home.studentRooms as StudentRoomDataType[])]

  return {
    ...state,
    home: {
      ...state,
      studentRooms: update.filter((_, index) => index !== payload),
    },
  }
}

/**
 * handle add schools
 */
export const handleAddSchool = (
  state: typeof INITIAL_STATE | FamilyDataType
) => ({
  ...state,
  schools: [
    ...((state as FamilyDataType).schools as SchoolDataType[]),
    { ...INITIAL_SCHOOLS_STATE },
  ],
})

/**
 * handle remove schools by id
 */
export const handleRemoveSchoolsByIdx = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: string[]
) => {
  const update = [...((state as FamilyDataType).schools || [])]
  const newUpdate = update.filter(
    ({ school }) => school._id && !payload.includes(school._id)
  )

  return { ...state, schools: newUpdate }
}

/**
 * handle update school
 */
export const updateSchools = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: SchoolDataType[]
) => {
  const update = [...(payload || [])]

  return { ...state, schools: update }
}

/**
 * handle remove not created school
 */
export const removeNotCreatedSchools = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: number
) => {
  const update = [...((state as FamilyDataType).schools || [])]
  const newUpdate = update.filter((_, index) => index !== payload)

  return { ...state, schools: newUpdate }
}

/**
 * handle school data change
 */
export const handleSchoolChange = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: { ev: ChangeType; idx: number }
) => {
  const update = [...((state as FamilyDataType).schools || [])]

  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { ...state, schools: update }
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
 * handle change Observations
 */
export const handleObservationsChange = (
  state: typeof INITIAL_STATE | FamilyDataType,
  payload: { name: string, value: string[] }
) => ({
  ...state,
  familyInternalData: {
    ...state.familyInternalData,
    [payload.name]: payload.value,
  },
})

/**
 * handle add Follow Up
 */
export const handleAddFollowUp = (state: typeof INITIAL_STATE) => ({
  ...state,
  familyInternalData: {
    ...state.familyInternalData,
    followUpActions: [
      ...(state.familyInternalData.followUpActions || []),
      { ...INITIAL_FOLLOW_UP_ACTIONS },
    ],
  },
})

/**
 * handle change Follow Up
 */
export const handleFollowUpChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: DropdownChangeParams; idx: number }
) => {
  const update = [...(state.familyInternalData.followUpActions || [])]
  update[payload.idx] = {
    ...update[payload.idx],
    [payload.ev.target.name]: payload.ev.target.value,
  }

  return { 
    ...state,
    familyInternalData: {
      ...state.familyInternalData,
      followUpActions: update 
    }
  }
}

/**
 * update FollowUp
 */
export const updateFollowUp = (
  state: typeof INITIAL_STATE,
  payload: followUpActionsType[]
) => {
  const update = [...(payload || [])]

  return { 
    ...state,
    familyInternalData: {
      ...state.familyInternalData,
      followUpActions: update 
    }
  }
}

/**
 * handle remove Follow Up
 */
export const handleRemoveFollowUpByIdx = (
  state: typeof INITIAL_STATE,
  payload: string[]
) => {
  const update = [...(state.familyInternalData.followUpActions || [])]
  const newUpdate = update.filter(({ _id }) => _id && !payload.includes(_id))

  return { 
    ...state,
    familyInternalData: {
      ...state.familyInternalData,
      followUpActions: newUpdate 
    }
  }
}

/**
 * handle remove not create Follow Up
 */
export const removeNotCreatedFollowUp = (state: typeof INITIAL_STATE) => {
  const update = [...(state.familyInternalData.followUpActions || [])]
  update.pop()

  return { 
    ...state,
    familyInternalData: { 
      ...state.familyInternalData,
      followUpActions: update 
    }
  }
}

/**
 * handle add Workshops
 */
export const handleAddWorkshops = (
  state: typeof INITIAL_STATE,
  payload: number
) => {
  const update = [...state.familyInternalData.workshopsAttended as GenericDataType[]]
  update[payload] = {}

  return { 
    ...state,
    familyInternalData: {
      ...state.familyInternalData,
      workshopsAttended: update 
    }
  }
}

/**
 * handle change Workshops
 */
export const handleWorkshopsChange = (
  state: typeof INITIAL_STATE,
  payload: { ev: DropdownChangeParams; idx: number }
) => {
  const update = [...state.familyInternalData.workshopsAttended as GenericDataType[]]
  update[payload.idx] = payload.ev.target.value

  return { 
    ...state,
    familyInternalData: {
      ...state.familyInternalData,
      workshopsAttended: update 
    }
  }
}

/**
 * update Workshops
 */
export const updateWorkshops = (
  state: typeof INITIAL_STATE,
  payload: GenericDataType[]
) => {
  const update = [...(payload || [])]

  return { 
    ...state,
    familyInternalData: {
      ...state.familyInternalData,
      workshopsAttended: update 
    }
  }
}

/**
 * handle remove Workshops
 */
export const handleRemoveWorkshopsByIdx = (
  state: typeof INITIAL_STATE,
  payload: string[]
) => {
  const update = [...(state.familyInternalData.workshopsAttended || [])]
  const newUpdate = update.filter(({ _id }) => _id && !payload.includes(_id))

  return { 
    ...state,
    familyInternalData: {
      ...state.familyInternalData,
      workshopsAttended: newUpdate 
    }
  }
}

/**
 * handle remove not create Workshops
 */
export const removeNotCreatedWorkshops = (state: typeof INITIAL_STATE) => {
  const update = [...(state.familyInternalData.workshopsAttended || [])]
  update.pop()

  return { 
    ...state,
    familyInternalData: { 
      ...state.familyInternalData,
      workshopsAttended: update 
    }
  }
}

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

const INITIAL_ROOM_STATE = {
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
  school: null,
  transports: [],
}

const INITIAL_FOLLOW_UP_ACTIONS = {
  actionType: '',
  comments: '',
  date: '',
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
