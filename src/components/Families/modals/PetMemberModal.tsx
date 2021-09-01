import React, { useState, useEffect, useContext } from 'react';
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
import { FamilyContext } from 'context/FamilyContext';
import { RadioButton } from 'primereact/radiobutton';

type PetMemberData = {
    age: number
    name: string
    race: string
    type: any
    remarks: string
    isHipoalergenic?: string
}

interface Props {
  familyData: any,
  closeDialog: () => void,
  petData: any
}

const PetMemberModal:React.FC<Props> = ({ petData, familyData, closeDialog}) => {
  const [petTypesInput, setPetTypesInput] = useState([]);
  const [session, ] = useSession()
  const { getFamily } = useContext(FamilyContext)

  console.log(petData)

  useEffect(() => {
    (async () => {
      const { petTypes } = await GenericsService.getAll(session?.token, ['petTypes'])
      await setPetTypesInput(petTypes)
    })()
    
  }, [session]);

  const formik = useFormik({
    initialValues: {
      age: petData?.age || '',
      name: petData?.name || '',
      race: petData?.race || '',
      type: petData?.type || '',
      remarks: petData?.remarks || '',
      isHipoalergenic: petData?.isHipoalergenic ? "Yes" : 'no'
    },
    validate: (data) => {
      let errors: Partial<PetMemberData> = {}
      if (data.name === '') {
        errors.name= 'Name is required'
      }
      if (data.type === '' ) {
        errors.type= 'Type is required'
      }

      if (data.type === 'Can' && (data.isHipoalergenic === null || data.isHipoalergenic  === undefined || data.isHipoalergenic  === '')) {
        errors.isHipoalergenic = 'Hipoalergenic is required'
      }
      return errors
    },
    onSubmit: (data) => {
      
      const pets = [...familyData.pets]

      if(petData){
        const updatePet = pets.find(pet => pet._id === petData._id)
        let isHipoalergenic = undefined
        if (data.isHipoalergenic && data.isHipoalergenic !== '' && data.isHipoalergenic !== null && data.isHipoalergenic !== undefined){
          isHipoalergenic = data.isHipoalergenic === "Yes" ? true : false
        } 
        pets[pets.indexOf(updatePet)] = {
          ...pets[pets.indexOf(updatePet)],
          ...data,
          isHipoalergenic,
        }
      }else{
        pets.push(data)
      }

      FamiliesService.updatefamily(
        session?.token,
        familyData._id, 
        {
          ...familyData,
          pets,
        }
      )
        .then(() => {
          getFamily()
          formik.resetForm()
          closeDialog()
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
      {
        formik.values.type.name === 'Can'
          ? (
            <InputContainer label="Is Hipoalergenic?">
                <div className="radio_container">
                    <RadioButton
                        value="Yes"
                        name="isHipoalergenic"
                        onChange={formik.handleChange}
                        checked={formik.values.isHipoalergenic === 'Yes'} 
                    />
                    <label htmlFor="yes">Yes</label>
                </div>
                <div className="radio_container">
                    <RadioButton
                        value="No"
                        name="isHipoalergenic"
                        onChange={formik.handleChange}
                        checked={formik.values.isHipoalergenic === 'No'} 
                    />
                    <label htmlFor="no">No</label>
                </div>
            </InputContainer>
          )
          : <></>
      }
      <InputContainer label= "Race">
        <InputText
          id="race"
          name='race'
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
