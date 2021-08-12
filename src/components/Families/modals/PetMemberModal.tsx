import React, { useState, useEffect } from 'react';
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { classNames } from 'primereact/utils'
import { useFormik } from 'formik'
//services
import GenericsService from 'services/Generics';
import { useSession } from 'next-auth/client';
//Api
import FamiliesService from 'services/Families'

type PetMemberData = {
    age: number
    name: string
    race: string
    type: string
    remarks: string
}

interface Props {
  familyData: any,
  setFamilyData: (params: any) => void,
  setShowPetsModal: (params: any) => void,
}

const PetMemberModal:React.FC<Props> = ({ setFamilyData, familyData, setShowPetsModal}) => {
  const [petTypesInput, setPetTypesInput] = useState([]);
  const [session, ] = useSession()

  useEffect(() => {
    (async () => {
      const { petTypes } = await GenericsService.getAll(session?.token, ['petTypes'])
      await setPetTypesInput(petTypes)
    })()
    
  }, [session]);

  const formik = useFormik({
    initialValues: {
      age:'',
      name: '',
      race: '',
      type: '',
      remarks: ''
    },
    validate: (data) => {
      let errors: Partial<PetMemberData> = {}
      if (data.name === '') {
        errors.name= 'Name is required'
      }
      if (data.type === '' ) {
        errors.type= 'Type is required'
      }
      return errors
    },
    onSubmit: (data) => {
      FamiliesService.updatefamily(session?.token, familyData._id, {...familyData, pets: [...familyData.pets, data]})
        .then(() => {
          setFamilyData({
            ...familyData,
            pets: [
              ...familyData.pets,
              data
            ]
          })
          formik.resetForm()
          setShowPetsModal(false)
        })
    }
  })

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
            return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
        };

  return (
    <form onSubmit={formik.handleSubmit}>
      <InputContainer label= "Name" labelClass={classNames({ 'p-error': isFormFieldValid('name') })}>
        <InputText
            id="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            className={classNames({ 'p-invalid': isFormFieldValid('name') })}
        />
        {getFormErrorMessage('name')}
      </InputContainer>
      <InputContainer label="Type" labelClass={classNames({ 'p-error': isFormFieldValid('type') })}>
        <Dropdown
          id="type"
          options={petTypesInput}
          placeholder="Type"
          optionLabel="name" 
          value={formik.values.type}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('type') })}
        />
        {getFormErrorMessage('type')}
      </InputContainer>
      <InputContainer label= "Race">
        <InputText
          id="race"
          placeholder="Race"
          value={formik.values.race}
          onChange={formik.handleChange}
        /> 
      </InputContainer>
      <InputContainer label= "Age">
        <InputText
          id="age"
          placeholder="Age"
          value={formik.values.age}
          onChange={formik.handleChange}
        /> 
      </InputContainer>
      <InputContainer label= "Comments">
        <InputTextarea
          id="remarks"
          placeholder="Comments..."
          value={formik.values.remarks}
          onChange={formik.handleChange}
        /> 
      </InputContainer>
      <Button type="submit">Save</Button>
    </form>
  );
}

export default PetMemberModal;
