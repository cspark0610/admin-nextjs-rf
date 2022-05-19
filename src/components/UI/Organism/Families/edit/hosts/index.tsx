// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect, Fragment } from 'react'
import dayjs from 'dayjs'

// components
import { UploadMainMembersPicture } from 'components/UI/Atoms/UploadMainMembersPicture'

// bootstrap components
import { Container, Row, Col, Spinner, ProgressBar } from 'react-bootstrap'

// prime components
import { SelectButton } from 'primereact/selectbutton'
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { Calendar } from 'primereact/calendar'

//services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { MainMemberDataType } from 'types/models/Family'
import { GenericDataType } from 'types/models/Generic'
import { ChangeType, SetStateType } from 'types'
import { FC, Dispatch } from 'react'

type UpdateMainMembersProps = {
  uploadFamilyFilesProcess: number
  setError: SetStateType<string>
  data: {
    mainMembers: MainMemberDataType[]
    contactAccounts: { [key: string]: string }
  }
  dispatch: Dispatch<{
    type: string
    payload:
      | { file: File; index?: number }
      | number
      | null
      | {
          ev:
            | ChangeType
            | DropdownChangeParams
            | { target: { name: string; value: string | null } }
          idx?: number
        }
  }>
}

export const UpdateMainMembers: FC<UpdateMainMembersProps> = ({
  uploadFamilyFilesProcess,
  dispatch,
  data,
}) => {
  const [addSecondaryHost, setAddSecondaryHost] = useState(
    data.mainMembers.length === 2
  )
  const [hostRelationship, setHostRelationship] = useState(undefined)
  const [occupations, setOccupations] = useState(undefined)
  const [languages, setLanguages] = useState(undefined)
  const [genders, setGenders] = useState(undefined)
  const [selectOccupation1FreeComment, setSelectOccupation1FreeComment] =
    useState(!!data.mainMembers[0].occupationFreeComment)
  const [selectOccupation2FreeComment, setSelectOccupation2FreeComment] =
    useState(!!data.mainMembers[1]?.occupationFreeComment)
  const { data: session, status } = useSession()

  /**
   * handle format calendar's dates
   */
  const formatDate = (date: string | Date | undefined) =>
    typeof date === 'string' ? new Date(date) : date

  /**
   * handle add/remove a secondary host
   */
  const handleAddSecondaryHost = (ev: SelectButtonChangeParams) => {
    setAddSecondaryHost(ev.value)
    dispatch({ type: 'otherMainMember', payload: { ev } })
  }

  /**
   * handle change main member and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams, idx: number) =>
    dispatch({ type: 'mainMembers', payload: { ev, idx } })

  /**
   * handle change main member and dispatch data
   */
  const handlePhoneVerificationChanges = (
    ev: CheckboxChangeParams,
    idx: number
  ) =>
    dispatch({ type: 'handlePhoneVerificationChanges', payload: { ev, idx } })

  /**
   * handle change contact account
   * and dispatch data
   */
  const handleChangeContactAccount = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'handleContactAccountChange', payload: { ev } })

  const handleOccupattionFreeCommentIdx = (idx: number) =>
    idx === 0 ? selectOccupation1FreeComment : selectOccupation2FreeComment

  /**
   * handle change Occupation Free Comment
   */
  const handleSelectOccupationFreeComment = (
    ev: CheckboxChangeParams,
    idx: number
  ) => {
    const { checked } = ev

    if (idx === 0) setSelectOccupation1FreeComment(checked)
    else setSelectOccupation2FreeComment(checked)

    if (checked)
      dispatch({
        type: 'mainMembers',
        payload: {
          ev: { target: { name: 'occupation', value: null } },
          idx,
        },
      })
    else
      dispatch({
        type: 'mainMembers',
        payload: {
          ev: { target: { name: 'occupationFreeComment', value: '' } },
          idx,
        },
      })
  }

  /**
   * handle fetch generics from backend
   */
  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data: res } = await GenericsService.getAllByModelnames(
          session.token as string,
          ['gender', 'occupation', 'hostsRelationship', 'language']
        )
        setOccupations(
          res.occupation.filter(
            (occupation: GenericDataType) => !occupation.isFreeComment
          )
        )
        setHostRelationship(res.hostsRelationship)
        setLanguages(res.language)
        setGenders(res.gender)
      })()
    }
  }, [status, session])

  return (
    <Container fluid className={classes.container}>
      {uploadFamilyFilesProcess > 0 && (
        <>
          <h5>Uploading files process</h5>
          <ProgressBar className='my-3' now={uploadFamilyFilesProcess} />
        </>
      )}
      {data.mainMembers.map((member, idx: number) => (
        <Fragment key={idx}>
          <Row>
            <h2 className={classes.subtitle}>
              {idx === 0 ? 'Primary host' : 'Secondary host'}
            </h2>
            <Col className={`${classes.col} ${classes.upload}`} xs={12} md={4}>
              <UploadMainMembersPicture
                index={idx}
                dispatch={dispatch}
                data={member.photo as string}
              />
            </Col>
            <Col xs={12} md={8}>
              <div className={classes.col}>
                <p>First name</p>
                <InputText
                  required
                  name='firstName'
                  value={member.firstName}
                  placeholder='First name'
                  className={classes.input}
                  onChange={(ev) => handleChange(ev, idx)}
                />
              </div>
              <div className={classes.col}>
                <p>Last name</p>
                <InputText
                  required
                  name='lastName'
                  value={member.lastName}
                  placeholder='Last name'
                  className={classes.input}
                  onChange={(ev) => handleChange(ev, idx)}
                />
              </div>
            </Col>
            <Col className={classes.col} xs={12} sm={6}>
              <p>Email</p>
              <InputText
                required
                type='email'
                name='email'
                placeholder='Email'
                value={member.email}
                className={classes.input}
                onChange={(ev) => handleChange(ev, idx)}
              />
            </Col>
            <Col className={classes.col} xs={12} sm={6}>
              <p>Gender</p>
              {genders === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  name='gender'
                  optionValue='_id'
                  options={genders}
                  optionLabel='name'
                  placeholder='Gender'
                  value={member.gender}
                  className={classes.input}
                  onChange={(ev) => handleChange(ev, idx)}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12} sm={6}>
              <p>Occupation</p>
              {occupations === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  name='occupation'
                  optionLabel='name'
                  options={occupations}
                  placeholder='Occupation'
                  className={classes.input}
                  value={member.occupation}
                  onChange={(ev) => handleChange(ev, idx)}
                  disabled={handleOccupattionFreeCommentIdx(idx)}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12} sm={6}>
              <Checkbox
                inputId='occupation'
                className='me-3 mb-3'
                checked={handleOccupattionFreeCommentIdx(idx)}
                onChange={(ev) => handleSelectOccupationFreeComment(ev, idx)}
              />
              <label className='mb-3' htmlFor='occupation'>
                Occupation Free Comment
              </label>
              <InputText
                required
                className={classes.input}
                name='occupationFreeComment'
                value={member.occupationFreeComment}
                placeholder='Occupation Free Comment'
                onChange={(ev) => handleChange(ev, idx)}
                disabled={!handleOccupattionFreeCommentIdx(idx)}
              />
            </Col>
            <Col className={classes.col} xs={12} sm={6}>
              <p>D.O.B</p>
              <Calendar
                showButtonBar
                yearNavigator
                name='birthDate'
                className='w-100'
                placeholder='Prefer not say'
                inputClassName={classes.input}
                value={formatDate(member.birthDate)}
                onChange={(ev) => handleChange(ev, idx)}
                maxDate={dayjs().add(-17, 'years').toDate()}
                minDate={dayjs().add(-100, 'years').toDate()}
                yearRange={`${dayjs().add(-100, 'years').year()}:${dayjs()
                  .add(-18, 'years')
                  .year()}`}
              />
            </Col>
            {idx === 0 && (
              <Col className={classes.col} xs={12} md={6}>
                <p>Main language(s) spoken at home</p>
                {languages === undefined ? (
                  <Spinner animation='grow' />
                ) : (
                  <MultiSelect
                    filter
                    showClear
                    display='chip'
                    optionValue='_id'
                    optionLabel='name'
                    options={languages}
                    placeholder='Languages'
                    className={classes.input}
                    name='mainLanguagesSpokenAtHome'
                    onChange={(ev) => handleChange(ev, idx)}
                    value={member.mainLanguagesSpokenAtHome}
                  />
                )}
              </Col>
            )}
            <Col className={classes.col} xs={12} md={6}>
              <p>What language(s) do you speak?</p>
              {languages === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  optionValue='_id'
                  optionLabel='name'
                  options={languages}
                  name='spokenLanguages'
                  placeholder='Languages'
                  className={classes.input}
                  value={member.spokenLanguages}
                  onChange={(ev) => handleChange(ev, idx)}
                />
              )}
            </Col>
            {idx === 1 && (
              <Col className={classes.col} xs={12} md={6}>
                <p>Relation with the primary host</p>
                {hostRelationship === undefined ? (
                  <Spinner animation='grow' />
                ) : (
                  <Dropdown
                    showClear
                    optionValue='_id'
                    optionLabel='name'
                    className={classes.input}
                    options={hostRelationship}
                    name='relationshipWithThePrimaryHost'
                    placeholder='Relation with primary host'
                    onChange={(ev) => handleChange(ev, idx)}
                    value={member.relationshipWithThePrimaryHost}
                  />
                )}
              </Col>
            )}
          </Row>
          <Row>
            <Col className={classes.col} xs={12} md={4}>
              <p>Cell phone number</p>
              <InputMask
                required
                name='cellPhoneNumber'
                mask='+01 (999) 999-9999'
                className={classes.input}
                placeholder='000-000-0000'
                value={member.cellPhoneNumber}
                onChange={(ev) => handleChange(ev, idx)}
              />
              {member.cellPhoneNumber && (
                <>
                  <label className='mt-3' htmlFor='verify-cellphone'>
                    Is cell phone number verifyed?
                  </label>
                  <Checkbox
                    className='ms-2'
                    inputId='verify-cellphone'
                    name='isCellPhoneVerified'
                    checked={member.isCellPhoneVerified}
                    onChange={(ev) => handlePhoneVerificationChanges(ev, idx)}
                  />
                </>
              )}
            </Col>
            <Col className={classes.col} xs={12} md={4}>
              <p>Home phone number</p>
              <InputMask
                name='homePhoneNumber'
                mask='+01 (999) 999-9999'
                className={classes.input}
                placeholder='000-000-0000'
                value={member.homePhoneNumber}
                onChange={(ev) => handleChange(ev, idx)}
              />
              {member.homePhoneNumber && (
                <>
                  <label className='mt-3' htmlFor='verify-homephone'>
                    Is home phone number verifyed?
                  </label>
                  <Checkbox
                    className='ms-2'
                    inputId='verify-homephone'
                    name='isHomePhoneVerified'
                    checked={member.isHomePhoneVerified}
                    onChange={(ev) => handlePhoneVerificationChanges(ev, idx)}
                  />
                </>
              )}
            </Col>
            <Col className={classes.col} xs={12} md={4}>
              <p>Work phone number</p>
              <InputMask
                name='workPhoneNumber'
                mask='+01 (999) 999-9999'
                className={classes.input}
                placeholder='000-000-0000'
                value={member.workPhoneNumber}
                onChange={(ev) => handleChange(ev, idx)}
              />
              {member.workPhoneNumber && (
                <>
                  <label className='mt-3' htmlFor='verify-workphone'>
                    Is work phone number verifyed?
                  </label>
                  <Checkbox
                    className='ms-2'
                    name='isWorkHomeVerified'
                    inputId='verify-workphone'
                    checked={member.isWorkHomeVerified}
                    onChange={(ev) => handlePhoneVerificationChanges(ev, idx)}
                  />
                </>
              )}
            </Col>
            {idx === 0 && (
              <>
                <h2 className={classes.subtitle}>
                  The best way for the student to contact the family
                </h2>
                <Col className={classes.col} xs={12} md={3}>
                  <p>Skype</p>
                  <InputText
                    name='skype'
                    placeholder='Skype'
                    className={classes.input}
                    value={data.contactAccounts?.skype}
                    onChange={handleChangeContactAccount}
                  />
                </Col>
                <Col className={classes.col} xs={12} md={3}>
                  <p>Whatsapp</p>
                  <InputMask
                    name='whatsApp'
                    mask='+01 (999) 999-9999'
                    className={classes.input}
                    placeholder='000-000-0000'
                    value={data.contactAccounts?.whatsApp}
                    onChange={handleChangeContactAccount}
                  />
                </Col>
                <Col className={classes.col} xs={12} md={3}>
                  <p>Facebook messenger</p>
                  <InputText
                    name='facebookMessenger'
                    className={classes.input}
                    placeholder='Facebook messenger'
                    onChange={handleChangeContactAccount}
                    value={data.contactAccounts?.facebookMessenger}
                  />
                </Col>
                <Col className={classes.col} xs={12} md={3}>
                  <p>Line</p>
                  <InputMask
                    name='line'
                    mask='+01 (999) 999-9999'
                    className={classes.input}
                    placeholder='000-000-0000'
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
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                  value={addSecondaryHost}
                  className={classes.buttons}
                  onChange={handleAddSecondaryHost}
                />
              </>
            )}
          </Row>
        </Fragment>
      ))}
    </Container>
  )
}
