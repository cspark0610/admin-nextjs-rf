// main tools
import { useState, useEffect, Fragment } from 'react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'

// prime components
import { RadioButton } from 'primereact/radiobutton'
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { RadioButtonChangeParams } from 'primereact/radiobutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { FamilyDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type CreateFamilyDataProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | RadioButtonChangeParams | DropdownChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const CreateFamilyData: FC<CreateFamilyDataProps> = ({
  data,
  dispatch,
}) => {
  const { data: session, status } = useSession()
  const [genders, setGenders] = useState(undefined)
  const [languages, setLanguages] = useState(undefined)
  const [familyRelationships, setFamilyRelationships] = useState(undefined)
  const [situations, setSituations] = useState<GenericDataType[] | undefined>(
    undefined
  )

  /**
   * handle add family member
   */
  const handleAddFamiliar = () =>
    dispatch({ type: 'handleAddFamiliar', payload: null })

  /**
   * handle remove latest family member
   */
  const handleRemoveFamiliar = () =>
    dispatch({ type: 'handleRemoveFamiliar', payload: null })

  /**
   * handle change user and dispatch data
   */
  const handleChange = (ev: RadioButtonChangeParams) =>
    dispatch({ type: 'familyInfo', payload: { ev } })

  /**
   * handle change user and dispatch data
   */
  const handleMemberChange = (
    ev: ChangeType | DropdownChangeParams | RadioButtonChangeParams,
    idx: number
  ) => dispatch({ type: 'handleFamiliarChange', payload: { ev, idx } })

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          ['gender', 'language', 'familyRelationship', 'situation']
        )

        setFamilyRelationships(data.familyRelationship)
        setSituations(data.situation)
        setLanguages(data.language)
        setGenders(data.gender)
      })()
    }
  }, [status, session])

  return (
    <Container fluid className={classes.container}>
      <Row>
        <Col className={classes.col} xs={4}>
          <h2 className={classes.subtitle}>Family members</h2>
          <div className={classes.counter}>
            <DashCircle role='button' onClick={handleRemoveFamiliar} />
            <p>{data.familyMembers?.length}</p>
            <PlusCircle role='button' onClick={handleAddFamiliar} />
          </div>
        </Col>
        <Col className={classes.col} xs={4}>
          <h2 className={classes.subtitle}>Tenants</h2>
          <p>Do you have tenants?</p>
          <div className={classes.options}>
            <label htmlFor='yes-tenant'>Yes</label>
            <RadioButton
              value={true}
              name='tenants'
              inputId='yes-tenant'
              checked={data.tenants}
              onChange={handleChange}
            />
            <label htmlFor='no-tenant'>No</label>
            <RadioButton
              value={false}
              name='tenants'
              inputId='no-tenant'
              checked={!data.tenants}
              onChange={handleChange}
            />
          </div>
        </Col>
        <Col className={classes.col} xs={4}>
          <h2 className={classes.subtitle}>External students</h2>
          <p>Do you usually host more than 1 student? Are you waiting to?</p>
          <div className={classes.options}>
            <label htmlFor='yes-externals'>Yes</label>
            <RadioButton
              value={true}
              inputId='yes-externals'
              onChange={handleChange}
              name='noRedLeafStudents'
              checked={data.noRedLeafStudents}
            />
            <label htmlFor='no-externals'>No</label>
            <RadioButton
              value={false}
              inputId='no-externals'
              onChange={handleChange}
              name='noRedLeafStudents'
              checked={!data.noRedLeafStudents}
            />
          </div>
        </Col>
      </Row>
      {data.familyMembers?.map((member, idx: number) => (
        <Row key={idx}>
          <Divider />
          <Col className={classes.col} xs={3}>
            <p>First name</p>
            <InputText
              required
              name='firstName'
              value={member.firstName}
              placeholder='First name'
              className={classes.input}
              onChange={(ev) => handleMemberChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={3}>
            <p>Last name</p>
            <InputText
              required
              name='lastName'
              value={member.lastName}
              placeholder='Last name'
              className={classes.input}
              onChange={(ev) => handleMemberChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={3}>
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
                onChange={(ev) => handleMemberChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={3}>
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
                className={classes.input}
                placeholder='Spoken languages'
                value={member.spokenLanguages}
                onChange={(ev) => handleMemberChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={4}>
            <p>D.O.B</p>
            <Calendar
              name='birthDate'
              className='w-100'
              inputClassName={classes.input}
              value={member.birthDate as Date}
              maxDate={dayjs().add(3, 'years').toDate()}
              minDate={dayjs().add(-100, 'years').toDate()}
              onChange={(ev) => handleMemberChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Family relationship</p>
            {familyRelationships === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                optionValue='_id'
                optionLabel='name'
                name='familyRelationship'
                className={classes.input}
                placeholder='Relationship'
                options={familyRelationships}
                value={member.familyRelationship}
                onChange={(ev) => handleMemberChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Lives at home?</p>
            <div className={classes.options}>
              {situations === undefined ? (
                <Spinner animation='grow' />
              ) : (
                situations.map((situation) => (
                  <Fragment key={situation._id}>
                    <label htmlFor={situation._id}>{situation.name}</label>
                    <RadioButton
                      name='situation'
                      value={situation._id}
                      inputId={situation._id}
                      onChange={(ev) => handleMemberChange(ev, idx)}
                      checked={member.situation === situation._id}
                    />
                  </Fragment>
                ))
              )}
            </div>
          </Col>
        </Row>
      ))}
    </Container>
  )
}
