// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
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
      | { ev: ChangeType | DropdownChangeParams; idx?: number }
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
  const [freeComment, setFreeComment] = useState(
    data.mainMembers.map((member) => member.occupation?.isFreeComment)
  )
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

  /**
   * handle change Occupation Free Comment
   */
  const handleChangeOccupation = (ev: CheckboxChangeParams, idx: number) => {
    freeComment[idx] = ev.checked
    setFreeComment([...freeComment])
    dispatch({ type: 'mainMembers', payload: { ev, idx } })
    data.mainMembers[idx].occupationFreeComment = ''
    data.mainMembers[idx].occupation = undefined
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
        setHostRelationship(res.hostsRelationship)
        setOccupations(res.occupation)
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
        <Row key={idx}>
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
          <Col className={`mt-auto ${classes.col}`} xs={12} sm={6}>
            <Checkbox
              className='me-3'
              inputId='occupation'
              checked={freeComment[idx]}
              onChange={(ev) => handleChangeOccupation(ev, idx)}
            />
            <label htmlFor='occupation'>Occupation Free Comment</label>
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
                disabled={freeComment[idx]}
                onChange={(ev) => handleChange(ev, idx)}
                value={freeComment[idx] ? null : member.occupation}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} sm={6}>
            <p>Occupation Free comment</p>
            <InputText
              required
              className={classes.input}
              disabled={!freeComment[idx]}
              name='occupationFreeComment'
              placeholder='Occupation Free Comment'
              onChange={(ev) => handleChange(ev, idx)}
              value={freeComment[idx] ? member.occupation?.name : ''}
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
            <p>D.O.B</p>
            <Calendar
              yearNavigator
              name='birthDate'
              className='w-100'
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
          <Col className={classes.col} xs={12} md={idx === 0 ? 6 : 12}>
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
          {idx === 1 && (
            <Col className={classes.col} xs={12} md={4}>
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
      ))}
    </Container>
  )
}
