// actions
import * as ACTION from "./FamilyActions";

// types
import { FamilyMemberDataType, PetDataType } from "types/models/Family";
import { HomeDataType } from "types/models/Home";
import { UserDataType } from "types/models/User";

export function FamilyManagement(
  state: typeof INITIAL_STATE,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    // ----------------------- USER ------------------------
    case "user":
      return ACTION.handleChangeUser(state, action.payload);
    // --------------------- ANFITRION ---------------------
    case "mainMembers":
      return ACTION.handleMainMemberChange(state, action.payload);
    case "handleAddMainMembersPhoto":
      return ACTION.handleAddMainMemberFile(state, action.payload);
    case "handleRemoveMainMembersPhoto":
      return ACTION.handleRemoveMainMemberFile(state, action.payload);
    case "otherMainMember":
      return ACTION.handleOtherMainMember(state, action.payload);
    case "handleContactAccountChange":
      return ACTION.handleContactAccountChange(state, action.payload);
    // ------------------- FAMILY -----------------------
    case "familyInfo":
      return ACTION.handleFamilyInfoChange(state, action.payload);
    case "handleFamiliarChange":
      return ACTION.handleFamiliarChange(state, action.payload);
    case "handleAddFamiliar":
      return ACTION.handleAddFamiliar(state);
    case "handleRemoveFamiliar":
      return ACTION.handleRemoveFamiliar(state);
    // ------------------- PETS -------------------------
    case "handlePetsChange":
      return ACTION.handlePetsChange(state, action.payload);
    case "handleAddPet":
      return ACTION.handleAddPet(state);
    case "handleRemovePet":
      return ACTION.handleRemovePet(state);
    // ------------------- LODGING ----------------------
    case "handleLodgingChange":
      return ACTION.handleLodgingChange(state, action.payload);
    // ------------------- GUESTS -----------------------
    case "handleRoomsChange":
      return ACTION.handleRoomsChange(state, action.payload);
    case "handleAvailabilityChange":
      return ACTION.handleAvailabilityChange(state, action.payload);
    case "handleRemoveAvailability":
      return ACTION.handleRemoveAvailability(state, action.payload);
    case "handleClearAvailability":
      return ACTION.handleClearAvailability(state, action.payload);
    case "handleAddRoom":
      return ACTION.handleAddRoom(state);
    case "handleRemoveRoom":
      return ACTION.handleRemoveRoom(state);
    case "handleAddHomeVideo":
      return ACTION.handleAddHomeVideo(state, action.payload);
    case "handleRemoveHomeVideo":
      return ACTION.handleRemoveHomeVideo(state);
    case "handleAddHomePictures":
      return ACTION.handleAddHomePictures(state, action.payload);
    case "handleRemoveHomePictures":
      return ACTION.handleRemoveHomePictures(state, action.payload);
    // case 'handleRemoveRoomByIdx':
    //   return ACTION.handleRemoveRoomByIdx(state, action.payload)
    // -------------- FAMILY INTERNAL DATA --------------
    case "handleInternalDataChange":
      return ACTION.handleInternalDataChange(state, action.payload);
    // ------------------- SCHOOLS ----------------------
    // case 'handleAddSchool':
    //   return ACTION.handleAddSchool(state)
    // case 'handleRemoveSchool':
    //   return ACTION.handleRemoveSchool(state, action.payload)
    // case 'handleSchoolChange':
    //   return ACTION.handleSchoolChange(state, action.payload)
    // --------------------- RESET INFO --------------------
    case "reset":
      return { ...action.payload };
    // --------------------- DEFAULT -----------------------
    default:
      return { ...state };
  }
}

export const INITIAL_STATE = {
  tenants: false,
  interests: [],
  specialDiet: null,
  contactAccounts: {},
  acceptableDiets: [],
  rulesForStudents: [],
  culturalActivities: [],
  noRedLeafStudents: false,
  pets: [] as PetDataType[],
  welcomeStudentGenders: [],
  familyMembers: [] as FamilyMemberDataType[],
  mainMembers: [{ ...ACTION.INITIAL_MAIN_MEMBER_STATE }],
  user: {
    email: "",
    lastName: "",
    password: "",
    firstName: "",
    confirmPassword: "",
    userType: undefined,
  } as UserDataType,
  home: {
    address: "",
    services: [],
    postalCode: "",
    houseRooms: [],
    description: "",
    city: undefined,
    studentRooms: [],
    nearbyServices: [],
    country: undefined,
    province: undefined,
    homeType: undefined,
    cityFreeComment: "",
    mainIntersection: "",
  } as HomeDataType,
};
