// main tools
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

// components
import { UploadPicture } from "components/UI/Atoms/UploadPicture";

// bootstrap components
import { Container, Row, Col, Spinner } from "react-bootstrap";

// prime components
import { SelectButton } from "primereact/selectbutton";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

//services
import { GenericsService } from "services/Generics";

// styles
import classes from "styles/Families/page.module.scss";

// types
import { SelectButtonChangeParams } from "primereact/selectbutton";
import { DropdownChangeParams } from "primereact/dropdown";
import { MainMemberDataType } from "types/models/Family";
import { FC, Dispatch } from "react";
import { ChangeType } from "types";

type UpdateMainMembersProps = {
  data: {
    mainMembers: MainMemberDataType[];
    contactAccounts: { [key: string]: string };
  };
  dispatch: Dispatch<{
    type: string;
    payload:
      | { file: File; index?: number }
      | number
      | null
      | { ev: ChangeType | DropdownChangeParams; idx?: number };
  }>;
};

export const UpdateMainMembers: FC<UpdateMainMembersProps> = ({
  dispatch,
  data,
}) => {
  const [addSecondaryHost, setAddSecondaryHost] = useState(
    data.mainMembers.length === 2
  );
  const [hostRelationship, setHostRelationship] = useState(undefined);
  const [occupations, setOccupations] = useState(undefined);
  const [languages, setLanguages] = useState(undefined);
  const [genders, setGenders] = useState(undefined);
  const { data: session, status } = useSession();

  /**
   * handle format calendar's dates
   */
  const formatDate = (date: string | Date | undefined) =>
    typeof date === "string" ? new Date(date) : date;

  /**
   * handle add/remove a secondary host
   */
  const handleAddSecondaryHost = (ev: SelectButtonChangeParams) => {
    setAddSecondaryHost(ev.value);
    dispatch({ type: "otherMainMember", payload: { ev } });
  };

  /**
   * handle change main member and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams, idx: number) =>
    dispatch({ type: "mainMembers", payload: { ev, idx } });

  /**
   * handle change contact account
   * and dispatch data
   */
  const handleChangeContactAccount = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: "handleContactAccountChange", payload: { ev } });

  /**
   * handle fetch generics from backend
   */
  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        const { data: res } = await GenericsService.getAllByModelnames(
          session.token as string,
          ["gender", "occupation", "hostsRelationship", "language"]
        );
        setHostRelationship(res.hostsRelationship);
        setOccupations(res.occupation);
        setLanguages(res.language);
        setGenders(res.gender);
      })();
    }
  }, [status, session]);

  //console.log(data, 'dataaa')

  return (
    <Container fluid className={classes.container}>
      {data.mainMembers.map((member, idx: number) => (
        <Row key={idx}>
          <h2 className={classes.subtitle}>
            {idx === 0 ? "Primary host" : "Secondary host"}
          </h2>
          <Col className={`${classes.col} ${classes.upload}`} xs={12} md={4}>
            <UploadPicture
              dispatch={dispatch}
              data={member.photo as string}
              index={idx}
            />
          </Col>
          <Col xs={12} md={8}>
            <div className={classes.col}>
              <p>First name</p>
              <InputText
                required
                name="firstName"
                value={member.firstName}
                placeholder="First name"
                className={classes.input}
                onChange={(ev) => handleChange(ev, idx)}
              />
            </div>
            <div className={classes.col}>
              <p>Last name</p>
              <InputText
                required
                name="lastName"
                value={member.lastName}
                placeholder="Last name"
                className={classes.input}
                onChange={(ev) => handleChange(ev, idx)}
              />
            </div>
          </Col>
          <Col className={classes.col} xs={12} sm={6}>
            <p>Email</p>
            <InputText
              required
              type="email"
              name="email"
              placeholder="Email"
              value={member.email}
              className={classes.input}
              onChange={(ev) => handleChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} sm={6}>
            <p>Occupation</p>
            {occupations === undefined ? (
              <Spinner animation="grow" />
            ) : (
              <Dropdown
                showClear
                optionValue="_id"
                name="occupation"
                optionLabel="name"
                options={occupations}
                placeholder="Occupation"
                className={classes.input}
                value={member.occupation}
                onChange={(ev) => handleChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} sm={6}>
            <p>Occupation Free comment</p>
            <InputText
              required
              type="occupationFreecomment"
              name="Occupation Free comment"
              placeholder="Occupation Free comment"
              value={member.email}
              className={classes.input}
              onChange={(ev) => handleChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} sm={6}>
            <p>Gender</p>
            {genders === undefined ? (
              <Spinner animation="grow" />
            ) : (
              <Dropdown
                showClear
                name="gender"
                optionValue="_id"
                options={genders}
                optionLabel="name"
                placeholder="Gender"
                value={member.gender}
                className={classes.input}
                onChange={(ev) => handleChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} sm={6}>
            <p>D.O.B</p>
            <Calendar
              required
              yearNavigator
              name="birthDate"
              className="w-100"
              inputClassName={classes.input}
              value={formatDate(member.birthDate)}
              onChange={(ev) => handleChange(ev, idx)}
              maxDate={dayjs().add(-17, "years").toDate()}
              minDate={dayjs().add(-100, "years").toDate()}
              yearRange={`${dayjs().add(-100, "years").year()}:${dayjs()
                .add(-18, "years")
                .year()}`}
            />
          </Col>
          {idx === 0 && (
            <Col className={classes.col} xs={12} md={6}>
              <p>Main language(s) spoken at home</p>
              {languages === undefined ? (
                <Spinner animation="grow" />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display="chip"
                  optionValue="_id"
                  optionLabel="name"
                  options={languages}
                  placeholder="Languages"
                  className={classes.input}
                  name="mainLanguagesSpokenAtHome"
                  onChange={(ev) => handleChange(ev, idx)}
                  value={member.mainLanguagesSpokenAtHome}
                />
              )}
            </Col>
          )}
          <Col className={classes.col} xs={12} md={6}>
            <p>What language(s) do you speak?</p>
            {languages === undefined && idx === 0 ? (
              <Spinner animation="grow" />
            ) : (
              <MultiSelect
                filter
                showClear
                display="chip"
                optionValue="_id"
                optionLabel="name"
                options={languages}
                name="spokenLanguages"
                placeholder="Languages"
                className={classes.input}
                value={member.spokenLanguages}
                onChange={(ev) => handleChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} md={4}>
            <p>Cell phone number</p>
            <InputMask
              required
              name="cellPhoneNumber"
              mask="+1 (999) 999-9999"
              className={classes.input}
              placeholder="000-000-0000"
              value={member.cellPhoneNumber}
              onChange={(ev) => handleChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} md={4}>
            <p>Home phone number</p>
            <InputMask
              name="homePhoneNumber"
              mask="+1 (999) 999-9999"
              className={classes.input}
              placeholder="000-000-0000"
              value={member.homePhoneNumber}
              onChange={(ev) => handleChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} md={4}>
            <p>Work phone number</p>
            <InputMask
              name="workPhoneNumber"
              mask="+1 (999) 999-9999"
              className={classes.input}
              placeholder="000-000-0000"
              value={member.workPhoneNumber}
              onChange={(ev) => handleChange(ev, idx)}
            />
          </Col>
          {idx === 1 && (
            <Col className={classes.col} xs={12} md={4}>
              <p>Relation with the primary host</p>
              {hostRelationship === undefined ? (
                <Spinner animation="grow" />
              ) : (
                <Dropdown
                  showClear
                  optionValue="_id"
                  optionLabel="name"
                  className={classes.input}
                  options={hostRelationship}
                  name="relationshipWithThePrimaryHost"
                  placeholder="Relation with primary host"
                  onChange={(ev) => handleChange(ev, idx)}
                  value={member.relationshipWithThePrimaryHost}
                />
              )}
            </Col>
          )}
          {idx === 0 && (
            <>
              <h2 className={classes.subtitle}>
                The best way for the student to contact the family
              </h2>
              <Col className={classes.col} xs={12} md={3}>
                <p>Skype</p>
                <InputText
                  name="skype"
                  placeholder="Skype"
                  className={classes.input}
                  value={data.contactAccounts?.skype}
                  onChange={handleChangeContactAccount}
                />
              </Col>
              <Col className={classes.col} xs={12} md={3}>
                <p>Whatsapp</p>
                <InputMask
                  name="whatsapp"
                  mask="+1 (999) 999-9999"
                  className={classes.input}
                  placeholder="000-000-0000"
                  value={data.contactAccounts?.whatsapp}
                  onChange={handleChangeContactAccount}
                />
              </Col>
              <Col className={classes.col} xs={12} md={3}>
                <p>Facebook messenger</p>
                <InputText
                  name="facebookMessenger"
                  className={classes.input}
                  placeholder="Facebook messenger"
                  onChange={handleChangeContactAccount}
                  value={data.contactAccounts?.facebookMessenger}
                />
              </Col>
              <Col className={classes.col} xs={12} md={3}>
                <p>Line</p>
                <InputMask
                  name="line"
                  mask="+1 (999) 999-9999"
                  className={classes.input}
                  placeholder="000-000-0000"
                  value={data.contactAccounts?.line}
                  onChange={handleChangeContactAccount}
                />
              </Col>
            </>
          )}
          {idx === 0 && (
            <>
              <h2 className={classes.subtitle}>
                Would you like to add a second host?
              </h2>
              <SelectButton
                required
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                value={addSecondaryHost}
                className={classes.buttons}
                onChange={handleAddSecondaryHost}
              />
            </>
          )}
        </Row>
      ))}
    </Container>
  );
};
