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
import { MultiSelect } from 'primereact/multiselect';

type tenantsData = {
  name: string
  type: string
  latitude: string
  longitude: string
  courses: string
}

interface Props {
  familyData: any,
  closeDialog: () => void
  schoolData: any
}

const SchoolsModal: React.FC<Props> = ({ schoolData, familyData, closeDialog}) => {
  const [schoolsInput, setSchoolsInput] = useState([])
  const [transportsInput, setTransportsInput] = useState([])
  const [session, ] = useSession()
  const { getFamily } = useContext(FamilyContext)

  useEffect(() => {
    (async () => {
      const { schools, transports } = await GenericsService.getAll(session?.token, ['schools', 'transports'])
      setSchoolsInput(schools)
      setTransportsInput(transports)
    })()
  }, [session]);

  const formik = useFormik({
    initialValues: {
      school: schoolData?.school || {},
      transports: schoolData?.transports || [],
    },
    validate: (data) => {
      let errors: Partial<tenantsData> = {}
     
      return errors
    },
    onSubmit: (data) => {

      const schools = [...familyData.schools]

      if(schoolData){
        const updateSchool = schools.find(school => school.school._id === schoolData.school._id)
        schools[schools.indexOf(updateSchool)] = {
          ...schools[schools.indexOf(updateSchool)],
          ...data
        }
      }else{
        schools.push(data)
      }
      FamiliesService.updatefamily(session?.token, familyData._id, {...familyData, schools})
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
      <InputContainer label= "School" labelClass={classNames({ 'p-error': isFormFieldValid('school') })}>
        <Dropdown
          id="school"
          name='school'
          placeholder="School"
          options={schoolsInput}
          optionLabel="name"
          value={schoolsInput.find(school => school._id === formik.values.school?._id)}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('school') })}
        />
        {getFormErrorMessage('transports')}
      </InputContainer>
      <InputContainer label= "Transports" labelClass={classNames({ 'p-error': isFormFieldValid('transports') })}>
        <MultiSelect
          name="transports"
          value={formik.values.transports}
          options={transportsInput}
          onChange={formik.handleChange}
          optionLabel="name"
          placeholder="Select transports"
          selectedItemTemplate={item => item ? `${item?.name}, ` : ''}
        />
        {getFormErrorMessage('transports')}
      </InputContainer>
      <Button type="submit">Save</Button>
    </form>
  );
}

export default SchoolsModal;