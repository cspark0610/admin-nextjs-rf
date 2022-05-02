// main tools
import { useState, useReducer, useRef } from 'react'
import { useSession } from 'next-auth/react'

// prime components
import { Steps } from 'primereact/steps'

// bootstrap components
import { Row, Col, Button } from 'react-bootstrap'
import { ArrowLeft } from 'react-bootstrap-icons'

// reduers
import { FamilyManagement, INITIAL_STATE } from 'reducers/FamilyReducers'

// validations
import { validateRegisterFamily } from 'validations/registerFamilyData'

// services
import { FamiliesService } from 'services/Families'
import { UsersService } from 'services/Users'
import { HomeService } from 'services/Home'

// components
import { CreatePreferences } from './Preferences'
import { CreateFamilyData } from './FamilyData'
import { CreateMainMembers } from './Hosts'
import { CreateLodging } from './Lodging'
import { CreateHome } from './Home'
import { CreateUser } from './User'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SetStateType, SubmitType } from 'types'
import { FC } from 'react'

type CreateFamilyProps = {
  setShowCreate: SetStateType<boolean>
  setError: SetStateType<string>
}

export const CreateFamily: FC<CreateFamilyProps> = ({
  setShowCreate,
  setError,
}) => {
  const [data, dispatch] = useReducer(FamilyManagement, { ...INITIAL_STATE })
  const [actualStep, setActualStep] = useState(0)
  const top = useRef<HTMLSpanElement>(null)
  const { data: session } = useSession()
  const items = [
    { label: 'User' },
    { label: 'Host' },
    { label: 'Family' },
    { label: 'Preferences' },
    { label: 'Lodging' },
    { label: 'Home' },
  ]

  /**
   * create family steps templates
   */
  const steps = [
    <CreateUser key={0} data={data.user} dispatch={dispatch} />,
    <CreateMainMembers key={1} data={data} dispatch={dispatch} />,
    <CreateFamilyData key={2} data={data} dispatch={dispatch} />,
    <CreatePreferences key={3} data={data} dispatch={dispatch} />,
    <CreateLodging key={4} data={data.home} dispatch={dispatch} />,
    <CreateHome key={5} data={data.home} dispatch={dispatch} />,
  ]

  /**
   * verify actual step is not the latest step
   */
  const isNotLastStep = () => actualStep < items.length - 1

  /**
   * handle scroll to top
   */
  const goTop = () => top.current?.scrollIntoView({ block: 'center' })

  /**
   * handle returns to previous step
   */
  const handlePrevStep = () => {
    setActualStep(actualStep > 0 ? actualStep - 1 : actualStep)
    goTop()
  }

  /**
   * handle submit and continue to
   * next step or submit to create family
   */
  const handleSubmit = async (ev: SubmitType) => {
    ev.preventDefault()
    const validationError = validateRegisterFamily({ idx: actualStep, data })
    if (isNotLastStep() && !validationError) {
      setActualStep(actualStep + 1)
      goTop()
    } else if (validationError) setError(validationError)
    else {
      const { user, home, ...family } = data
      const createUserResponse = await UsersService.createUser(
        session?.token as string,
        user
      )
      if (createUserResponse.response)
        setError(createUserResponse.response.data?.message)
      else {
        const createFamilyResponse = await FamiliesService.createFamily(
          session?.token as string,
          { ...family, user: createUserResponse.data?._id }
        )
        if (createFamilyResponse.response)
          setError(createFamilyResponse.response.data?.message)
        else {
          const createHomeResponse = await HomeService.createHome(
            session?.token as string,
            createFamilyResponse.data._id,
            {
              ...home,
              houseRooms: home.houseRooms.map((room: object) => ({
                amount: 1,
                roomType: room,
              })),
            }
          )
          if (createHomeResponse.response)
            setError(createHomeResponse.response.data?.message)
          else setShowCreate(false)
        }
      }
    }
  }

  return (
    <Row>
      <Row className='mb-5'>
        <Col xs={3}>
          <Button
            className={classes.button}
            onClick={() => setShowCreate(false)}
          >
            <ArrowLeft /> <span ref={top}>Volver</span>
          </Button>
        </Col>
      </Row>
      <Steps
        id='step-bar'
        model={items}
        activeIndex={actualStep}
        className={classes.steps}
      />
      <form onSubmit={handleSubmit}>
        {steps[actualStep]}
        <Row className='my-5'>
          <Col xs={3}>
            <Button onClick={handlePrevStep} className={classes.button}>
              Prev
            </Button>
          </Col>
          <Col xs={3}>
            <Button type='submit' className={classes.button}>
              {isNotLastStep() ? 'Next' : 'Save'}
            </Button>
          </Col>
        </Row>
      </form>
    </Row>
  )
}
