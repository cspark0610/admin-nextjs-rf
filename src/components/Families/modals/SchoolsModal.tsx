import React,{ useContext, useEffect, useMemo, useState } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
//import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
//import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils'
import { useFormik } from 'formik'
//services
import GenericsService from 'services/Generics';
import { useSession } from 'next-auth/client';
//Api
import FamiliesService from 'services/Families'
import { FamilyContext } from 'context/FamilyContext';
//utils
//import {general} from 'utils/calendarRange'
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
  const [cities, setCities] = useState([])
  const [provinces, setProvinces] = useState([])
  const [countries, setCountries] = useState([])
  const [session, ] = useSession()
  const { getFamily } = useContext(FamilyContext)
  useEffect(() => {
    (async () => {
      const { schools,
              transports,
              cities,
              provinces,
            countries } = await GenericsService.getAll(session?.token, ['schools', 'transports','cities',
      'provinces','countries'])
      setSchoolsInput(schools)
      setTransportsInput(transports)
      setCities(cities)
      setProvinces(provinces)
      setCountries(countries)
    })()
  }, [session]);

  const formik = useFormik({
    initialValues: {
      country: familyData.home?.country || {},
      province: familyData.home?.province || {},
      city: familyData.home?.city || {},
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

  const [
    filteredCities, 
    setFilteredCities] = useState([])
  const [
    filteredSchools, 
    setfilteredSchools] = useState([])
  
  useEffect(() => {
    setFilteredCities(cities.filter(ct => ct.province === formik.values.province._id))
  }, [formik.values.province])

  useEffect(() => {
    if(formik.values.city)
      setfilteredSchools(schoolsInput.filter(sc => sc.city[0] === formik.values.city._id))
  }, [formik.values.city])

  useEffect(() => {
    if (schoolData) {
      formik.setFieldValue('country', countries.find(country => country._id === schoolData.school.country[0]))
      formik.setFieldValue('province', provinces.find(province => province._id === schoolData.school.province[0]))
      formik.setFieldValue('city', cities.find(city => city._id === schoolData.school.city[0]))
    }
  }, [schoolData, countries, provinces, cities])


  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

  return (
    <form onSubmit={formik.handleSubmit}  >

      <InputContainer label= "Country" labelClass={classNames({ 'p-error': isFormFieldValid('school') })}>
        <Dropdown
          id="country"
          name='country'
          placeholder="Country"
          options={countries}
          optionLabel="name"
          value={countries.find(ct => ct._id === formik.values.country?._id)}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('country') })}
        />
        {getFormErrorMessage('transports')}
      </InputContainer>

      <InputContainer label= "Province" labelClass={classNames({ 'p-error': isFormFieldValid('school') })}>
        <Dropdown
          id="province"
          name='province'
          placeholder="Province"
          options={provinces}
          optionLabel="name"
          value={provinces.find(ct => ct._id === formik.values.province?._id)}
          onChange={({ value }) => {
            formik.setFieldValue('province', value)
            formik.setFieldValue('city', null)
          }}
          className={classNames({ 'p-invalid': isFormFieldValid('province') })}
        />
        {getFormErrorMessage('transports')}
      </InputContainer>
      <InputContainer label= "City" labelClass={classNames({ 'p-error': isFormFieldValid('school') })}>
        <Dropdown
          id="city"
          name='city'
          placeholder="City"
          options={filteredCities}
          optionLabel="name"
          value={cities.find(ct => ct._id === formik.values.city?._id)}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('city') })}
        />
        {getFormErrorMessage('transports')}
      </InputContainer>




      <InputContainer label= "School" labelClass={classNames({ 'p-error': isFormFieldValid('school') })}>
        <Dropdown
          id="school"
          name='school'
          placeholder="School"
          options={filteredSchools}
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
