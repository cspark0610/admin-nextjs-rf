// main tools
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'

// prime components
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'

// bootstrap components
import { Row, Spinner } from 'react-bootstrap'

//styles
import classes from 'styles/Login/page.module.scss'
import { ChangeType, SubmitType } from 'types'

// types
import { FC } from 'react'

export const LoginForm: FC = () => {
  const [data, setData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { push } = useRouter()

  /**
   * handle change data
   */
  const handleChange = (ev: ChangeType) =>
    setData({ ...data, [ev.target.name]: ev.target.value })

  /**
   * handle submit login
   */
  const handleSubmit = async (ev: SubmitType) => {
    ev.preventDefault()
    setLoading(true)
    const res: any = await signIn('Credentials', { ...data, redirect: false })
    if (res.error) setError(res.error)
    else push('/')
    setLoading(false)
  }

  /**
   * loading template
   */
  if (loading) {
    return (
      <div className='preloader_container'>
        <Spinner animation='border' variant='white' />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={classes.login}>
      <h1 className={classes.title}>Welcome to</h1>
      <Image
        priority
        width={90}
        height={90}
        alt='logo redleaf'
        className={classes.logo}
        src='/assets/logo-redleaf.svg'
      />
      <label className={classes.label}>Email</label>
      <InputText
        required
        type='email'
        name='email'
        value={data.email}
        onChange={handleChange}
        className={classes.input}
        placeholder='Example@gmail.com'
      />
      <label className={classes.label}>Password</label>
      <Password
        required
        toggleMask
        name='password'
        feedback={false}
        value={data.password}
        placeholder='********'
        onChange={handleChange}
        inputClassName={classes.input}
      />
      <Row className='mt-5'>
        {error && <p className='text-center'>{error}</p>}
        <Button className={classes.button} type='submit'>
          Login
        </Button>
      </Row>
    </form>
  )
}
