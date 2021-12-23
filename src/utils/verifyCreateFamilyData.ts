import type { Family } from "context/RegisterFamilyContext";
import useMembers from "hooks/useMembers";

export const verifyCreateFamilyData = (
  family: Family,
  actualStep: number
): string[] => {
  switch (actualStep) {
    case 0:
      return verifyUserData(family);
    case 1:
      return verifyHostData(family);
    case 2:
      return verifyFamilyData(family);
    case 3:
      return verifyPreferencesData(family);
    case 4:
      return verifyLodgingData(family);
    case 5:
      return verifyHomeData(family);
    default:
      return [];
  }
};

const verifyUserData = ({ user }: Family): string[] => {
  const verify = [];

  if (!user.first_name) verify.push("First name");
  if (!user.last_name) verify.push("Last name");
  if (!user.email) verify.push("Email");
  else if (!user.email.includes("@")) verify.push("Email");
  if (!user.password) verify.push("Password");
  if (!user.confirmPass) verify.push("Confirm password");
  if (user.password !== user.confirmPass)
    verify.push("Password and Confirm password");

  return verify;
};

const verifyHostData = ({ mainMembers }: Family): string[] => {
  const verify = [];
  if (mainMembers.length === 0) {
    verify.push("Main members");
  } else if (
    mainMembers.length === 2 &&
    !mainMembers[1].firstName &&
    !mainMembers[1].lastName &&
    !mainMembers[1].email &&
    !mainMembers[1].occupation &&
    !mainMembers[1].occupationFreeComment &&
    !mainMembers[1].gender &&
    !mainMembers[1].birthDate &&
    !mainMembers[1].mainLanguagesSpokenAtHome &&
    !mainMembers[1].spokenLanguages &&
    !mainMembers[1].cellPhoneNumber &&
    !mainMembers[1].relationshipWithThePrimaryHost
  ) {
    delete mainMembers[1];
  } else {
    mainMembers.map((member, idx) => {
      if (!member.firstName) verify.push(`Member ${idx + 1}: First name`);
      if (!member.lastName) verify.push(`Member ${idx + 1}: Last name`);
      if (!member.email) verify.push(`Member ${idx + 1}: Email`);
      else if (!member.email.includes("@")) verify.push("Email");
      if (!member.occupation && !member.occupationFreeComment)
        verify.push(`Member ${idx + 1}: Occupation`);
      if (!member.gender) verify.push(`Member ${idx + 1}: Gender`);
      if (!member.birthDate) verify.push(`Member ${idx + 1}: Date of birth`);
      if (!member.mainLanguagesSpokenAtHome)
        verify.push(`Member ${idx + 1}: Main languages spoken at home`);
      if (!member.spokenLanguages)
        verify.push(`Member ${idx + 1}: spoken languages`);
      if (!member.cellPhoneNumber)
        verify.push(`Member ${idx + 1}: Cellphone number`);
      if (idx > 0 && !member.relationshipWithThePrimaryHost)
        verify.push(`Member ${idx + 1}: Relationship with primary host`);
    });
  }

  return verify;
};

const verifyFamilyData = ({ familyMembers }: Family): string[] => {
  const verify = [];
  if (familyMembers.length > 0) {
    familyMembers.map((member, idx) => {
      if (!member.firstName) verify.push(`Member ${idx + 1}: First name`);
      if (!member.lastName) verify.push(`Member ${idx + 1}: Last name`);
      if (!member.gender) verify.push(`Member ${idx + 1}: Gender`);
      if (!member.familyRelationship)
        verify.push(`Member ${idx + 1}: Relationship with primary host`);
      if (!member.birthDate) verify.push(`Member ${idx + 1}: Date of birth`);
      if (!member.spokenLanguages)
        verify.push(`Member ${idx + 1}: Spoken languages`);
      if (!member.situation) verify.push(`Member ${idx + 1}: situation`);
    });
  }
  return verify;
};

const verifyPreferencesData = (family: Family): string[] => {
  const verify = [];

  if (family.welcomeStudentGenders.length === 0)
    verify.push("Our family welcomes");

  if (family.pets.length > 0) {
    family.pets.map((pet, idx) => {
      if (!pet.type) verify.push(`Pet ${idx + 1}: Type`);
    });
  }

  return verify;
};

const verifyLodgingData = ({ home }: Family): string[] => {
  const verify = [];

  if (!home.country) verify.push("Country");
  if (!home.province) verify.push("Province");
  if (!home.city && !home.cityFreeComment) verify.push("City");
  if (!home.postalCode) verify.push("Postal code");
  if (!home.address) verify.push("Address");

  return verify;
};

const verifyHomeData = ({ home }: Family): string[] => {
  const verify = [];

  if (!home.homeType) verify.push("House type");
  if (home.houseRooms.length === 0) verify.push("Inside");
  if (home.services.length === 0) verify.push("Household amenities");
  if (home.studentRooms.length === 0) verify.push("Student Rooms");
  else
    home.studentRooms.map((room, idx) => {
      if (!room.type) verify.push(`Room ${idx + 1}: Room Type`);
      if (!room.bathType) verify.push(`Room ${idx + 1}: Bath Type`);
      if (!room.bedType) verify.push(`Room ${idx + 1}: Bed Type`);
      if (!room.bathroomLocation)
        verify.push(`Room ${idx + 1}: Bathroom Location`);
      if (!room.floor) verify.push(`Room ${idx + 1}: Room location`);
    });

  return verify;
};
