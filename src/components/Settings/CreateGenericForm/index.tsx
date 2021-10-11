import { useEffect, useMemo, useState } from 'react'
import { InputText } from "primereact/inputtext"
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils';
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Calendar } from 'primereact/calendar';
import {general} from 'utils/calendarRange'
import Map from 'components/UI/Organism/Map';
import { MultiSelect } from 'primereact/multiselect'


const CreateGenericForm = props => {
  console.log('props', props)
//map settings -------------------------------
  const [dataMarker, setDataMarker] = useState({
    lat: props.data?.location.latitude || 0,
    lng: props.data?.location.longitude || 0
  })
  const [selectedCourses, setSelectedCourses] = useState([])
  const mapOptions = {
    center: {
      lat: dataMarker.lat || 56.12993051334789,
      lng: dataMarker.lng || -106.34406666276075,
    },
    zoom: 5,
  }
  useEffect(() => {
    formik.setFieldValue('latitude', dataMarker.lat)
    formik.setFieldValue('longitude', dataMarker.lng)
  }, [dataMarker.lat, dataMarker.lng])
  useEffect(() => {
    let coursesArr = []
    selectedCourses.map(cs => {coursesArr.push(cs._id)})
    formik.setFieldValue('courses', coursesArr)
  }, [selectedCourses.length])
//map settings end ---------------------------

  const handleSubmit = data => {
    props.onSubmit(data)
  } 

  const initialValues = useMemo(() => {
    const values: any = {}
    if(props.fields){
      props.fields.forEach(field => {
        if(props.generic === 'cities' && field.id === 'province'){
          values[field.id] = props.data ? props.data.province._id : ''
        } else if(props.generic === 'schools' && ['country', 'province', 'city'].includes(field.id)){
          values[field.id] = props.data ? props.data[field.id]._id : ''
        }else if(props.generic === 'schools' && field.id === 'courses'){
          let sc = []
          props.data?.courses.forEach(cs => {
            sc.push(props.academicCourses.filter(ac => ac._id === cs._id)[0])
          })
          setSelectedCourses([...selectedCourses, ...sc])
          //setSelectedCourses()
          values[field.id] = props.data ? props.data.courses.map(course => course._id) : ''
        } else {
          values[field.id] = props.data ? props.data[field.id] : ''
        }
      })
    }
    return values
  }, [props])

  const formik = useFormik({
    initialValues: initialValues,
    validate: (data) => {
        let errors: any  = {}

        props.fields.forEach(field => {
          if(data[field.id] === ''){
            errors[field.id] = `${field.label} is required`
          }
        })

        return errors
    },
    onSubmit: (data) => {
      handleSubmit(data)
      formik.resetForm()
    }
  })

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {
        props.fields.map(field => {
          if(props.generic === 'cities' && field.id === 'province'){
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                <select
                  id={field.id}
                  value={formik.values[field.id]}
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}                  
                >
                  <option value=''></option>
                  {
                    props.provinces.map(province => <option key={province._id} value={province._id}>{ province.name }</option>)
                  }
                </select>
                {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }

          if(field.id === 'date'){
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                <Calendar 
                    placeholder='Date of verification'
                    value={new Date(formik.values[field.id])}
                    onChange={e => formik.setFieldValue(field.id, e.value)} 
                    showButtonBar 
                    showIcon
                    monthNavigator
                    yearNavigator
                    yearRange={general}
                />
                {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }
          if(props.generic === 'schools' && field.id === 'latitude') {
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
              <InputText 
                    // type="hidden"
                    id={field.id}
                    value={formik.values[field.id]} 
                    onChange={(ev) => {
                      formik.handleChange(ev)
                      setDataMarker((prevValue) => ({
                        ...prevValue,
                        lat: parseInt(ev.target.value)
                      }))
                    }}
                    className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}
                  />
                  {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }
          if(props.generic === 'schools' && field.id === 'longitude') {
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
              <InputText 
              // type="hidden"
                    id={field.id}
                    value={formik.values[field.id]} 
                    onChange={(ev) => {
                      formik.handleChange(ev)
                      setDataMarker((prevValue) => ({
                        ...prevValue,
                        lng: parseInt(ev.target.value)
                      }))
                    }}
                    className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}
                  />
                  {getFormErrorMessage(field.id)}
              <InputContainer key={field.id} label="Location" labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                <Map 
                setDataMarker={setDataMarker}
                position={{
                  lat: dataMarker.lat || 56.12993051334789,
                  lng: dataMarker.lng || -106.34406666276075,
                }}
                options={mapOptions}
                iconType='school'
                />
            </InputContainer>
              </InputContainer>
            )
          }
          if(props.generic === 'schools' && field.id === 'country'){
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                <select
                  id={field.id}
                  value={formik.values[field.id]}
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}
                  style={{padding:'10px 8px', borderColor: 'rgb(206, 212, 218)', lineHeight: '21px', borderRadius: '4px'}}            
                >
                  <option value=""></option>
                  {
                    props.countries?.map(province => <option key={province._id} value={province._id}>{ province.name }</option>)
                  }
                </select>
                {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }
          if(props.generic === 'schools' && field.id === 'province'){
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                <select
                  id={field.id}
                  value={formik.values[field.id]}
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}    
                  style={{padding:'10px 8px', borderColor: 'rgb(206, 212, 218)', lineHeight: '21px', borderRadius: '4px'}}              
                >
                  <option value=""></option>
                  {
                    props.provinces.map(province => <option key={province._id} value={province._id}>{ province.name }</option>)
                  }
                </select>
                {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }
          if(props.generic === 'schools' && field.id === 'city'){
            const filteredCities = props.cities?.filter(ct => ct.province === formik.values['province'])
            
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                <select
                  id={field.id}
                  value={formik.values[field.id]}
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}                  
                  style={{padding:'10px 8px', borderColor: 'rgb(206, 212, 218)', lineHeight: '21px', borderRadius: '4px'}}
                >
                  <option value=""></option>
                  {
                    filteredCities?.map(province => <option key={province._id} value={province._id}>{ province.name }</option>)
                  }
                </select>
                {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }
          if(props.generic === 'schools' && field.id === 'courses'){
                        
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                
                <MultiSelect value={selectedCourses} options={props?.academicCourses} 
                onChange={(e) => setSelectedCourses(e.value)} optionLabel="name" 
                placeholder="Select available courses" />
                {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }
          if(props.generic === 'schools' && field.id === 'type'){
                        
            return (
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
                <select
                  id={field.id}
                  value={formik.values[field.id]}
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}                  
                  style={{padding:'10px 8px', borderColor: 'rgb(206, 212, 218)', lineHeight: '21px', borderRadius: '4px'}}
                >
                  <option value=""></option>
                  {
                    ['Elementary School', 'High School'].map(type => <option key={type} value={type}>{ type }</option>)
                  }
                </select>
                {getFormErrorMessage(field.id)}
              </InputContainer>
            )
          }
         
            

          return (
            <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
              <InputText 
                    id={field.id}
                    value={formik.values[field.id]} 
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}
                  />
                  {getFormErrorMessage(field.id)}
            </InputContainer>
          )
        })
      }      
      <div style={{display: 'flex', justifyContent: "flex-end", alignItems: "center"}}>
        <Button type='submit'>
          Save
        </Button>
      </div>
      
    </form>
  )
}

export default CreateGenericForm