import { useMemo } from 'react'
import { InputText } from "primereact/inputtext"
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils';
import InputContainer from 'components/UI/Molecules/InputContainer'

const CreateGenericForm = props => {
  const handleSubmit = data => {
    props.onSubmit(data)
  }

  const initialValues = useMemo(() => {
    const values = {}
    if(props.fields){
      props.fields.forEach(field => {
        values[field.id] = props.data ? props.data[field.id] : ''
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
        props.fields.map(field => (
          <InputContainer key={field.id} label={field.label} labelClass={classNames({ 'p-error': isFormFieldValid(field.id) })}>
            <InputText 
                  id={field.id}
                  value={formik.values[field.id]} 
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid(field.id) })}
                />
                {getFormErrorMessage(field.id)}
          </InputContainer>
        ))
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