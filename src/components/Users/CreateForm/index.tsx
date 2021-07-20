import { useState } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { classNames } from 'primereact/utils';
import UsersService from 'services/Users'

type CreateData = {
  first_name: string
  last_name: string
  email: string
  password: string
}

const CreateUserForm = props => {
  const handleSubmit = data => {
    if (props.context === 'UPDATE') {
      delete data.email
      delete data.password
    }

    props.onSubmit(data)
  }

  const formik = useFormik({
    initialValues: {
      first_name: props.data?.first_name || '',
      last_name: props.data?.last_name || '',
      email: props.data?.email || '',
      password: props.data?.password || '',
    },
    validate: (data) => {
        let errors: Partial<CreateData>  = {}

        if (data.first_name === '') {
            errors.first_name = 'Name is required.'
        }

        if (data.last_name === '') {
            errors.last_name = 'Last name is required.'
        }
        
        if (data.email === '') {
            errors.email = 'Invalid email address. E.g. example@email.com'
        }

        if (data.password === '') {
            errors.password = 'Password is required.'
        }

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
      <div className="p-field" style={{ marginBottom: 25 }}>
        <span className="p-float-label">
          <InputText 
            id="first_name"
            value={formik.values.first_name} 
            onChange={formik.handleChange}
            className={classNames({ 'p-invalid': isFormFieldValid('first_name') })}
          />
          <label htmlFor="first_name" className={classNames({ 'p-error': isFormFieldValid('first_name') })}>Name*</label>
        </span>
        {getFormErrorMessage('first_name')}
      </div>
      <div className="p-field" style={{ marginBottom: 25 }}>
        <span className="p-float-label">
          <InputText
            id="last_name"
            value={formik.values.last_name} 
            onChange={formik.handleChange}
            className={classNames({ 'p-invalid': isFormFieldValid('last_name') })}
          />
          <label htmlFor="last_name" className={classNames({ 'p-error': isFormFieldValid('last_name') })}>Last Name*</label>
        </span>
        {getFormErrorMessage('last_name')}
      </div>
      {
        props.context === "NEW" && (
          <div className="p-field" style={{ marginBottom: 25 }}>
            <span className="p-float-label">
              <InputText 
                id="email"
                type="email"
                value={formik.values.email} 
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldValid('email') })}
              />
              <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email*</label>
            </span>
            {getFormErrorMessage('email')}
          </div>
        )
      }
      {
        props.context === 'NEW' && (
          <div className="p-field" style={{ marginBottom: 25 }}>
            <span className="p-float-label">
              <InputText
                id="password"
                type='password'
                value={formik.values.password} 
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldValid('password') })}
              />
              <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Password*</label>
            </span>
            {getFormErrorMessage('password')}
          </div>
        )
      }
      {/* <InputContainer label='Type of User'>
        <InputText 
          placeholder="Type of User" 
          value={state.first_name} 
          onChange={({ target }) => setState({ ...state, type_of_user: target.value })}
        />
      </InputContainer> */}
      <Button
        type='submit'
      >
        Save
      </Button>
    </form>
  )
}

export default CreateUserForm