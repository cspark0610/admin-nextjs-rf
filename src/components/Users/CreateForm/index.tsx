import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils';
import InputContainer from 'components/UI/Molecules/InputContainer'

type CreateData = {
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPass: string
  userType: string
}

const userTypeOptions = ['Family', 'Student', 'Staff', 'Searcher', 'Reader', 'SuperUser']

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
      confirmPass: props.data?.confirmPass || '',
      userType: props.data?.userType || '',
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

        if (data.password === '' && props.context !== 'UPDATE') {
            errors.password = 'Password is required.'
        }

        if(data.confirmPass !== data.password){
            errors.confirmPass = 'The passwords do not match.'
        }

        if (data.userType === '') {
          errors.userType = 'userType is required.'
        }

        return errors
    },
    onSubmit: (data) => {
      console.log(data)
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
      <InputContainer label="First Name" labelClass={classNames({ 'p-error': isFormFieldValid('first_name') })}>
        <InputText 
              id="first_name"
              value={formik.values.first_name} 
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldValid('first_name') })}
            />
            {getFormErrorMessage('first_name')}
      </InputContainer>
        
        <InputContainer label="Last Name" labelClass={classNames({ 'p-error': isFormFieldValid('last_name') })}>
          <InputText
              id="last_name"
              value={formik.values.last_name} 
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldValid('last_name') })}
            />
          {getFormErrorMessage('last_name')}
        </InputContainer>
        
        <InputContainer label='email' labelClass={classNames({ 'p-error': isFormFieldValid('email') })}>
          <InputText 
            disabled={props.context === 'UPDATE'}  
            id="email"
            type="email"
            value={formik.values.email} 
            onChange={formik.handleChange}
            className={classNames({ 'p-invalid': isFormFieldValid('email') })}
          />
          {getFormErrorMessage('email')}
        </InputContainer>
      {
        props.context === 'NEW' && (
         <> 
         <InputContainer label='Password' labelClass={classNames({ 'p-error': isFormFieldValid('password') })}>
            <InputText
                  id="password"
                  type='password'
                  value={formik.values.password} 
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid('password') })}
                />
              {getFormErrorMessage('password')}
          </InputContainer>
         <InputContainer label='Repeat password' labelClass={classNames({ 'p-error': isFormFieldValid('confirmPass') })}>
            <InputText
                  id="confirmPass"
                  type='password'
                  value={formik.values.confirmPass} 
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid('confirmPass') })}
                />
              {getFormErrorMessage('confirmPass')}
          </InputContainer>
        </>   
        )
      }
      <InputContainer label='Type of User'>
        <Dropdown
          id="userType"
          options={userTypeOptions}
          placeholder="Type of User"
          value={formik.values.userType}
          onChange={formik.handleChange}
        />
      </InputContainer>
      <div style={{display: 'flex', justifyContent: "flex-end", alignItems: "center"}}>
        <Button type='submit'>
          Save
        </Button>
      </div>
      
    </form>
  )
}

export default CreateUserForm