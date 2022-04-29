// main tools
import { useState, useReducer, useRef } from 'react'

// prime components
import { Steps } from 'primereact/steps'

// bootstrap components
import { Row, Col, Button } from 'react-bootstrap'
import { ArrowLeft } from 'react-bootstrap-icons'

// reduers
import { FamilyManagement, INITIAL_STATE } from 'reducers/FamilyReducers'

// components
import { CreateUser } from './User'
import { CreateMainMembers } from './Hosts'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SetStateType, SubmitType } from 'types'
import { FC } from 'react'

type CreateFamilyProps = {
  setShowCreate: SetStateType<boolean>
  setError: SetStateType<string>
}

export const CreateFamily: FC<CreateFamilyProps> = ({ setShowCreate }) => {
  const [data, dispatch] = useReducer(FamilyManagement, { ...INITIAL_STATE })
  const [actualStep, setActualStep] = useState(0)
  const top = useRef<HTMLSpanElement>(null)
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
    <CreateUser data={data.user} dispatch={dispatch} />,
    <CreateMainMembers data={data} dispatch={dispatch} />,
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
  const handleSubmit = (ev: SubmitType) => {
    ev.preventDefault()
    if (isNotLastStep()) {
      setActualStep(actualStep + 1)
      goTop()
    } else console.log('hola')
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
