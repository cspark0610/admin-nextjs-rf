// main tools
import { Fragment, FC, Dispatch } from 'react'
import dayjs from 'dayjs'

// bootstrap components
import { Button, Col, Row, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { RadioButton, RadioButtonChangeParams } from 'primereact/radiobutton'
import { Calendar } from 'primereact/calendar'

// services
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { ChangeType } from 'types'
import { FamilyMemberDataType } from 'types/models/Family'

interface FamilyMemberDataParams {
  data: FamilyMemberDataType
  handleSave: () => void
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
      idx?: number
    }
    type: string
  }>
  idx: number
}

export const FamilyMemberData: FC<FamilyMemberDataParams> = ({
  idx,
  data,
  dispatch,
  handleSave,
}) => {
  const {
    loading,
    gender: genders,
    language: languages,
    familyRelationship: familyRelationships,
    situation: situations,
  } = useGenerics(['gender', 'language', 'familyRelationship', 'situation'])

  /**
   * handle change user and dispatch data
   */
  const handleMemberChange = (
    ev: ChangeType | DropdownChangeParams | RadioButtonChangeParams,
    idx: number
  ) => dispatch({ type: 'handleFamiliarChange', payload: { ev, idx } })

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Row key={idx} className={classes.container} >
          <Divider />
          <Col className={classes.col} xs={12} lg={4}>
            <p>First name</p>
            <InputText
              required
              name='firstName'
              value={data.firstName}
              placeholder='First name'
              className={classes.input}
              onChange={(ev) => handleMemberChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} lg={4}>
            <p>Last name</p>
            <InputText
              required
              name='lastName'
              value={data.lastName}
              placeholder='Last name'
              className={classes.input}
              onChange={(ev) => handleMemberChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} lg={4}>
            <p>Gender</p>
            {genders === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                name='gender'
                appendTo='self'
                options={genders}
                optionLabel='name'
                placeholder='Gender'
                value={data.gender}
                className={classes.input}
                onChange={(ev) => handleMemberChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} lg={8}>
            <p>What language(s) do you speak?</p>
            {languages === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <MultiSelect
                filter
                showClear
                display='chip'
                appendTo='self'
                optionLabel='name'
                options={languages}
                name='spokenLanguages'
                className={classes.input}
                placeholder='Spoken languages'
                value={data.spokenLanguages || []}
                onChange={(ev) => handleMemberChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} lg={4}>
            <p>D.O.B</p>
            <Calendar
              name='birthDate'
              className='w-100'
              appendTo='self'
              maxDate={dayjs().toDate()}
              inputClassName={classes.input}
              value={data.birthDate ? new Date(data.birthDate) : new Date()}
              minDate={dayjs().add(-100, 'years').toDate()}
              onChange={(ev) => handleMemberChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} lg={7}>
            <p>Family relationship</p>
            {familyRelationships === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                optionLabel='name'
                appendTo='self'
                name='familyRelationship'
                className={classes.input}
                placeholder='Relationship'
                options={familyRelationships}
                value={data.familyRelationship}
                onChange={(ev) => handleMemberChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} lg={5}>
            <p>Lives at home?</p>
            <Row>
              {situations === undefined ? (
                <Spinner animation='grow' />
              ) : (
                situations.map((situation) => (
                  <Col className='mb-2' key={situation._id} xs='auto' lg={6}>
                    <RadioButton
                      name='situation'
                      className='me-2'
                      value={situation}
                      inputId={situation._id}
                      onChange={(ev) => handleMemberChange(ev, idx)}
                      checked={data.situation?._id === situation._id}
                    />
                    <label htmlFor={situation._id}>{situation.name}</label>
                  </Col>
                ))
              )}
            </Row>
          </Col>
          <Col>
            <Button className={classes.button} onClick={handleSave}>
              Save
            </Button>
          </Col>
        </Row>
      )}
    </>
  )
}
