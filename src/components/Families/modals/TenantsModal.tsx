import React,{ useContext, useEffect, useState } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils'
import { useFormik } from 'formik'
//services
import GenericsService from 'services/Generics';
import { useSession } from 'next-auth/client';
//Api
import FamiliesService from 'services/Families'
import { FamilyContext } from 'context/FamilyContext';
//utils
import {general} from 'utils/calendarRange'

type tenantsData = {
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  occupation: string
}

interface Props {
  familyData: any,
  closeDialog: () => void
  tenantData: any
}

const TenantsModal: React.FC<Props> = ({ tenantData, familyData, closeDialog}) => {
  const [gendersInput, setGendersInput] = useState([])
  const [occupationsInput, setOccupationsInput] = useState([])
  const [session, ] = useSession()
  const { getFamily } = useContext(FamilyContext)

  useEffect(() => {
    (async () => {
      const { genders, occupations } = await GenericsService.getAll(session?.token, ['genders', 'occupations'])
      console.log(occupations)
      setGendersInput(genders)
      setOccupationsInput(occupations)
    })()
  }, [session]);

  console.log('tenantData', tenantData)

  const formik = useFormik({
    initialValues: {
      firstName: tenantData?.firstName || '',
      lastName: tenantData?.lastName || '',
      gender: tenantData?.gender || '',
      birthDate: tenantData?.birthDate || '',
      occupation: tenantData?.occupation || ''
    },
    validate: (data) => {
      let errors: Partial<tenantsData> = {}
      if (data.firstName === '') {
        errors.firstName= 'First name is required'
      }
      if (data.lastName === '') {
        errors.lastName= 'Last name is required'
      }
      if (data.gender === '') {
        errors.gender= 'Gender is required'
      }
      if (data.birthDate === '') {
        errors.birthDate= 'birthDate is required'
      }
      if (data.occupation === '') {
        errors.occupation= 'Occupation is required'
      }
      return errors
    },
    onSubmit: (data) => {

      const tenants = [...familyData.tenantList]

      if(tenantData){
        const updateTenant = tenants.find(tenant => tenant._id === tenantData._id)
        tenants[tenants.indexOf(updateTenant)] = {
          ...tenants[tenants.indexOf(updateTenant)],
          ...data
        }
      }else{
        tenants.push(data)
      }

      FamiliesService.updatefamily(session?.token, familyData._id, {...familyData, tenantList: tenants})
        .then(() => {
          getFamily()
          closeDialog()
        })
        .catch(e => {
          console.error(e)
        })
    }
  })

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

  return (
    <form onSubmit={formik.handleSubmit}  >
      <InputContainer label= "First Name" labelClass={classNames({ 'p-error': isFormFieldValid('fisrtName') })}>
        <InputText
            id="firstName"
            placeholder="First name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            className={classNames({ 'p-invalid': isFormFieldValid('firstName') })}
        />
        {getFormErrorMessage('firstName')}
      </InputContainer>
      <InputContainer label= "Last Name" labelClass={classNames({ 'p-error': isFormFieldValid('lastName') })}>
        <InputText
            id="lastName"
            placeholder="Last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            className={classNames({ 'p-invalid': isFormFieldValid('lastName') })}
        />
        {getFormErrorMessage('lastName')}
      </InputContainer>
      <InputContainer label= "Gender" labelClass={classNames({ 'p-error': isFormFieldValid('gender') })}>
        <Dropdown
          id="gender"
          placeholder="Gender"
          options={gendersInput}
          optionLabel="name"
          value={formik.values.gender}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('gender') })}
        />
        {getFormErrorMessage('gender')}
      </InputContainer>
      <InputContainer label= "birthDate" labelClass={classNames({ 'p-error': isFormFieldValid('birthDate') })}>
        <Calendar 
          name='birthDate' 
          id="birthDate" 
          showIcon 
          monthNavigator
          yearNavigator
          yearRange={general}
          placeholder="birthDate"  
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('birthDate') })}
          value={new Date(formik.values.birthDate)}
        />
        {getFormErrorMessage('birthDate')}
      </InputContainer>
      <InputContainer label= "Occupation" labelClass={classNames({ 'p-error': isFormFieldValid('occupation') })}>
        <Dropdown
          id="occupation"
          placeholder="Occupation"
          options={occupationsInput}
          optionLabel="name"
          value={formik.values.occupation}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('occupation') })}
        />
        {getFormErrorMessage('occupation')}
      </InputContainer>
      <Button type="submit">Save</Button>
    </form>
  );
}

export default TenantsModal;
