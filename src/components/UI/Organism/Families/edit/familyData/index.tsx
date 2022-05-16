// main tools
import { useState, useEffect, ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'

// components
import { PhotoGallery } from 'components/UI/Molecules/Gallery'
import { UploadVideo } from 'components/UI/Atoms/UploadVideo'
import { EditFamilyMembersTab } from './familyMembers'
import { EditSchoolsTab } from './schools'
import { EditTenantsTab } from './tenants'
import { EditPetsTab } from './pets'

// bootstrap components
import { Container, Row, Col, Spinner, ProgressBar } from 'react-bootstrap'

// prime components
import { Accordion, AccordionTab } from 'primereact/accordion'
import { EditExternalStudentsTab } from './externalStudents'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect } from 'primereact/multiselect'
import { Checkbox } from 'primereact/checkbox'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  PetDataType,
  FamilyDataType,
  TenantDataType,
  SchoolDataType,
  PictureDataType,
  FamilyMemberDataType,
  ExternalStudentDataType,
} from 'types/models/Family'
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { RadioButtonChangeParams } from 'primereact/radiobutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { ChangeType, SetStateType } from 'types'
import { FC, Dispatch } from 'react'

type UpdateFamilyDataProps = {
  uploadFamilyFilesProcess: number
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
      | number
      | null
      | string[]
      | { file: File; category?: string }
      | { picture: File | PictureDataType; category?: string }
      | MultiSelectChangeParams
    type: string
  }>
  setError: SetStateType<string>
}

export const UpdateFamilyData: FC<UpdateFamilyDataProps> = ({
  data,
  setError,
  dispatch,
  uploadFamilyFilesProcess,
}) => {
  const {
    gender: genders,
    program: programs,
    familyRule: familyRules,
  } = useGenerics(['gender', 'program', 'familyRule'])

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
        className='mx-3'
        name='noRedLeafStudents'
        value={data.noRedLeafStudents}
        checked={data.noRedLeafStudents}
      />
      <label>
        This box indicates if the user has marked during the registration that
        hosts other international students
      </label>
    </span>
  )

  return (
    <Container fluid className={classes.container}>
      {uploadFamilyFilesProcess > 0 && (
        <>
          <h5>Uploading files process</h5>
          <ProgressBar className='my-3' now={uploadFamilyFilesProcess} />
        </>
      )}
      <h2 className={classes.subtitle}>Family</h2>
      <Row className='justify-content-center'>
        <Col className={classes.col} xs={12} md={6}>
          <p>Family video</p>
          <UploadVideo
            dataCase='family'
            dispatch={dispatch}
            data={data.video as string}
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Family pictures</p>
          <PhotoGallery
            dataCase='family'
            dispatch={dispatch}
            pictures={data.familyPictures}
          />
        </Col>
      </Row>
      <Row>
        <Col className={classes.col} xs={12} md={5}>
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
        <Col className={classes.col} xs={12} md={7}>
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
                setError={setError}
                dispatch={dispatch}
                familyId={data._id as string}
                familyMembers={data.familyMembers as FamilyMemberDataType[]}
              />
            </AccordionTab>
            <AccordionTab header='Pets'>
              <EditPetsTab
                setError={setError}
                dispatch={dispatch}
                familyId={data._id as string}
                pets={data.pets as PetDataType[]}
              />
            </AccordionTab>
            <AccordionTab header='Schools'>
              <EditSchoolsTab
                dispatch={dispatch}
                familyId={data._id as string}
                schools={data.schools as SchoolDataType[]}
              />
            </AccordionTab>
            <AccordionTab header={tenantsHeaderTemplate()}>
              <EditTenantsTab
                setError={setError}
                dispatch={dispatch}
                familyId={data._id as string}
                tenantList={data.tenantList as TenantDataType[]}
              />
            </AccordionTab>
            <AccordionTab header={externalStudentsHeaderTemplate()}>
              <EditExternalStudentsTab
                setError={setError}
                dispatch={dispatch}
                familyId={data._id as string}
                noRedLeafStudentsList={
                  data.noRedLeafStudentsList as ExternalStudentDataType[]
                }
              />
            </AccordionTab>
          </Accordion>
        </Col>
      </Row>
    </Container>
  )
}
