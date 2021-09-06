import React, { useState, useContext, useRef } from 'react'
//components
import MainMemberForm from 'components/UI/Organism/MainMemberForm'
import FormHeader from 'components/UI/Molecules/FormHeader'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import ContactFormComponent from 'components/UI/Organism/ContactForm'
//Api
import FamiliesService from 'services/Families'
//Context
import { FamilyContext } from 'context/FamilyContext'
import { useSession } from 'next-auth/client'
import { stringify } from 'querystring'
import { verifyEditFamilyData } from 'utils/verifyEditFamilyData'

interface Generic {
  createdAt: string
  id: string
  name: string
  updatedAt: string
}

interface MainMember {
  firstName: string
  lastName: string
  gender: string
  occupation: Generic
  email?: string
  cellPhoneNumber: string
  homePhoneNumber?: string
  workPhoneNumber?: string
  isCellPhoneVerified: boolean
  isHomePhoneVerified: boolean
  isWorkPhoneVerified: boolean
  birthDate: string
  photo?: string
  mainLanguagesSpokenAtHome: Generic[]
  spokenLanguages: Generic[]
  relationshipWithPrimaryHost?: string | null
}

export default function ContactForm() {
  const { family, getFamily } = useContext(FamilyContext)
  const [mainMembers, setMainMembers] = useState<MainMember[]>(
    family.mainMembers || []
  )
  const [loading, setLoading] = useState(false)
  const toast = useRef(null)
  const [session] = useSession()

  const newMember: MainMember = {
    firstName: '',
    lastName: '',
    gender: '',
    occupation: {
      createdAt: '',
      updatedAt: '',
      id: '',
      name: '',
    },
    cellPhoneNumber: '',
    homePhoneNumber: '',
    workPhoneNumber: '',
    isCellPhoneVerified: false,
    isHomePhoneVerified: false,
    isWorkPhoneVerified: false,
    birthDate: '',
    mainLanguagesSpokenAtHome: [],
    spokenLanguages: [],
    email: '',
  }

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

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Host data successfully updated',
      life: 3000,
    })
  }
  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error Message',
      detail: 'An error has ocurred',
      life: 3000,
    })
  }

  const addMember = () => {
    setMainMembers([...mainMembers, newMember])
  }
  const updateMember = (updatedMember, id) => {
    const updatedMemberList = [...mainMembers]
    updatedMemberList[id] = {
      ...updatedMemberList[id],
      [updatedMember.target.name]: updatedMember.target.value,
    }
    setMainMembers(updatedMemberList)
  }
  const handleSubmit = () => {
    setLoading(true)
    let formatedData: any = mainMembers
    delete formatedData.photo
    const verify = verifyEditFamilyData(formatedData, 1)
    if (verify.length > 0) {
      setLoading(false)
      toast.current.show(toastMessage(verify))
    } else {
      FamiliesService.updatefamily(session?.token, family._id, { formatedData })
        .then(() => {
          setLoading(false)
          showSuccess()
          getFamily()
        })
        .catch((err) => {
          setLoading(false)
          showError()
          console.error(err)
        })

      setLoading(false)
    }
  }
  return (
    <div className='contact_layout'>
      <FormHeader title='Contact' isLoading={loading} onClick={handleSubmit} />
      {mainMembers?.map((mainMember, index) => {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            key={index}
            style={{ order: index + 1 }}
          >
            <MainMemberForm
              id={index}
              member={mainMember}
              submit={updateMember}
              family={family}
            />
          </form>
        )
      })}
      <div style={{ order: 1 }}>
        <ContactFormComponent />
      </div>
      {mainMembers?.length === 1 && (
        <Button
          style={{ maxWidth: '300px', order: 2, marginTop: '1em' }}
          icon='pi pi-user-plus'
          label='Add Main family member'
          className='p-button-rounded'
          onClick={() => addMember()}
        />
      )}
      <Toast ref={toast} />
    </div>
  )
}
