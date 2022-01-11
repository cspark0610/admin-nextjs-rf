import { useContext, useEffect, useState } from "react";
import InputContainer from "components/UI/Molecules/InputContainer";
import FormGroup from "components/UI/Molecules/FormGroup";
import { RegisterFamilyContext } from "context/RegisterFamilyContext";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";

import GenericsService from "services/Generics";
import { useSession } from "next-auth/client";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  occupation: "",
  occupationFreeComment: "",
  gender: "",
  birthDate: "",
  mainLanguagesSpokenAtHome: "",
  spokenLanguages: "",
  cellPhoneNumber: "",
  homePhoneNumber: "",
  workPhoneNumber: "",
  relationshipWithThePrimaryHost: null,
};

const Anfitrion = () => {
  const [session] = useSession();
  const {
    family: { mainMembers },
    setMainMembers,
  } = useContext(RegisterFamilyContext);

  const [hasSecondHost, setHasSecondHost] = useState(false);
  const [occupations, setOccupations] = useState([]);
  const [genders, setGenders] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [primary, setPrimary] = useState(
    mainMembers[0] ? mainMembers[0] : INITIAL_DATA
  );
  const [secondary, setSecondary] = useState(
    mainMembers[1] ? mainMembers[1] : INITIAL_DATA
  );

  const [otherOccupation, setOtherOccupation] = useState(false);
  const [secondaryOtherOccupation, setSecondaryOtherOccupation] =
    useState(false);

  useEffect(() => {
    if (otherOccupation) {
      handleChange(0, "occupation", {});
    } else {
      handleChange(0, "occupationFreeComment", "");
    }

    if (secondaryOtherOccupation) {
      handleChange(1, "occupation", {});
    } else {
      handleChange(1, "occupationFreeComment", "");
    }
  }, [otherOccupation, secondaryOtherOccupation]);

  const handleChange = (index, field, value) => {
    if (index === 0) {
      setPrimary({ ...primary, [field]: value });
    } else {
      setSecondary({ ...secondary, [field]: value });
    }

    let auxMembers = [...mainMembers];

    auxMembers[index] =
      index === 0
        ? { ...primary, [field]: value }
        : { ...secondary, [field]: value };

    setMainMembers(auxMembers);
  };

  useEffect(() => {
    (async () => {
      const res = await GenericsService.getAll(session?.token, [
        "occupations",
        "genders",
        "languages",
        "hostsRelationships",
      ]);

      if (res) {
        const { occupations, genders, languages, hostsRelationships } = res;
        setOccupations(occupations);
        setGenders(genders);
        setLanguages(languages);
        setRelationships(hostsRelationships);
      }
    })();
    mainMembers.length === 0 && setMainMembers([primary]);
  }, [session]);

  useEffect(() => {
    if (hasSecondHost === true) {
      setSecondary(INITIAL_DATA);
      if (mainMembers.length > 1) {
        const deleted = [...mainMembers];
        deleted.pop();
        setMainMembers(deleted);
      }
    } else {
      mainMembers.length === 1 &&
        setMainMembers([...mainMembers, INITIAL_DATA]);
    }
  }, [hasSecondHost]);

  return (
    <>
      <FormGroup title="Primary Host">
        <div className="two-columns">
          <InputContainer label="First name">
            <InputText
              name="firstName"
              placeholder="Your first name"
              value={primary.firstName}
              onChange={({ target: { value } }) =>
                handleChange(0, "firstName", value)
              }
            />
          </InputContainer>
          <InputContainer label="last name">
            <InputText
              name="lastName"
              placeholder="Your last name"
              value={primary.lastName}
              onChange={({ target: { value } }) =>
                handleChange(0, "lastName", value)
              }
            />
          </InputContainer>
          <InputContainer label="Email">
            <InputText
              type="email"
              name="email"
              placeholder="Your email"
              value={primary.email}
              onChange={({ target: { value } }) =>
                handleChange(0, "email", value)
              }
            />
          </InputContainer>
          <InputContainer label="Occupation">
            <Dropdown
              options={occupations}
              value={primary.occupation}
              optionLabel="name"
              name="occupation"
              onChange={({ value }) => handleChange(0, "occupation", value)}
              placeholder="Select occupation"
              disabled={!!otherOccupation ? true : false}
            />
            <div style={{ padding: "4px 0px" }}>
              <Checkbox
                name="otherOccupation"
                checked={otherOccupation}
                onChange={() => {
                  setOtherOccupation(!otherOccupation);
                }}
              />
              <label
                htmlFor="otherOccupation"
                style={{ marginInline: "1em", textTransform: "none" }}
              >
                Other occupation
              </label>
            </div>
            <InputText
              name="occupationFreeComment"
              placeholder="Other occupation"
              value={primary.occupationFreeComment}
              onChange={(e) =>
                handleChange(0, "occupationFreeComment", e.target.value)
              }
              disabled={!!otherOccupation ? false : true}
            />
          </InputContainer>
          <InputContainer label="Sex">
            <Dropdown
              options={genders}
              value={primary.gender}
              optionLabel="name"
              name="gender"
              onChange={({ value }) => handleChange(0, "gender", value)}
              placeholder="Select gender"
            />
          </InputContainer>
          <InputContainer label="Date of birth">
            <Calendar
              showIcon
              yearNavigator
              placeholder="Date of birth"
              value={new Date(primary.birthDate)}
              onChange={({ value }) => handleChange(0, "birthDate", value)}
              yearRange={`${new Date().getFullYear() - 100}:${
                new Date().getFullYear() - 18
              }`}
            />
          </InputContainer>
          <InputContainer label="Main Language(s) spoken at home">
            <MultiSelect
              value={primary.mainLanguagesSpokenAtHome}
              placeholder="Languages at home"
              options={languages}
              optionLabel="name"
              onChange={({ value }) =>
                handleChange(0, "mainLanguagesSpokenAtHome", value)
              }
              filter
              display="chip"
            />
          </InputContainer>
          <InputContainer label="What language(s) do you speak">
            <MultiSelect
              value={primary.spokenLanguages}
              placeholder="Spoken languages"
              options={languages}
              optionLabel="name"
              onChange={({ value }) =>
                handleChange(0, "spokenLanguages", value)
              }
              filter
              display="chip"
            />
          </InputContainer>
          <InputContainer label="Cell Phone number">
            <InputMask
              mask="+01 (999) 999-9999"
              name="phone"
              placeholder="Your phone number"
              value={primary.cellPhoneNumber}
              onChange={({ target: { value } }) =>
                handleChange(0, "cellPhoneNumber", value)
              }
            />
          </InputContainer>
          <InputContainer label="Home phone number">
            <InputMask
              mask="+01 (999) 999-9999"
              name="homePhoneNumber"
              placeholder="Your home phone"
              value={primary.homePhoneNumber}
              onChange={({ target: { value } }) =>
                handleChange(0, "homePhoneNumber", value)
              }
            />
          </InputContainer>
          <InputContainer label="Work phone number">
            <InputMask
              mask="+01 (999) 999-9999"
              name="workPhoneNumber"
              placeholder="Your home phone"
              value={primary.workPhoneNumber}
              onChange={({ target: { value } }) =>
                handleChange(0, "workPhoneNumber", value)
              }
            />
          </InputContainer>
          <br />
          <InputContainer
            label="Would you like to add a second host"
            style={{ flexDirection: "row", fontSize: 18, fontWeight: "bold" }}
          >
            <Checkbox
              onChange={(e) => setHasSecondHost(e.checked)}
              checked={hasSecondHost}
              style={{ marginLeft: "16px" }}
            ></Checkbox>
          </InputContainer>
        </div>
      </FormGroup>
      {hasSecondHost && (
        <div>
          <FormGroup title="Secondary Host">
            <div className="two-columns">
              <InputContainer label="First name">
                <InputText
                  name="firstName"
                  placeholder="Your first name"
                  value={secondary.firstName}
                  onChange={({ target: { value } }) =>
                    handleChange(1, "firstName", value)
                  }
                />
              </InputContainer>
              <InputContainer label="last name">
                <InputText
                  name="lastName"
                  placeholder="Your last name"
                  value={secondary.lastName}
                  onChange={({ target: { value } }) =>
                    handleChange(1, "lastName", value)
                  }
                />
              </InputContainer>
              <InputContainer label="Email">
                <InputText
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={secondary.email}
                  onChange={({ target: { value } }) =>
                    handleChange(1, "email", value)
                  }
                />
              </InputContainer>
              <InputContainer label="Occupation">
                <Dropdown
                  options={occupations}
                  value={secondary.occupation}
                  optionLabel="name"
                  name="occupation"
                  onChange={({ value }) => handleChange(1, "occupation", value)}
                  placeholder="Select occupation"
                  disabled={!!secondaryOtherOccupation ? true : false}
                />
                <div style={{ padding: "4px 0px" }}>
                  <Checkbox
                    name="otherOccupation"
                    checked={secondaryOtherOccupation}
                    onChange={() => {
                      setSecondaryOtherOccupation(!secondaryOtherOccupation);
                    }}
                  />
                  <label
                    htmlFor="otherOccupation"
                    style={{ marginInline: "1em", textTransform: "none" }}
                  >
                    Other occupation
                  </label>
                </div>
                <InputText
                  name="occupationFreeComment"
                  placeholder="Other occupation"
                  value={secondary.occupationFreeComment}
                  onChange={(e) =>
                    handleChange(1, "occupationFreeComment", e.target.value)
                  }
                  disabled={!!secondaryOtherOccupation ? false : true}
                />
              </InputContainer>
              <InputContainer label="Sex">
                <Dropdown
                  options={genders}
                  value={secondary.gender}
                  optionLabel="name"
                  name="gender"
                  onChange={({ value }) => handleChange(1, "gender", value)}
                  placeholder="Select gender"
                />
              </InputContainer>
              <InputContainer label="Date of birth">
                <Calendar
                  showIcon
                  yearNavigator
                  placeholder="Date of birth"
                  value={new Date(secondary.birthDate)}
                  onChange={({ value }) => handleChange(1, "birthDate", value)}
                  yearRange={`${new Date().getFullYear() - 100}:${
                    new Date().getFullYear() - 18
                  }`}
                />
              </InputContainer>
              <InputContainer label="Main Language(s) spoken at home">
                <MultiSelect
                  value={secondary.mainLanguagesSpokenAtHome}
                  placeholder="Languages at home"
                  options={languages}
                  optionLabel="name"
                  onChange={({ value }) =>
                    handleChange(1, "mainLanguagesSpokenAtHome", value)
                  }
                  selectedItemTemplate={(item) =>
                    item ? `${item?.name}, ` : ""
                  }
                />
              </InputContainer>
              <InputContainer label="What language(s) do you speak">
                <MultiSelect
                  value={secondary.spokenLanguages}
                  placeholder="Spoken languages"
                  options={languages}
                  optionLabel="name"
                  onChange={({ value }) =>
                    handleChange(1, "spokenLanguages", value)
                  }
                  selectedItemTemplate={(item) =>
                    item ? `${item?.name}, ` : ""
                  }
                />
              </InputContainer>
              <InputContainer label="Cell Phone number">
                <InputMask
                  mask="+01 (999) 999-9999"
                  name="phone"
                  placeholder="Your phone number"
                  value={secondary.cellPhoneNumber}
                  onChange={({ target: { value } }) =>
                    handleChange(1, "cellPhoneNumber", value)
                  }
                />
              </InputContainer>
              <InputContainer label="Home phone number">
                <InputMask
                  mask="+01 (999) 999-9999"
                  name="homePhoneNumber"
                  placeholder="Your home phone"
                  value={secondary.homePhoneNumber}
                  onChange={({ target: { value } }) =>
                    handleChange(1, "homePhoneNumber", value)
                  }
                />
              </InputContainer>
              <InputContainer label="Work phone number">
                <InputMask
                  mask="+01 (999) 999-9999"
                  name="workPhoneNumber"
                  placeholder="Your work phone"
                  value={secondary.workPhoneNumber}
                  onChange={({ target: { value } }) =>
                    handleChange(1, "workPhoneNumber", value)
                  }
                />
              </InputContainer>
              <InputContainer label="Relationship with primary host">
                <Dropdown
                  options={relationships}
                  value={secondary.relationshipWithThePrimaryHost}
                  optionLabel="name"
                  name="relationshipWithThePrimaryHost"
                  onChange={({ value }) =>
                    handleChange(1, "relationshipWithThePrimaryHost", value)
                  }
                  placeholder="Select relationship"
                />
              </InputContainer>
            </div>
          </FormGroup>
        </div>
      )}
    </>
  );
};

export default Anfitrion;
