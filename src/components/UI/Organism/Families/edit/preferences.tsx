// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'

// prime components
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect } from 'primereact/multiselect'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { FamilyDataType } from 'types/models/Family'
import { FC, Dispatch, ChangeEvent } from 'react'
import { ChangeType } from 'types'

type UpdatePreferencesProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>
      idx?: number
    } | null
    type: string
  }>
}

export const UpdatePreferences: FC<UpdatePreferencesProps> = ({
  data,
  dispatch,
}) => {
  const { data: session, status } = useSession()
  const [diets, setDiets] = useState(undefined)
  const [genders, setGenders] = useState(undefined)
  const [petTypes, setPetTypes] = useState(undefined)
  const [interests, setInterests] = useState(undefined)
  const [activities, setActivities] = useState(undefined)
  const [familyRules, setFamilyRules] = useState(undefined)

  /**
   * handle add pet
   */
  const handleAddPet = () => dispatch({ type: 'handleAddPet', payload: null })

  /**
   * handle remove latest pet
   */
  const handleRemovePet = () =>
    dispatch({ type: 'handleRemovePet', payload: null })

  /**
   * handle change family info and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'familyInfo', payload: { ev } })

  /**
   * handle change pet and dispatch data
   */
  const handlePetChange = (
    ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => dispatch({ type: 'handlePetsChange', payload: { ev, idx } })

  /**
   * handle get generics from backend
   */
  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          [
            'diet',
            'gender',
            'petType',
            'interest',
            'familyRule',
            'culturalActivity',
          ]
        )

        setDiets(data.diet)
        setGenders(data.gender)
        setPetTypes(data.petType)
        setInterests(data.interest)
        setFamilyRules(data.familyRule)
        setActivities(data.culturalActivity)
      })()
    }
  }, [status, session])

  return (
    <Container fluid className={classes.container}>
      <Row>
        <h2 className={classes.subtitle}>Activities</h2>
        <Col className={classes.col} xs={6}>
          <p>Activities/hobbies</p>
          {interests === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              name='interests'
              optionValue='_id'
              optionLabel='name'
              options={interests}
              value={data.interests}
              placeholder='Interests'
              onChange={handleChange}
              className={classes.input}
            />
          )}
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Cultural activities</p>
          {activities === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              optionValue='_id'
              optionLabel='name'
              options={activities}
              onChange={handleChange}
              name='culturalActivities'
              className={classes.input}
              value={data.culturalActivities}
              placeholder='Cultural Activities'
            />
          )}
        </Col>
      </Row>
      <Row>
        <h2 className={classes.subtitle}>Special note/preference</h2>
        <Col className={classes.col} xs={6}>
          <p>
            Any SPECIAL details we should know about the house rule or the
            family members
          </p>
          {familyRules === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              optionValue='_id'
              optionLabel='name'
              placeholder='Rules'
              options={familyRules}
              name='rulesForStudents'
              onChange={handleChange}
              className={classes.input}
              value={data.rulesForStudents}
            />
          )}
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Our family welcomes</p>
          {genders === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              options={genders}
              optionValue='_id'
              optionLabel='name'
              placeholder='Select'
              onChange={handleChange}
              className={classes.input}
              name='welcomeStudentGenders'
              value={data.welcomeStudentGenders}
            />
          )}
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Diet/Special diet in the family</p>
          {diets === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              options={diets}
              optionValue='_id'
              optionLabel='name'
              name='specialDiet'
              placeholder='Select'
              onChange={handleChange}
              value={data.specialDiet}
              className={classes.input}
            />
          )}
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Acceptable diets</p>
          {diets === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              options={diets}
              optionValue='_id'
              optionLabel='name'
              placeholder='Select'
              name='acceptableDiets'
              onChange={handleChange}
              className={classes.input}
              value={data.acceptableDiets}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col className={classes.col} xs={6}>
          <h2 className={classes.subtitle}>Number of pets</h2>
          <div className={classes.counter}>
            <DashCircle role='button' onClick={handleRemovePet} />
            <p>{data.pets?.length}</p>
            <PlusCircle role='button' onClick={handleAddPet} />
          </div>
        </Col>
      </Row>
      {data.pets?.map((pet, idx: number) => (
        <Row key={idx}>
          <Divider />
          <Col className={classes.col} xs={3}>
            <p>Specie</p>
            {petTypes === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                name='type'
                value={pet.type}
                optionValue='_id'
                optionLabel='name'
                options={petTypes}
                placeholder='Select'
                className={classes.input}
                onChange={(ev) => handlePetChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Name (optional)</p>
            <InputText
              name='name'
              value={pet.name}
              placeholder='Name'
              className={classes.input}
              onChange={(ev) => handlePetChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Breed (optional)</p>
            <InputText
              name='race'
              value={pet.race}
              placeholder='Breed'
              className={classes.input}
              onChange={(ev) => handlePetChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Age (optional)</p>
            <InputNumber
              min={0}
              max={100}
              mode='decimal'
              value={pet.age}
              className='w-100'
              placeholder='Age'
              inputClassName={classes.input}
              onValueChange={(e) => handlePetChange(e, idx)}
            />
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Note (optional)</p>
            <InputTextarea
              rows={4}
              name='remarks'
              value={pet.remarks}
              placeholder='Breed'
              className={classes.input}
              onChange={(ev) => handlePetChange(ev, idx)}
            />
          </Col>
        </Row>
      ))}
    </Container>
  )
}
