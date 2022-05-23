// main tools
import { useState, useEffect, ChangeEvent, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// components
import { InputObservations } from '@atoms/Inputobservations'
import { EditFollowUpActionsTab } from './followUpActions'
import { EditWorkshopsTab } from './workshops'

// prime components
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast'

// services
import { ObservationsService } from 'services/InternalObservations'
import { UsersService } from 'services/Users'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { RadioButtonChangeParams } from 'primereact/radiobutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { CalendarChangeParams } from 'primereact/calendar'
import { GenericDataType } from 'types/models/Generic'
import { FamilyDataType } from 'types/models/Family'
import { UserDataType } from 'types/models/User'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type UpdateActivityProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev:
            | ChangeType
            | CalendarChangeParams
            | RadioButtonChangeParams
            | DropdownChangeParams
            | ChangeEvent<HTMLTextAreaElement>
          idx?: number
        }
      | { name: string; value: GenericDataType[] }
      | MultiSelectChangeParams
      | string[]
      | number
      | File
      | null
    type: string
  }>
}

export const UpdateActivity: FC<UpdateActivityProps> = ({ data, dispatch }) => {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState(undefined)
  const [userData, setUserData] = useState<
    UserDataType | undefined | null | string
  >(undefined)
  const [observations, setObservations] = useState<
    GenericDataType[] | undefined
  >(undefined)
  const toast = useRef<Toast>(null)

  /**
   * format user data for dropdown
   */
  const formatUser = (user: UserDataType | string) =>
    typeof user === 'string' ? user : user._id

  /**
   * handle change user and dispatch data
   */
  const handleChange = (ev: DropdownChangeParams) =>
    dispatch({ type: 'familyInfo', payload: { ev } })

  /**
   * handle change user and dispatch data
   */
  const handleInternalDataChange = (ev: DropdownChangeParams) =>
    dispatch({ type: 'handleInternalDataChange', payload: ev })

  const handleObservationsChange = async (ev: MultiSelectChangeParams) => {
    const { response } = await ObservationsService.createObservations(
      session?.token as string,
      data._id as string,
      { content: ev.target.value[0].name }
    )

    if (!response) {
      toast.current?.show({
        severity: 'success',
        summary: 'Internal Observations succesfully',
      })
      getObservations()
    } else
      toast.current?.show({
        severity: 'error',
        summary: response?.data?.message,
      })
  }

  /**
   * handle remove Observations
   */
  const handleRemoveObservations = async (id: string) => {
    await ObservationsService.deleteObservations(
      session?.token as string,
      data._id as string,
      id
    )
    getObservations()
  }

  /**
   * handle get all Observations
   */
  const getObservations = useCallback(async () => {
    const ObservationsDataRes = await ObservationsService.getObservations(
      session?.token as string,
      data._id as string
    )
    if (!ObservationsDataRes.response) setObservations(ObservationsDataRes.data)
  }, [data._id, session?.token])

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const usersRes = await UsersService.getUsers(session.token as string)

        setUsers(usersRes.data)
      })()
    }
  }, [status, session, data.user])

  useEffect(() => {
    setUserData(undefined)
    if (status === 'authenticated') {
      if (data.user) {
        ;(async () => {
          const userDataRes = await UsersService.getUser(
            session.token as string,
            (data.user?._id as string) || (data.user as string)
          )
          if (userDataRes.response) setUserData('User not found')
          else setUserData(userDataRes.data)
        })()
      } else setUserData(null)
    }
  }, [status, session, data.user])

  useEffect(() => {
    setObservations(undefined)
    if (status === 'authenticated') {
      getObservations()
    }
  }, [status, getObservations])

  return (
    <Container fluid className={classes.container}>
      <h2 className={classes.subtitle}>Activities</h2>
      <Row className='justify-content-center'>
        <Col className={classes.col} xs={12} md={4}>
          <p>Asociated user</p>
          {users === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              filter
              showClear
              name='user'
              options={users}
              optionValue='_id'
              optionLabel='email'
              onChange={handleChange}
              placeholder='Select user'
              className={classes.input}
              value={formatUser(data?.user as UserDataType)}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={4}>
          <p>Last update</p>
          {userData === undefined ? (
            <Spinner animation='grow' />
          ) : userData !== null && typeof userData !== 'string' ? (
            <p className={`p-2 ${classes.input}`}>
              {dayjs(userData?.updatedAt as string).format('DD/MM/YYYY')}
            </p>
          ) : (
            <p>
              {typeof userData === 'string' ? userData : 'Not user selected'}
            </p>
          )}
        </Col>
        <Col className={classes.col} xs={12} md={4}>
          <p>Date of registration in the system</p>
          {userData === undefined ? (
            <Spinner animation='grow' />
          ) : userData !== null && typeof userData !== 'string' ? (
            <p className={`p-2 ${classes.input}`}>
              {dayjs(userData?.createdAt as string).format('DD/MM/YYYY')}
            </p>
          ) : (
            <p>
              {typeof userData === 'string' ? userData : 'Not user selected'}
            </p>
          )}
        </Col>
        <Col className={classes.col} xs={12}>
          <Checkbox
            className='me-3'
            trueValue={true}
            id='otherCompany'
            falseValue={false}
            name='workedWithOtherCompany'
            onChange={handleInternalDataChange}
            value={!data.familyInternalData?.workedWithOtherCompany}
            checked={data.familyInternalData?.workedWithOtherCompany}
          />
          <label htmlFor='otherCompany'>
            Do you work or have you ever worked with another host family
            company?
          </label>
        </Col>
      </Row>
      <Row>
        <Col className={classes.col}>
          <p className={classes.subtitle}>Internal Observations</p>
          <Divider className='mb-4' />
          <p>Add internal observations</p>
          {observations === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <InputObservations
              list={observations}
              name='internalObservations'
              placeholder='Add Observations'
              userId={session?.user.id as string}
              onChange={handleObservationsChange}
              onRemove={handleRemoveObservations}
            />
          )}
        </Col>
      </Row>
      <Row>
        <h2 className={classes.subtitle}>Follow-up actions</h2>
        <Col className={classes.col} xs={12}>
          <Accordion>
            <AccordionTab
              header={`Follow up actions (${
                data.familyInternalData?.followUpActions?.length || 0
              })`}>
              <EditFollowUpActionsTab
                familyData={data}
                dispatch={dispatch}
                followUpActions={data.familyInternalData?.followUpActions || []}
              />
            </AccordionTab>
          </Accordion>
        </Col>
        <h2 className={classes.subtitle}>Workshops</h2>
        <Col className={classes.col} xs={12}>
          <Accordion>
            <AccordionTab
              header={`Workshops (${
                data.familyInternalData?.workshopsAttended?.length || 0
              })`}>
              <EditWorkshopsTab
                familyData={data}
                dispatch={dispatch}
                workshopsAttended={
                  data.familyInternalData?.workshopsAttended || []
                }
              />
            </AccordionTab>
          </Accordion>
        </Col>
      </Row>
      <Toast ref={toast} position='top-center' />
    </Container>
  )
}
