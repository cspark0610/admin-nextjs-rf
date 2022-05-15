// actions
import * as ACTION from './FamilyActions'

// types
import {
  PetDataType,
  TenantDataType,
  FamilyMemberDataType,
  FamilyLocationDataType,
  ExternalStudentDataType,
} from 'types/models/Family'
import { HomeDataType } from 'types/models/Home'
import { UserDataType } from 'types/models/User'

export function FamilyManagement(
  state: typeof INITIAL_STATE,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    // ----------------------- USER ------------------------
    case 'user':
      return ACTION.handleChangeUser(state, action.payload)
    // --------------------- ANFITRION ---------------------
    case 'mainMembers':
      return ACTION.handleMainMemberChange(state, action.payload)
    case 'handlePhoneVerificationChanges':
      return ACTION.handlePhoneVerificationChanges(state, action.payload)
    case 'handleAddMainMembersPhoto':
      return ACTION.handleAddMainMemberFile(state, action.payload)
    case 'handleRemoveMainMembersPhoto':
      return ACTION.handleRemoveMainMemberFile(state, action.payload)
    case 'otherMainMember':
      return ACTION.handleOtherMainMember(state, action.payload)
    case 'handleContactAccountChange':
      return ACTION.handleContactAccountChange(state, action.payload)
    // ---------------------- FAMILY --------------------------
    case 'familyInfo':
      return ACTION.handleFamilyInfoChange(state, action.payload)
    case 'addFamilyMember':
      return ACTION.addFamilyMember(state, action.payload)
    case 'updateFamilyMembers':
      return ACTION.updateFamilyMembers(state, action.payload)
    case 'removeNotCreatedMember':
      return ACTION.removeNotCreatedMember(state, action.payload)
    case 'handleFamiliarChange':
      return ACTION.handleFamiliarChange(state, action.payload)
    case 'handleAddFamiliar':
      return ACTION.handleAddFamiliar(state)
    case 'handleRemoveFamiliar':
      return ACTION.handleRemoveFamiliar(state)
    case 'handleRemoveMembersByIdx':
      return ACTION.handleRemoveMembersByIdx(state, action.payload)
    case 'handleAddFamilyVideo':
      return ACTION.handleAddFamilyVideo(state, action.payload)
    case 'handleRemoveFamilyVideo':
      return ACTION.handleRemoveFamilyVideo(state)
    case 'handleAddFamilyPicture':
      return ACTION.handleAddFamilyPicture(state, action.payload)
    case 'handleRemoveFamilyPicture':
      return ACTION.handleRemoveFamilyPicture(state, action.payload)
    case 'handleFamilyLocationChange':
      return ACTION.handleFamilyLocationChange(state, action.payload)
    // ------------------- PETS -------------------------
    case 'handlePetsChange':
      return ACTION.handlePetsChange(state, action.payload)
    case 'addPet':
      return ACTION.addPet(state, action.payload)
    case 'removeNotCreatedPet':
      return ACTION.removeNotCreatedPet(state, action.payload)
    case 'handleAddPet':
      return ACTION.handleAddPet(state)
    case 'handleRemovePet':
      return ACTION.handleRemovePet(state)
    case 'handleRemovePetsByIdx':
      return ACTION.handleRemovePetsByIdx(state, action.payload)
    case 'updatePets':
      return ACTION.updatePets(state, action.payload)
    // ------------- EXTERNAL STUDENTS -------------------
    case 'handleStudentChange':
      return ACTION.handleStudentChange(state, action.payload)
    case 'addStudent':
      return ACTION.addStudent(state, action.payload)
    case 'removeNotCreatedStudent':
      return ACTION.removeNotCreatedStudent(state, action.payload)
    case 'handleRemoveStudentByIdx':
      return ACTION.handleRemoveStudentByIdx(state, action.payload)
    case 'updateStudent':
      return ACTION.updateStudent(state, action.payload)
    // ----------------- Tenants -----------------------
    case 'handleTenantsChange':
      return ACTION.handleTenantsChange(state, action.payload)
    case 'addTenant':
      return ACTION.addTenant(state, action.payload)
    case 'removeNotCreatedTenant':
      return ACTION.removeNotCreatedTenant(state, action.payload)
    case 'handleRemoveTenantByIdx':
      return ACTION.handleRemoveTenantByIdx(state, action.payload)
    case 'updatetenant':
      return ACTION.updatetenant(state, action.payload)
    // ------------------- LODGING ----------------------
    case 'handleLodgingChange':
      return ACTION.handleLodgingChange(state, action.payload)
    // ------------------- GUESTS -----------------------
    case 'addHomeData':
      return ACTION.handleAddHomeData(state, action.payload)
    case 'handleRoomsChange':
      return ACTION.handleRoomsChange(state, action.payload)
    case 'handleAvailabilityChange':
      return ACTION.handleAvailabilityChange(state, action.payload)
    case 'handleRemoveAvailability':
      return ACTION.handleRemoveAvailability(state, action.payload)
    case 'handleClearAvailability':
      return ACTION.handleClearAvailability(state, action.payload)
    case 'updateStudentRooms':
      return ACTION.updateStudentRooms(state, action.payload)
    case 'removeNotCreatedBedrooms':
      return ACTION.removeNotCreatedBedrooms(state, action.payload)
    case 'handleAddRoom':
      return ACTION.handleAddRoom(state)
    case 'handleRemoveRoom':
      return ACTION.handleRemoveRoom(state)
    case 'handleAddHomeVideo':
      return ACTION.handleAddHomeVideo(state, action.payload)
    case 'handleRemoveHomeVideo':
      return ACTION.handleRemoveHomeVideo(state)
    case 'handleAddHomePicture':
      return ACTION.handleAddHomePictures(state, action.payload)
    case 'handleRemoveHomePicture':
      return ACTION.handleRemoveHomePictures(state, action.payload)
    case 'handleRemoveRoomByIdx':
      return ACTION.handleRemoveRoomByIdx(state, action.payload)
    // -------------- FAMILY INTERNAL DATA --------------
    case 'handleInternalDataChange':
      return ACTION.handleInternalDataChange(state, action.payload)
    // ------------------- SCHOOLS ----------------------
    // case 'handleAddSchool':
    //   return ACTION.handleAddSchool(state)
    // case 'handleRemoveSchool':
    //   return ACTION.handleRemoveSchool(state, action.payload)
    // case 'handleSchoolChange':
    //   return ACTION.handleSchoolChange(state, action.payload)
    // --------------------- RESET INFO --------------------
    case 'reset':
      return { ...action.payload }
    // --------------------- DEFAULT -----------------------
    default:
      return { ...state }
  }
}

export const INITIAL_STATE = {
  tenants: false,
  interests: [],
  location: {
    latitude: NaN,
    longitude: NaN,
    description: '',
  } as FamilyLocationDataType,
  specialDiet: null,
  contactAccounts: {},
  acceptableDiets: [],
  rulesForStudents: [],
  culturalActivities: [],
  noRedLeafStudents: false,
  pets: [] as PetDataType[],
  welcomeStudentGenders: [],
  tenantList: [] as TenantDataType[],
  familyMembers: [] as FamilyMemberDataType[],
  mainMembers: [{ ...ACTION.INITIAL_MAIN_MEMBER_STATE }],
  noRedLeafStudentsList: [] as ExternalStudentDataType[],
  user: {
    email: '',
    lastName: '',
    password: '',
    firstName: '',
    confirmPassword: '',
    userType: undefined,
  } as UserDataType,
  home: {
    address: '',
    services: [],
    postalCode: '',
    houseRooms: [],
    description: '',
    city: undefined,
    studentRooms: [],
    nearbyServices: [],
    country: undefined,
    province: undefined,
    homeType: undefined,
    cityFreeComment: '',
    mainIntersection: '',
  } as HomeDataType,
}
