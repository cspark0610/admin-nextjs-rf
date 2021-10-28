import React, { useState } from 'react'
import Modal from 'components/UI/Molecules/Modal'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'

import Anfitrion from '../forms/RegisterFamily/Anfitrion'
import User from '../forms/RegisterFamily/User'
import Family from '../forms/RegisterFamily/Family'
import Preferences from '../forms/RegisterFamily/Preferences'
import Lodging from '../forms/RegisterFamily/Lodging'
import Home from '../forms/RegisterFamily/Home'

const STEPS = [
  <User />,
  <Anfitrion />,
  <Family />,
  <Preferences />,
  <Lodging />,
  <Home />
]

const stepItems = [
  { label: 'User' },
  { label: 'Host' },
  { label: 'Family' },
  { label: 'Preferences' },
  { label: 'Lodging' },
  { label: 'Home' },
]

export default function CreateFamilyModal({ isOpen, setIsOpen }) {
  const [actualStep, setActualStep] = useState(0)  

  const handleSteps = (e) => {
    e.preventDefault()
    if (e.target.getAttribute('data-action') === 'btncfmback') {
      if (actualStep > 0) setActualStep(actualStep - 1)
    } else {
      if (actualStep < 6) setActualStep(actualStep + 1)
    }
  }

  const handleSubmit = () => {
  }

  return (
    <Modal
      title='Create new family'
      icon='family'
      visible={isOpen}
      setVisible={setIsOpen}
      xbig={true}
    >
      <form className='stepsForm' onSubmit={handleSubmit}>
        <Steps model={stepItems} activeIndex={actualStep} />
        <div className='steps-container'>
          {STEPS[actualStep]}          

          <div className=''>
            <Button
              className='p-btn p-btn-primary'
              data-action='btncfmback'
              onClick={handleSteps}
            >
              Back
            </Button>
            <Button className='p-btn p-btn-primary' onClick={handleSteps}>
              Next
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
