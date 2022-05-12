// main tools
import { useState, useEffect, ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'

// components
import { UploadVideo } from 'components/UI/Atoms/UploadVideo'
import { EditFamilyMembersTab } from './familyMembers'
import { EditTenantsTab } from './tenants'
import { EditSchoolsTab } from './schools'
import { EditPetsTab } from './pets'

// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { Accordion, AccordionTab } from 'primereact/accordion'
import { EditExternalStudentsTab } from './externalStudents'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect } from 'primereact/multiselect'
import { Checkbox } from 'primereact/checkbox'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  FamilyDataType,
  FamilyMemberDataType,
  PetDataType,
} from 'types/models/Family'
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { RadioButtonChangeParams } from 'primereact/radiobutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type UpdateFamilyDataProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev:
            | ChangeType
            | RadioButtonChangeParams
            | DropdownChangeParams
            | ChangeEvent<HTMLTextAreaElement>
          idx?: number
        }
      | File
      | MultiSelectChangeParams
      | null
    type: string
  }>
}

export const UpdateFamilyData: FC<UpdateFamilyDataProps> = ({
  data,
  dispatch,
}) => {
  const { data: session, status } = useSession()
  const [genders, setGenders] = useState(undefined)
  const [programs, setPrograms] = useState(undefined)
  const [familyRules, setFamilyRules] = useState(undefined)

  /**
   * handle family internal data changes
   */
  const handleInternalDataChange = (ev: MultiSelectChangeParams) =>
    dispatch({ type: 'handleInternalDataChange', payload: ev })

  /**
   * handle change user and dispatch data
   */
  const handleChange = (
    ev:
      | DropdownChangeParams
      | RadioButtonChangeParams
      | MultiSelectChangeParams
      | ChangeEvent<HTMLTextAreaElement>
  ) => dispatch({ type: 'familyInfo', payload: { ev } })

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          ['gender', 'program', 'familyRule']
        )

        setFamilyRules(data.familyRule)
        setPrograms(data.program)
        setGenders(data.gender)
      })()
    }
  }, [status, session])

  const tenantsHeaderTemplate = () => (
    <span>
      Tenants
      <Checkbox
        name='tenants'
        className='mx-3'
        value={data.tenants}
        checked={data.tenants}
      />
      <label>
        This box indicates if the user has marked during the registration that
        hosts tenants
      </label>
    </span>
  )

  const externalStudentsHeaderTemplate = () => (
    <span>
      Other International Students
      <Checkbox
        name='tenants'
        className='mx-3'
        value={data.tenants}
        checked={data.tenants}
      />
      <label>
        This box indicates if the user has marked during the registration that
        hosts other international students
      </label>
    </span>
  )

  return (
    <Container fluid className={classes.container}>
      <h2 className={classes.subtitle}>Family</h2>
      <Row className='justify-content-center'>
        <Col className={classes.col} xs={6}>
          <p>Family video</p>
          <UploadVideo data={data.home?.video as string} dispatch={dispatch} />
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Family pictures</p>
          <UploadVideo data={data.home?.video as string} dispatch={dispatch} />
        </Col>
      </Row>
      <Row>
        <Col className={classes.col} xs={5}>
          <p>Welcome letter</p>
          <InputTextarea
            rows={11}
            name='welcomeLetter'
            onChange={handleChange}
            className={classes.input}
            value={data.welcomeLetter}
            placeholder='Welcome letter'
          />
        </Col>
        <Col className={classes.col} xs={7}>
          <Row>
            <Col className={classes.col} xs={12}>
              <p>This family is receiving</p>
              {genders === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  options={genders}
                  optionLabel='name'
                  onChange={handleChange}
                  className={classes.input}
                  name='welcomeStudentGenders'
                  value={data.welcomeStudentGenders}
                  placeholder='Welcome student genders'
                />
              )}
            </Col>
            <Col className={classes.col} xs={12}>
              <p>Family Programs</p>
              {programs === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  optionLabel='name'
                  options={programs}
                  name='availablePrograms'
                  className={classes.input}
                  placeholder='Available programs'
                  onChange={handleInternalDataChange}
                  value={data.familyInternalData?.availablePrograms}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12}>
              <p>Family Rules</p>
              {familyRules === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  optionLabel='name'
                  options={familyRules}
                  name='rulesForStudents'
                  onChange={handleChange}
                  className={classes.input}
                  placeholder='Family rules'
                  value={data.rulesForStudents}
                />
              )}
            </Col>
          </Row>
        </Col>
        <Col className={classes.col} xs={12}>
          <Accordion multiple activeIndex={[0]}>
            <AccordionTab header='Family members'>
              <EditFamilyMembersTab
                dispatch={dispatch}
                familyMembers={data.familyMembers as FamilyMemberDataType[]}
              />
            </AccordionTab>
            <AccordionTab header='Pets'>
              <EditPetsTab
                dispatch={dispatch}
                pets={data.pets as PetDataType[]}
              />
            </AccordionTab>
            <AccordionTab header='Schools'>
              <EditSchoolsTab
                dispatch={dispatch}
                schools={data.schools as FamilyDataType['schools']}
              />
            </AccordionTab>
            <AccordionTab header={tenantsHeaderTemplate()}>
              <EditTenantsTab
                dispatch={dispatch}
                tenantsList={data.tenantList as FamilyDataType['tenantList']}
              />
            </AccordionTab>
            <AccordionTab header={externalStudentsHeaderTemplate()}>
              <EditExternalStudentsTab
                dispatch={dispatch}
                noRedLeafStudents={
                  data.noRedLeafStudentsList as FamilyDataType['noRedLeafStudentsList']
                }
              />
            </AccordionTab>
          </Accordion>
        </Col>
      </Row>
    </Container>
  )
}
