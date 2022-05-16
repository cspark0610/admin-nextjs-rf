// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Password } from 'primereact/password'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { UserDataType } from 'types/models/User'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type CreateUserProps = {
  data: UserDataType
  dispatch: Dispatch<{
    type: string
    payload: ChangeType | DropdownChangeParams
  }>
}

export const CreateUser: FC<CreateUserProps> = ({ data, dispatch }) => {
  const { label: labels } = useGenerics(['label'])
  const userTypes = [
    { name: 'Family', value: 'FAMILY' },
    { name: 'Super user', value: 'SUPER_USER' },
    { name: 'Local coordinator', value: 'LOCAL_COORDINATOR' },
  ]

  /**
   * handle change user and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'user', payload: ev })

  return (
    <Container fluid className={classes.container}>
      <Row>
        <Col className={classes.col} xs={12} sm={6}>
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
        <Col className={classes.col} xs={12} sm={6}>
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
        <Col className={classes.col} xs={12} sm={6}>
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
        <Col className={classes.col} xs={12} sm={6}>
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
        {data.userType === 'SEARCHER' && (
          <Col className={classes.col} xs={12}>
            <p>Add Labels</p>
            {labels === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <MultiSelect
                name='labels'
                display='chip'
                options={labels}
                optionValue='_id'
                optionLabel='name'
                value={data.labels}
                placeholder='Labels'
                onChange={handleChange}
                className={classes.input}
              />
            )}
          </Col>
        )}
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
      </Row>
    </Container>
  )
}
