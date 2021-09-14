import { useContext, useState, useRef } from 'react'
//components
import Layout from 'components/Layout'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import Anfitrion from 'components/Families/forms/RegisterFamily/Anfitrion'
import User from 'components/Families/forms/RegisterFamily/User'
import Family from 'components/Families/forms/RegisterFamily/Family'
import Preferences from 'components/Families/forms/RegisterFamily/Preferences'
import Lodging from 'components/Families/forms/RegisterFamily/Lodging'
import Home from 'components/Families/forms/RegisterFamily/Home'
import UsersService from 'services/Users'
import FamiliesServices from 'services/Families'
import { useSession } from 'next-auth/client'
import { RegisterFamilyContext } from 'context/RegisterFamilyContext'

// utils
import { verifyCreateFamilyData } from 'utils/verifyCreateFamilyData'
import { useRouter } from 'next/router'

const STEPS = [
  <User />,
  <Anfitrion />,
  <Family />,
  <Preferences />,
  <Lodging />,
  <Home />,
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
  const toast = useRef(null)
  const [session] = useSession()
  const [actualStep, setActualStep] = useState(0)
  const { family } = useContext(RegisterFamilyContext)
  const { push } = useRouter()

  const toastMessage = (verify) => ({
    severity: 'error',
    summary: 'Error',
    detail: (
      <ul>
        {verify.map((item, idx) => (
          <li key={idx}>"{item}" is required</li>
        ))}
      </ul>
    ),
    life: 4000,
  })

  const handleSteps = (e) => {
    e.preventDefault()
    if (e.target.getAttribute('data-action') === 'btncfmback') {
      if (actualStep > 0) setActualStep(actualStep - 1)
    } else {
      const verify = verifyCreateFamilyData(family, actualStep)
      if (verify.length > 0) {
        toast.current.show(toastMessage(verify))
      } else {
        if (actualStep < 5) setActualStep(actualStep + 1)
      }
    }
  }

  const handleSubmit = () => {
    const { user } = family
    const verify = verifyCreateFamilyData(family, actualStep)
    if (verify.length > 0) toast.current.show(toastMessage(verify))
    else {
      UsersService.createUser(session?.token, { ...user, userType: 'Family' })
        .then((response) => {
          console.log('User Created', response)
          const data = { ...family }

          if (
            data.mainMembers[0] &&
            data.mainMembers[0].relationshipWithThePrimaryHost !== null
          )
            delete data.mainMembers[0].relationshipWithThePrimaryHost

          FamiliesServices.createFamily(session?.token, {
            ...data,
            user: response,
            acceptableDiets: family.acceptableDiets.map((diet) => ({
              isFreeComment: false,
              doc: diet,
            })),
          })
            .then((res) => {
              console.log('CREATED FAMILY', res)
              FamiliesServices.createHome(session?.token, res._id, {
                ...family.home,
                houseRooms: family.home.houseRooms.map((room) => ({
                  amount: 1,
                  roomType: {
                    isFreeComment: false,
                    doc: room,
                  },
                })),
                studentRooms: family.home.studentRooms.map((room) => ({
                  ...room,
                  aditionalFeatures: room.aditionalFeatures.map(
                    (item) => item.value
                  ),
                })),
              })
                .then((result) => {
                  console.log('CREATED home', result)
                  push(`/families/${res._id}`)
                })
                .catch((error) => console.error(error))
            })
            .catch((error) => console.error(error))
        })
        .catch((error) => console.error(error))
    }
  }

  return (
    <Layout>
      <div style={{ margin: '0 auto', maxWidth: '1000px' }}>
        <h1 style={{ textAlign: 'center' }}>Create family</h1>
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
              {actualStep === 5 ? (
                <Button
                  type='button'
                  className='p-btn p-btn-primary'
                  onClick={handleSubmit}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  type='button'
                  className='p-btn p-btn-primary'
                  onClick={handleSteps}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
      <Toast position='bottom-left' ref={toast} />
    </Layout>
  )
}
export default CreateFamily
