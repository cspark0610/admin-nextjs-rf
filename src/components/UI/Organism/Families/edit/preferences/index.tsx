// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { FamilyDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'
import { useGenerics } from 'hooks/useGenerics'

type UpdatePreferencesProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const UpdatePreferences: FC<UpdatePreferencesProps> = ({
  data,
  dispatch,
}) => {
  const {
    diet: diets,
    mealPlan: mealPlans,
    interest: interests,
    culturalActivity: activities,
  } = useGenerics(['diet', 'interest', 'mealPlan', 'culturalActivity'])

  /**
   * handle change family info and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'familyInfo', payload: { ev } })

  /**
   * handle change contact accounts
   */
  const handleContactAccountChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'handleContactAccountChange', payload: { ev } })

  return (
    <Container fluid className={classes.container}>
      <Row>
        <Col className={classes.col} xs={6}>
          <h2 className={classes.subtitle}>Activities</h2>
          <Row>
            <Col className={classes.col} xs={12}>
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
            <Col className={classes.col} xs={12}>
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
            <Col className={classes.col} xs={12}>
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
            <Col className={classes.col} xs={12}>
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
            <Col className={classes.col} xs={12}>
              <p>Meal plan</p>
              {mealPlans === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  name='mealPlan'
                  optionValue='_id'
                  optionLabel='name'
                  options={mealPlans}
                  placeholder='Select'
                  value={data.mealPlan}
                  onChange={handleChange}
                  className={classes.input}
                />
              )}
            </Col>
          </Row>
        </Col>
        <Col className={classes.col} xs={6}>
          <h2 className={classes.subtitle}>Social media</h2>
          <Row>
            <Col className={classes.col} xs={12}>
              <p>Skype</p>
              <InputText
                name='skype'
                placeholder='Skype'
                className={classes.input}
                value={data.contactAccounts?.skype}
                onChange={handleContactAccountChange}
              />
            </Col>
            <Col className={classes.col} xs={12}>
              <p>Whatsapp</p>
              <InputMask
                name='whatsApp'
                placeholder='Whatsapp'
                mask='+99 (999) 999-9999'
                className={classes.input}
                value={data.contactAccounts?.whatsApp}
                onChange={handleContactAccountChange}
              />
            </Col>
            <Col className={classes.col} xs={12}>
              <p>Facebook messenger</p>
              <InputText
                name='facebookMessenger'
                className={classes.input}
                placeholder='facebook messenger'
                onChange={handleContactAccountChange}
                value={data.contactAccounts?.facebookMessenger}
              />
            </Col>
            <Col className={classes.col} xs={12}>
              <p>Line</p>
              <InputMask
                name='line'
                placeholder='Line'
                mask='+99 (999) 999-9999?'
                className={classes.input}
                value={data.contactAccounts?.line}
                onChange={handleContactAccountChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
