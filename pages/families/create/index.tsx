import React, { useState } from 'react'
//components
import Layout from 'components/Layout'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'

import Anfitrion from 'components/Families/forms/RegisterFamily/Anfitrion'
import User from 'components/Families/forms/RegisterFamily/User'
import Family from 'components/Families/forms/RegisterFamily/Family'
import Preferences from 'components/Families/forms/RegisterFamily/Preferences'
import Lodging from 'components/Families/forms/RegisterFamily/Lodging'
import Home from 'components/Families/forms/RegisterFamily/Home'

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


const CreateFamily = () => {
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
    console.log('enviado')
  }

  return (
    <Layout>
      <div style={{margin: '0 auto', maxWidth:'1000px'}}>
        <h1 style={{textAlign:'center'}}>Create family</h1>
        <form className='stepsForm' onSubmit={handleSubmit}>
          <Steps model={stepItems} activeIndex={actualStep} />
          <div className='steps-container'>
            {STEPS[actualStep]}
            <div className='steps_footer'>
              <Button
                className='p-button-text p-button-plain'
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
      </div>
    </Layout>
  )
}
export default CreateFamily