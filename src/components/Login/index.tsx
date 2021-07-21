import { useFormik } from 'formik'
import { InputText } from "primereact/inputtext"
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils';
import InputContainer from 'components/UI/Molecules/InputContainer'
//styles
import classes from 'styles/Login/Login.module.scss'
//services
import AuthService from 'services/Auth'

type LoginData = {
  email: string
  password: string
}

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validate: (data) => {
        let errors: Partial<LoginData>  = {}

        if (data.email === '') {
            errors.email = 'Invalid email address. E.g. example@email.com'
        }

        if (data.password === '') {
            errors.password = 'Password is required.'
        }

        return errors
    },
    onSubmit: (data) => {

        // AuthService.login(data)
        //   .then(response => console.log(response))
        //   .catch(error => console.error(error))

        formik.resetForm()
    }
  })

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  return (
    <form onSubmit={formik.handleSubmit} className={classes.login}> 
      <h1>Welcome to</h1>
      <img src="/assets/logo-redleaf.svg" alt="logo redleaf" />
      <InputContainer label="Email" labelClass={classNames({ 'p-error': isFormFieldValid('first_name') })}>
        <InputText 
          id="email"
          value={formik.values.email} 
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('email') })}
        />
        {getFormErrorMessage('email')}
      </InputContainer>
      <InputContainer label="Password" labelClass={classNames({ 'p-error': isFormFieldValid('first_name') })}>
        <InputText 
          id="password"
          value={formik.values.password} 
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('password') })}
        />
        {getFormErrorMessage('password')}
      </InputContainer>
      <Button type='submit'>
        Login
      </Button>
    </form>
  )
}

export default LoginForm