import { useEffect, useMemo, useState } from 'react'
import { InputText } from "primereact/inputtext"
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils';
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Calendar } from 'primereact/calendar';
import {general} from 'utils/calendarRange'
import Map from 'components/UI/Organism/Map';

const CreateGenericForm = props => {
//map settings -------------------------------
  const [dataMarker, setDataMarker] = useState({ lat: 0, lng: 0 })
  const mapOptions = {
    center: {
      lat: dataMarker.lat || 56.12993051334789,
      lng: dataMarker.lng || -106.34406666276075,
    },
    zoom: 10,
  }
  useEffect(() => {
    formik.values['latitude']= dataMarker.lat
    formik.values['longitude']= dataMarker.lng
  }, [dataMarker.lat, dataMarker.lng])
//map settings end ---------------------------

  const handleSubmit = data => {
    props.onSubmit(data)
  }



  const initialValues = useMemo(() => {
    const values = {}
    if(props.fields){
      props.fields.forEach(field => {
        if(props.generic === 'cities' && field.id === 'province'){
          values[field.id] = props.data ? props.data.province._id : ''
        }else{
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
              <>
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
              <InputText 
                    id={field.id}
                    value={dataMarker.lat || formik.values[field.id]} 
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}
                  />
                  {getFormErrorMessage(field.id)}
            </InputContainer>
              </>
            )
          }
          if(props.generic === 'schools' && field.id === 'longitude') {
            return (
              <>
              <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
              <InputText 
                    id={field.id}
                    value={dataMarker.lng || formik.values[field.id]} 
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}
                  />
                  {getFormErrorMessage(field.id)}
            </InputContainer>
                <Map 
                setDataMarker={setDataMarker}
                position={{
                  lat: dataMarker.lat || 56.12993051334789,
                  lng: dataMarker.lng || -106.34406666276075,
                }}
                options={mapOptions}
                />
              </>
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