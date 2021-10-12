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
  country: string
  city: string
  province: string
  transports: string
  school: string
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
      school: schoolData?.school || schoolsInput.filter(sc => sc.city === familyData.home?.city._id),
      transports: schoolData?.transports || [],
    },
    validate: (data) => {
      let errors: Partial<tenantsData> = {}
      if (data.city === {} || data.city === null )       errors.city = 'city is required'
      if (data.province === {} || data.province === null )   errors.province = 'province is required'
      if (data.school === {} || data.school === null)         errors.school = 'school is required'
      if (data.country.length < 1)    errors.country = 'country is required'
      if (data.transports.length < 1) errors.transports = 'transports is required'
      
      console.log(errors, 'the validation data')
      return errors
    },
    onSubmit: (data) => {
      console.log('enviado el form')
      
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

  const [ filteredCities, setFilteredCities] = useState([])
  const [ filteredSchools, setfilteredSchools] = useState([])
  
  useEffect(() => {
    setFilteredCities(cities.filter(ct => ct.province === formik.values.province._id))
  }, [formik.values.province, cities])

  useEffect(() => {
    if(formik.values.city?._id) {
      setfilteredSchools(schoolsInput.filter(sc => sc.city === formik.values.city._id))
    }
    console.log(formik.values)
  }, [formik.values.city._id, schoolsInput.length])


  useEffect(() => {
    if (schoolData) {
      formik.setFieldValue('country', countries.find(country => country._id === schoolData.school.country[0]))
      formik.setFieldValue('province', provinces.find(province => province._id === schoolData.school.province[0]))
      formik.setFieldValue('city', cities.find(city => city._id === schoolData.school.city[0]))
    }
  }, [schoolData, countries, provinces, cities])


  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        if(isFormFieldValid(name)=== false) return <small className="p-error">{formik.errors[name]}</small>;
    };

    

  return (
    <form onSubmit={formik.handleSubmit} >

      <InputContainer label= "Country" labelClass={classNames({ 'p-error': isFormFieldValid('country') })}>
        <Dropdown
          id="country"
          name='country'
          placeholder="Country"
          options={countries}
          optionLabel="name"
          value={countries.find(ct => ct._id === formik.values.country?._id)}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('country') })}
          required={true}
        />
        {getFormErrorMessage('country')}
      </InputContainer>

      <InputContainer label= "Province" labelClass={classNames({ 'p-error': isFormFieldValid('province') })}>
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
          required={true}
        />
        {getFormErrorMessage('province')}
      </InputContainer>
      <InputContainer label= "City" labelClass={classNames({ 'p-error': isFormFieldValid('city') })}>
        <Dropdown
          id="city"
          name='city'
          placeholder="City"
          options={filteredCities}
          optionLabel="name"
          value={cities.find(ct => ct._id === formik.values.city?._id)}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('city') })}
          required={true}
        />
        {getFormErrorMessage('city')}
      </InputContainer>




      <InputContainer label= "School" labelClass={classNames({ 'p-error': isFormFieldValid('school') })}>
        <Dropdown
          required={true}
          id="school"
          name='school'
          placeholder="School"
          options={filteredSchools}
          optionLabel="name"
          value={schoolsInput.find(school => school._id === formik.values.school?._id)}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('school') })}
        />
        {getFormErrorMessage('school')}
        {filteredSchools.length < 1 ? 
         !!formik.values?.city === false ? <small className="p-error">No city selected</small> : 
        <small className="p-error">{formik.values?.city?.name} don't have registered schools</small> :
          null}
      </InputContainer>
      <InputContainer label= "Transports" labelClass={classNames({ 'p-error': isFormFieldValid('transports') })}>
        <MultiSelect
          className={classNames({ 'p-invalid': isFormFieldValid('transports') })}
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
