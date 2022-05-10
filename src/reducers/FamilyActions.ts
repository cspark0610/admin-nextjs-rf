// main tools
import dayjs from "dayjs";

// reduers
import { INITIAL_STATE } from "./FamilyReducers";

// types
import { SelectButtonChangeParams } from "primereact/selectbutton";
import { StudentRoomDataType } from "types/models/Home";
import { FamilyDataType } from "types/models/Family";
import { ChangeType } from "types";

// ------------------- HANDLERS -------------------
/**
 * handle user change
 */
export const handleChangeUser = (state: typeof INITIAL_STATE, payload: ChangeType) => ({
	...state,
	user: { ...state.user, [payload.target.name]: payload.target.value },
});

/**
 * handle main members change
 */
export const handleMainMemberChange = (state: typeof INITIAL_STATE, payload: { ev: ChangeType; idx: number }) => {
	const update = [...state.mainMembers];
	update[payload.idx] = {
		...update[payload.idx],
		[payload.ev.target.name]: payload.ev.target.value,
	};

	return { ...state, mainMembers: update };
};

/**
 * handle add/remove picture main member
 */
export const handleAddMainMemberFile = (
	state: typeof INITIAL_STATE | FamilyDataType,
	payload: {
		file: File;
		index?: number;
	}
) => {
	const mainMembers = state.mainMembers ? state.mainMembers : [];

	if (typeof payload.index === "number" && mainMembers[payload.index]) {
		mainMembers[payload.index].photo = payload.file;
	}

	return {
		...state,
		mainMembers: [...mainMembers],
	};
};

export const handleRemoveMainMemberFile = (state: typeof INITIAL_STATE | FamilyDataType, payload: number) => {
	const mainMembers = state.mainMembers ? state.mainMembers : [];

	if (typeof payload === "number" && mainMembers[payload]) {
		mainMembers[payload].photo = undefined;
	}

	return {
		...state,
		mainMembers: [...mainMembers],
	};
};

/**
 * handle add/remove other main member
 */
export const handleOtherMainMember = (state: typeof INITIAL_STATE, payload: { ev: SelectButtonChangeParams }) => {
	if (payload.ev.value) state.mainMembers.length === 1 && state.mainMembers.push({ ...INITIAL_MAIN_MEMBER_STATE });
	else state.mainMembers.length === 2 && state.mainMembers.pop();

	return { ...state };
};

/**
 * handle contact account change
 */
export const handleContactAccountChange = (state: typeof INITIAL_STATE, payload: { ev: ChangeType }) => ({
	...state,
	contactAccounts: {
		...state.contactAccounts,
		[payload.ev.target.name]: payload.ev.target.value,
	},
});

/**
 * handle family info change
 */
export const handleFamilyInfoChange = (state: typeof INITIAL_STATE, payload: { ev: ChangeType }) => ({
	...state,
	[payload.ev.target.name]: payload.ev.target.value,
});

/**
 * handle add family member
 */
export const handleAddFamiliar = (state: typeof INITIAL_STATE) => ({
	...state,
	familyMembers: [...state.familyMembers, { ...INITIAL_FAMILIAR_STATE }],
});

/**
 * handle remove family member
 */
export const handleRemoveFamiliar = (state: typeof INITIAL_STATE) => {
	const update = [...state.familyMembers];
	update.pop();

	return { ...state, familyMembers: update };
};

/**
 * handle family member data change
 */
export const handleFamiliarChange = (state: typeof INITIAL_STATE, payload: { ev: ChangeType; idx: number }) => {
	const update = [...state.familyMembers];
	update[payload.idx] = {
		...update[payload.idx],
		[payload.ev.target.name]: payload.ev.target.value,
	};

	return { ...state, familyMembers: update };
};

/**
 * handle add pet
 */
export const handleAddPet = (state: typeof INITIAL_STATE) => ({
	...state,
	pets: [...state.pets, { ...INITIAL_PET_STATE }],
});

/**
 * handle remove pet
 */
export const handleRemovePet = (state: typeof INITIAL_STATE) => {
	const update = [...state.pets];
	update.pop();

	return { ...state, pets: update };
};

/**
 * handle pet data data change
 */
export const handlePetsChange = (state: typeof INITIAL_STATE, payload: { ev: ChangeType; idx: number }) => {
	const update = [...state.pets];
	update[payload.idx] = {
		...update[payload.idx],
		[payload.ev.target.name]: payload.ev.target.value,
	};

	return { ...state, pets: update };
};

/**
 * handle Home info change
 */
export const handleLodgingChange = (state: typeof INITIAL_STATE, payload: { ev: ChangeType }) => ({
	...state,
	home: { ...state.home, [payload.ev.target.name]: payload.ev.target.value },
});

/**
 * handle add new student room
 */
export const handleAddRoom = (state: typeof INITIAL_STATE) => ({
	...state,
	home: {
		...state.home,
		studentRooms: [...(state.home.studentRooms || []), { ...INITIAL_ROOM_STATE }],
	},
});

/**
 * handle add new student room
 */
export const handleRemoveRoom = (state: typeof INITIAL_STATE) => {
	const update = [...(state.home.studentRooms || [])];
	update.pop();

	return { ...state, home: { ...state.home, studentRooms: update } };
};

/**
 * handle student room change
 */
export const handleRoomsChange = (state: typeof INITIAL_STATE, payload: { ev: ChangeType; idx: number }) => {
	const update = [...(state.home.studentRooms || [])];
	update[payload.idx] = {
		...update[payload.idx],
		[payload.ev.target.name]: payload.ev.target.value,
	};

	return { ...state, home: { ...state.home, studentRooms: update } };
};

/**
 * handle change student room availability
 */
export const handleAvailabilityChange = (state: typeof INITIAL_STATE, payload: { value: Date[]; idx: number }) => {
	const update = [...(state.home.studentRooms || [])];

	update[payload.idx].availability = update[payload.idx].availability
		? [...(update[payload.idx].availability as Date[]), ...getAllDates(payload.value)]
		: getAllDates(payload.value);

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

	return { ...state, home: { ...state.home, studentRooms: update } };
};

/**
 * handle remove available dates
 */
export const handleRemoveAvailability = (state: typeof INITIAL_STATE, payload: { value: Date[]; idx: number }) => {
	const remove = [...((state.home.studentRooms && state.home.studentRooms) as StudentRoomDataType[])];

	const itemsToRemove = [
		...getAllDates(payload.value)
			.filter(
				(item: Date) =>
					remove[payload.idx].availability?.map((item) => (item as Date).toISOString()).indexOf(item.toISOString()) !==
					-1
			)
			.map((item: Date) => item.toISOString()),
	];

	const removedItems = (remove[payload.idx].availability as Date[])?.filter(
		(item) => itemsToRemove.indexOf(item.toISOString()) === -1
	);

	remove[payload.idx].availability = removedItems;

	return { ...state, home: { ...state.home, studentRooms: remove } };
};

/**
 * handle clear availability calendar
 */
export const handleClearAvailability = (state: typeof INITIAL_STATE, payload: { ev: ChangeType; idx: number }) => {
	const update = [...(state.home.studentRooms || [])];
	update[payload.idx] = { ...update[payload.idx], availability: [] };

	return { ...state, home: { ...state.home, studentRooms: update } };
};

/**
 * handle change family internal data
 */
export const handleInternalDataChange = (state: typeof INITIAL_STATE | FamilyDataType, payload: ChangeType) => ({
	...state,
	familyInternalData: {
		...(state as FamilyDataType).familyInternalData,
		[payload.target.name]: payload.target.value,
	},
});

/**
 * handle add home video
 */
export const handleAddHomeVideo = (state: typeof INITIAL_STATE | FamilyDataType, payload: File) => ({
	...state,
	home: {
		...(state as FamilyDataType).home,
		video: URL.createObjectURL(payload),
	},
});

/**
 * handle remove home video
 */
export const handleRemoveHomeVideo = (state: typeof INITIAL_STATE | FamilyDataType) => ({
	...state,
	home: { ...(state as FamilyDataType).home, video: null },
});

/**
 * handle add home pictures
 */
export const handleAddHomePictures = (
	state: typeof INITIAL_STATE | FamilyDataType,
	payload: { file: File; selectedCategory: string }
) => {
	const group = state.home?.photoGroups?.find((photoGroup) => photoGroup.name === payload.selectedCategory);

	if (!group)
		return {
			...state,
			home: {
				...state.home,
				photoGroups: [
					...(state.home?.photoGroups ? state.home?.photoGroups : []),
					{
						name: payload.selectedCategory,
						photos: [
							{
								caption: payload.file.name,
								photo: URL.createObjectURL(payload.file),
							},
						],
					},
				],
			},
		};

	return { ...state };
};

/**
 * handle remove home pictures
 */
export const handleRemoveHomePictures = (
	state: typeof INITIAL_STATE | FamilyDataType,
	payload: { file: File; selectedCategory: string }
) => {
	console.log(payload);

	return { ...state };
};

// ---------------- INITIAL STATES ----------------
export const INITIAL_MAIN_MEMBER_STATE = {
	email: "",
	photo: null,
	gender: null,
	lastName: "",
	firstName: "",
	birthDate: null,
	occupation: null,
	cellPhoneNumber: "",
	homePhoneNumber: "",
	workPhoneNumber: "",
	spokenLanguages: null,
	occupationFreeComment: "",
	mainLanguagesSpokenAtHome: null,
	relationshipWithThePrimaryHost: null,
};

const INITIAL_FAMILIAR_STATE = {
	lastName: "",
	gender: null,
	firstName: "",
	situation: "",
	birthDate: null,
	spokenLanguages: [],
	familyRelationship: null,
};

const INITIAL_PET_STATE = {
	age: 0,
	name: "",
	race: "",
	type: null,
	remarks: "",
	isHipoalergenic: null,
};

const INITIAL_ROOM_STATE = {
	type: null,
	photos: [],
	floor: null,
	bedType: null,
	roomNumber: 0,
	bathType: null,
	availability: [],
	aditionalFeatures: [],
	bathroomLocation: null,
};

const INITIAL_SCHOOLS_STATE = {
	school: {},
	transports: [],
};

// ------------------------- UTILS -------------------------

/**
 * handle get all dates between two other dates
 */
const getAllDates = ([start, end]: Date[]) => {
	const formattedStart = dayjs(start);
	const formattedEnd = dayjs(end);
	let actualDate = formattedStart;
	const updateDates = [];

	while (actualDate.isBefore(formattedEnd) || actualDate.isSame(formattedEnd)) {
		updateDates.push(actualDate.toDate());
		actualDate = actualDate.add(1, "days");
	}

	return updateDates;
};
