import React, { useState, useEffect, useContext } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { useFormik } from 'formik'
//services
import GenericsService from 'services/Generics'
import { useSession } from 'next-auth/client'
//Api
import FamiliesService from 'services/Families'
import { FamilyContext } from 'context/FamilyContext'
//utils
import { general } from 'utils/calendarRange'

type ExternalStudenData = {
  name: string
  nationality: string
  gender: string
  birthDate: string
  stayingSince: string
  stayingUntil: string
}

interface Props {
  familyData: any
  closeDialog: () => void
  studentData: any
}

const ExternalStudentsModal: React.FC<Props> = ({
  studentData,
  familyData,
  closeDialog,
}) => {
  const [gendersInput, setGendersInput] = useState([])
  const [nationalitiesInput, setNationalitiesInput] = useState([])
  const [session] = useSession()
  const { getFamily } = useContext(FamilyContext)

  useEffect(() => {
    ;(async () => {
      const { genders, nationalities } = await GenericsService.getAll(
        session?.token,
        ['genders', 'nationalities']
      )
      await setGendersInput(genders)
      await setNationalitiesInput(nationalities)
    })()
  }, [session])

  const formik = useFormik({
    initialValues: {
      name: studentData?.name || '',
      nationality: studentData?.nationality || '',
      gender: studentData?.gender || '',
      birthDate: studentData?.birthDate || '',
      stayingSince: studentData?.stayingSince || '',
      stayingUntil: studentData?.stayingUntil || '',
    },
    validate: (data) => {
      let errors: Partial<ExternalStudenData> = {}
      if (data.name === '') {
        errors.name = 'Name is required'
      }
      if (data.nationality === '') {
        errors.nationality = 'Nationality is required'
      }
      if (data.gender === '') {
        errors.gender = 'Gender is required'
      }
      if (data.birthDate === '') {
        errors.birthDate = 'Date of bidth is required'
      }
      if (data.stayingSince === '') {
        errors.stayingSince = 'Arrival date is required'
      }
      if (data.stayingUntil === '') {
        errors.stayingUntil = 'Departure date is required'
      }
      return errors
    },
    onSubmit: (data) => {
      const externalStudents = [...familyData.noRedLeafStudents]

      if (studentData) {
        const updateStudent = externalStudents.find(
          (student) => student._id === studentData._id
        )
        externalStudents[externalStudents.indexOf(updateStudent)] = {
          ...externalStudents[externalStudents.indexOf(updateStudent)],
          ...data,
        }
      } else {
        externalStudents.push(data)
      }

      FamiliesService.updatefamily(session?.token, familyData._id, {
        ...familyData,
        noRedLeafStudents: externalStudents,
      })
        .then(() => {
          getFamily()
          formik.resetForm()
          closeDialog()
        })
        .catch((e) => {
          console.error(e)
        })
    },
  })

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className='p-error'>{formik.errors[name]}</small>
      )
    )
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <InputContainer
        label='Name'
        labelClass={classNames({ 'p-error': isFormFieldValid('name') })}
      >
        <InputText
          id='name'
          name='name'
          placeholder='Name'
          value={formik.values.name}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('name') })}
        />
        {getFormErrorMessage('name')}
      </InputContainer>
      <InputContainer
        label='Nationality'
        labelClass={classNames({ 'p-error': isFormFieldValid('nationality') })}
      >
        <Dropdown
          id='nationality'
          name='nationality'
          placeholder='Nationality'
          optionLabel='name'
          options={nationalitiesInput}
          value={formik.values.nationality}
          onChange={formik.handleChange}
          className={classNames({
            'p-invalid': isFormFieldValid('nationality'),
          })}
        />
        {getFormErrorMessage('nationality')}
      </InputContainer>
      <InputContainer
        label='Gender'
        labelClass={classNames({ 'p-error': isFormFieldValid('gender') })}
      >
        <Dropdown
          id='gender'
          name='gender'
          placeholder='Gender'
          options={gendersInput}
          optionLabel='name'
          value={formik.values.gender}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('gender') })}
        />
        {getFormErrorMessage('gender')}
      </InputContainer>
      <InputContainer
        label='Date of birth'
        labelClass={classNames({ 'p-error': isFormFieldValid('birtDate') })}
      >
        <Calendar
          id='birthDate'
          placeholder='Date of bieth'
          name='birthDate'
          showIcon
          monthNavigator
          yearNavigator
          yearRange={general}
          value={new Date(formik.values.birthDate)}
          maxDate={new Date()}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('birthDate') })}
        />
        {getFormErrorMessage('birthDate')}
      </InputContainer>
      <InputContainer
        label='Arrival date'
        labelClass={classNames({ 'p-error': isFormFieldValid('arrivalDate') })}
      >
        <Calendar
          name='stayingSince'
          showIcon
          monthNavigator
          yearNavigator
          yearRange={general}
          placeholder='Arrival date'
          value={new Date(formik.values.stayingSince)}
          onChange={formik.handleChange}
          className={classNames({
            'p-invalid': isFormFieldValid('stayingSince'),
          })}
        />
        {getFormErrorMessage('stayingSince')}
      </InputContainer>
      <InputContainer
        label='Departure date'
        labelClass={classNames({
          'p-error': isFormFieldValid('departureDate'),
        })}
      >
        <Calendar
          name='stayingUntil'
          showIcon
          monthNavigator
          yearNavigator
          yearRange={general}
          placeholder='Departure date'
          value={new Date(formik.values.stayingUntil)}
          onChange={formik.handleChange}
          className={classNames({
            'p-invalid': isFormFieldValid('stayingUntil'),
          })}
        />
        {getFormErrorMessage('stayingUntil')}
      </InputContainer>
      <Button type='submit'>Save</Button>
    </form>
  )
}

export default ExternalStudentsModal
