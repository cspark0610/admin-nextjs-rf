// main tools
import dayjs from 'dayjs'

// bootstrap components
import { Button, Col, Row, Spinner } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { ExternalStudentDataType } from 'types/models/Family'
import { FC, Dispatch, ChangeEvent } from 'react'
import { ChangeType } from 'types'

interface PetsDataParams {
  data: ExternalStudentDataType
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

export const ExternalStudentsData: FC<PetsDataParams> = ({
  idx,
  data,
  dispatch,
  handleSave,
}) => {
  const {
    loading,
    gender: genders,
    nationality: nationalities,
  } = useGenerics(['gender', 'nationality'])

  /**
   * handle change user and dispatch data
   */
  const handleStudentsChange = (
    ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => dispatch({ type: 'handleStudentChange', payload: { ev, idx } })

  /**
   * format Date
   */
  const formatDate = (date: string | Date | undefined) =>
    typeof date === 'string' ? new Date(date) : date

  return (
    <>
      <Row xs='auto' className='mb-3 justify-content-center'>
        <PencilSquare size={28} />
        <h4>External students</h4>
      </Row>
      <Row className={classes.container} key={idx}>
        <Col className={classes.col} xs={12} md={6}>
          <p>Name</p>
          <InputText
            name='name'
            value={data.name}
            placeholder='Name'
            className={classes.input}
            onChange={(ev) => handleStudentsChange(ev, idx)}
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Gender</p>
          {loading === undefined ? (
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
              onChange={(ev) => handleStudentsChange(ev, idx)}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Nationality</p>
          {loading === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              filter
              showClear
              appendTo='self'
              optionLabel='name'
              name='nationality'
              placeholder='Select'
              options={nationalities}
              value={data.nationality}
              className={classes.input}
              onChange={(ev) => handleStudentsChange(ev, idx)}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>D.O.B</p>
          <Calendar
            yearNavigator
            appendTo='self'
            name='birthDate'
            className='w-100'
            maxDate={dayjs().toDate()}
            inputClassName={classes.input}
            value={formatDate(data.birthDate)}
            onChange={(ev) => handleStudentsChange(ev, idx)}
            yearRange={`${dayjs()
              .subtract(100, 'years')
              .year()}:${dayjs().year()}`}
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Staying since</p>
          <Calendar
            yearNavigator
            appendTo='self'
            className='w-100'
            name='stayingSince'
            maxDate={dayjs().toDate()}
            inputClassName={classes.input}
            value={formatDate(data.stayingSince)}
            onChange={(ev) => handleStudentsChange(ev, idx)}
            minDate={dayjs(data.birthDate).add(4, 'years').toDate()}
            yearRange={`${dayjs(data.birthDate)
              .add(4, 'years')
              .year()}:${dayjs().year()}`}
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Staying until</p>
          <Calendar
            yearNavigator
            appendTo='self'
            className='w-100'
            name='stayingUntil'
            inputClassName={classes.input}
            value={formatDate(data.stayingUntil)}
            minDate={dayjs(data.stayingSince).toDate()}
            onChange={(ev) => handleStudentsChange(ev, idx)}
            maxDate={dayjs(data.stayingSince).add(10, 'years').toDate()}
            yearRange={`${dayjs(data.stayingSince).year()}:${dayjs()
              .add(10, 'years')
              .year()}`}
          />
        </Col>
        <Col>
          <Button className={classes.button} onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Row>
    </>
  )
}
