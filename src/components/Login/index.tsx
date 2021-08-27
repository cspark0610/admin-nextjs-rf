import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { signIn, csrfToken } from 'next-auth/client'
import { validateEmail } from 'utils/validations'
//styles
import classes from 'styles/Login/Login.module.scss'
import { ProgressSpinner } from 'primereact/progressspinner'

type LoginData = {
  email: string
  password: string
}

const LoginForm = () => {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (data) => {
      let errors: Partial<LoginData> = {}

      if (data.email === '' || !validateEmail(data.email)) {
        errors.email = 'Invalid email address. E.g. example@email.com'
      }

      if (data.password === '') {
        errors.password = 'Password is required.'
      }

      return errors
    },
    onSubmit: (data) => {
      setLoading(true)

      signIn('credentials', {
        ...data,
        callbackUrl: 'http://localhost:3000/',
      })

      formik.resetForm()
    },
  })

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className='p-error'>{formik.errors[name]}</small>
      )
    )
  }

  useEffect(() => {
    ;(async () => {
      const csrfTokenResponse = await csrfToken()
      setToken(csrfTokenResponse)
    })()
  }, [])

  if (loading) {
    return (
      <div className='preloader_container'>
        <ProgressSpinner />
      </div>
    )
  }

  return (
    <form onSubmit={formik.handleSubmit} className={classes.login}>
      <h1>Welcome to</h1>
      {/* <img src='/assets/logo-redleaf.svg' alt='logo redleaf' />
      <InputContainer
        label='Email'
        labelClass={classNames({ 'p-error': isFormFieldValid('first_name') })}
      >
        <InputText
          id='email'
          type='email'
          placeholder='Email'
          value={formik.values.email}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('email') })}
        />
        {getFormErrorMessage('email')}
      </InputContainer>
      <InputContainer
        label='Password'
        labelClass={classNames({ 'p-error': isFormFieldValid('first_name') })}
      >
        <InputText
          id='password'
          type='password'
          value={formik.values.password}
          placeholder='Password'
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('password') })}
        />
        {getFormErrorMessage('password')}
      </InputContainer>
      <input name='csrfToken' type='hidden' defaultValue={token} />
      <Button type='submit'>Login</Button> */}
    </form>
  )
}

export default LoginForm
