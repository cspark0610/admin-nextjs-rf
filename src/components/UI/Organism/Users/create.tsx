// main tools
import { useSession } from 'next-auth/react'
import { useState } from 'react'

// bootstrap components
import { Container, Row, Col, Button } from 'react-bootstrap'
import { ArrowLeft } from 'react-bootstrap-icons'

// prime components
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Password } from 'primereact/password'

//services
import { UsersService } from 'services/Users'

// styles
import classes from 'styles/Users/page.module.scss'

// types
import { ChangeType, SetStateType, SubmitType } from 'types'
import { DropdownChangeParams } from 'primereact/dropdown'
import { UserDataType } from 'types/models/User'
import { FC } from 'react'

type CreateUserProps = {
  setShowCreate: SetStateType<boolean>
  setError: SetStateType<string>
}

export const CreateUser: FC<CreateUserProps> = ({
  setShowCreate,
  setError,
}) => {
  const { data: session } = useSession()
  const [data, setData] = useState<UserDataType & { confirmPassword: string }>({
    email: '',
    lastName: '',
    password: '',
    firstName: '',
    userType: null,
    confirmPassword: '',
  })

  const userTypes = [
    { name: 'Super user', value: 'SUPER_USER' },
    { name: 'Family', value: 'FAMILY' },
    { name: 'Local coordinator', value: 'LOCAL_COORDINATOR' },
  ]

  /**
   * handle user data changes
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    setData({ ...data, [ev.target.name]: ev.target.value })

  /**
   * handle submit for create user
   */
  const handleSubmit = async (ev: SubmitType) => {
    ev.preventDefault()

    if (data.password === data.confirmPassword) {
      const { response } = await UsersService.createUser(
        session?.token as string,
        data
      )
      if (!response) setShowCreate(false)
      else setError(response.data?.message)
    } else setError("Password and confirm password aren't equals")
  }

  return (
    <Container fluid className={classes.container}>
      <Row className='mb-5'>
        <Col xs={3}>
          <Button
            className={classes.button_back}
            onClick={() => setShowCreate(false)}
          >
            <ArrowLeft /> Back
          </Button>
        </Col>
      </Row>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col className={classes.col} xs={6}>
            <p>First name</p>
            <InputText
              required
              name='firstName'
              value={data.firstName}
              onChange={handleChange}
              placeholder='first name'
              className={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={6}>
            <p>Last name</p>
            <InputText
              required
              name='lastName'
              value={data.lastName}
              onChange={handleChange}
              placeholder='last name'
              className={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={6}>
            <p>Email</p>
            <InputText
              required
              type='email'
              name='email'
              value={data.email}
              placeholder='Email'
              onChange={handleChange}
              className={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={6}>
            <p>User type</p>
            <Dropdown
              name='userType'
              optionLabel='name'
              optionValue='value'
              options={userTypes}
              value={data.userType}
              onChange={handleChange}
              className={classes.input}
              placeholder='Choose user type'
            />
          </Col>
          <Col className={classes.col} xs={12}>
            <p>Password</p>
            <Password
              required
              toggleMask
              name='password'
              className='w-100'
              value={data.password}
              placeholder='********'
              onChange={handleChange}
              inputClassName={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={12}>
            <p>Confirm password</p>
            <Password
              required
              toggleMask
              feedback={false}
              className='w-100'
              name='confirmPassword'
              placeholder='********'
              onChange={handleChange}
              value={data.confirmPassword}
              inputClassName={classes.input}
            />
          </Col>
          <Col xs={3}>
            <Button type='submit' className={classes.button}>
              Save
            </Button>
          </Col>
        </Row>
      </form>
    </Container>
  )
}
