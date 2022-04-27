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

type UpdateUserProps = {
  setShowEdit: SetStateType<boolean>
  setError: SetStateType<string>
  userData: UserDataType
}

export const UpdateUser: FC<UpdateUserProps> = ({
  setShowEdit,
  setError,
  userData,
}) => {
  const [data, setData] = useState<UserDataType>(userData)
  const { data: session } = useSession()

  const userTypes = [
    { name: 'Super user', value: 'SUPER_USER' },
    { name: 'Family', value: 'FAMILY' },
    { name: 'Local coordinator', value: 'LOCAL_COORDINATOR' },
  ]

  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    setData({ ...data, [ev.target.name]: ev.target.value })

  const handleSubmit = async (ev: SubmitType) => {
    ev.preventDefault()

    const { response } = await UsersService.updateUser(
      session?.token as string,
      data._id as string,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType,
        password: data.password,
      }
    )
    if (!response) setShowEdit(false)
    else setError(response.data?.message)
  }

  return (
    <Container fluid className={classes.container}>
      <Row className='mb-5'>
        <Col xs={3}>
          <Button className={classes.button} onClick={() => setShowEdit(false)}>
            <ArrowLeft /> Volver
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
            <p className={`p-2 ${classes.input}`}>{data.email}</p>
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
            <p>Add new password</p>
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
