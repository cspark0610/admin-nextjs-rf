// main tools
import dayjs from 'dayjs'

// bootstrap components
import { Button, Col, Row, Spinner } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Divider } from 'primereact/divider'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { TenantDataType } from 'types/models/Family'
import { FC, Dispatch, ChangeEvent } from 'react'
import { ChangeType } from 'types'

interface TenantsDataParams {
  data: TenantDataType
  handleSave: () => void
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>
      idx?: number
    }
    type: string
  }>
  idx: number
}

export const TenantsData: FC<TenantsDataParams> = ({
  idx,
  data,
  dispatch,
  handleSave,
}) => {
  const {
    loading,
    gender: genders,
    occupation: occupations,
  } = useGenerics(['gender', 'occupation'])

  /**
   * handle change tenants and dispatch data
   */
  const handleTenantChange = (
    ev: ChangeType | DropdownChangeParams,
    idx: number
  ) => dispatch({ type: 'handleTenantsChange', payload: { ev, idx } })

  /**
   * format Date
   */
  const formatDate = (date: string | Date | undefined) =>
    typeof date === 'string' ? new Date(date) : date

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Row className={classes.container} key={idx}>
          <Divider />
          <Col className={classes.col} xs={12} md={6}>
            <p>First mame</p>
            <InputText
              name='firstName'
              value={data.firstName}
              placeholder='First name'
              className={classes.input}
              onChange={(ev) => handleTenantChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>Last name</p>
            <InputText
              name='lastName'
              value={data.lastName}
              placeholder='Last name'
              className={classes.input}
              onChange={(ev) => handleTenantChange(ev, idx)}
            />
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>Gender</p>
            {genders === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                name='gender'
                appendTo='self'
                options={genders}
                optionLabel='name'
                value={data.gender}
                placeholder='Select'
                className={classes.input}
                onChange={(ev) => handleTenantChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>Birthdate</p>
            <Calendar
              yearNavigator
              appendTo='self'
              name='birthDate'
              className='w-100'
              maxDate={dayjs().toDate()}
              inputClassName={classes.input}
              value={formatDate(data.birthDate)}
              onChange={(ev) => handleTenantChange(ev, idx)}
              yearRange={`${dayjs()
                .subtract(100, 'years')
                .year()}:${dayjs().year()}`}
            />
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>Occupation</p>
            {occupations === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                appendTo='self'
                name='occupation'
                optionLabel='name'
                placeholder='Select'
                options={occupations}
                value={data.occupation}
                className={classes.input}
                onChange={(ev) => handleTenantChange(ev, idx)}
              />
            )}
          </Col>
          <Col xs={12}>
            <Button className={classes.button} onClick={handleSave}>
              Save
            </Button>
          </Col>
        </Row>
      )}
    </>
  )
}
