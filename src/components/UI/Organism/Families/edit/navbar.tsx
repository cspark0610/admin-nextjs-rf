// main tools
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'

// bootstrap components
import { Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

// services
import { UsersService } from 'services/Users'
import { FamiliesService } from 'services/Families'

// utils
import {
  FamilyTpesOptions,
  FamilyScoresOptions,
  FamilyStatusOptions,
} from 'components/UI/Molecules/Datatable/options'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { FamilyDataType } from 'types/models/Family'
import { SetStateType } from 'types'
import { FC, Dispatch } from 'react'

type EditFamilyNavbarProps = {
  data: FamilyDataType
  setError: SetStateType<string>
  dispatch: Dispatch<{
    type: string
    payload: DropdownChangeParams | { ev: DropdownChangeParams } | null
  }>
}

export const EditFamilyNavbar: FC<EditFamilyNavbarProps> = ({
  data,
  setError,
  dispatch,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [coordinators, setCoordinators] = useState(undefined)
  const { data: session, status } = useSession()
  const [body, setBody] = useState({})
  const toast = useRef<Toast>(null)

  /**
   * handle format local coordinator
   */
  const formatLocalCoordinator = () =>
    typeof data.familyInternalData?.localManager === 'string'
      ? data.familyInternalData?.localManager
      : data.familyInternalData?.localManager?._id

  /**
   * handle show confirmation modal
   * accept and reject function
   */
  const ShowConfirmationModal = (body: FamilyDataType) => {
    setShowConfirmation(true)
    setBody(body)
  }

  const accept = async () => {
    if (data.location || data.familyInternalData?.status !== 'ACTIVE') {
      const { response } = await FamiliesService.updatefamily(
        session?.token as string,
        data._id as string,
        body
      )
      if (!response)
        toast.current?.show({
          severity: 'success',
          summary: 'Update succesfully',
        })
      else {
        setError(response.data?.message)
        dispatch({ type: 'cancel', payload: null })
      }
      setBody({})
      setShowConfirmation(false)
    } else
      toast.current?.show({
        severity: 'error',
        summary: 'Location is required',
        detail:
          'This family needs to have a location before set as active, please set it on the Home details tab',
      })
  }

  const reject = () => {
    dispatch({ type: 'cancel', payload: null })
    setBody({})
    setShowConfirmation(false)
  }

  /**
   * handle internal data
   * dropdowns change
   */
  const handleInternalDataChange = (ev: DropdownChangeParams) => {
    dispatch({ type: 'handleInternalDataChange', payload: ev })
    ShowConfirmationModal({
      ...data,
      familyInternalData: {
        ...data.familyInternalData,
        [ev.target.name]: ev.target.value,
      },
    })
  }
  /**
   * handle family score
   * dropdown change
   */
  const handleFamilyScoreChange = (ev: DropdownChangeParams) => {
    dispatch({ type: 'familyInfo', payload: { ev } })
    ShowConfirmationModal({ ...data, [ev.target.name]: ev.target.value })
  }

  /**
   * handle get generics from backend
   */
  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await UsersService.getLocalCoordinators(session.token)

        setCoordinators(data)
      })()
    }
  }, [status, session])

  return (
    <>
      <Row>
        <Col className='mb-4' xs={12}>
          <h4>Family:</h4>
          <Link
            href={`${process.env.NEXT_PUBLIC_FRONT_URL}/family/${data._id}`}>
            <a target='_blank' rel='noreferrer'>
              {data.name}
            </a>
          </Link>
        </Col>
        <Col className='my-2' xs={12} sm={6} md={4} lg={3}>
          <h4>Local coordinator:</h4>
          {coordinators === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              optionValue='_id'
              name='localManager'
              optionLabel='firstName'
              placeholder='Not assigned'
              className={classes.input}
              value={formatLocalCoordinator()}
              onChange={handleInternalDataChange}
              options={[
                { firstName: 'Not assigned', _id: null },
                ...coordinators,
              ]}
              valueTemplate={(value) => (
                <span>
                  {value
                    ? `${value?.firstName} ${value?.lastName} - ${value?.email}`
                    : 'Not assigned'}
                </span>
              )}
            />
          )}
        </Col>
        <Col className='my-2' xs={12} sm={6} md={4} lg={3}>
          <h4>Status:</h4>
          <Dropdown
            name='status'
            className={classes.input}
            options={FamilyStatusOptions}
            onChange={handleInternalDataChange}
            value={data.familyInternalData?.status}
          />
        </Col>
        <Col className='my-2' xs={12} sm={6} md={4} lg={3}>
          <h4>Score:</h4>
          <Dropdown
            name='familyScore'
            value={data.familyScore}
            className={classes.input}
            options={FamilyScoresOptions}
            onChange={handleFamilyScoreChange}
          />
        </Col>
        <Col className='my-2' xs={12} sm={6} md={4} lg={3}>
          <h4>Kind of family</h4>
          <Dropdown
            name='type'
            className={classes.input}
            options={FamilyTpesOptions}
            onChange={handleInternalDataChange}
            value={data.familyInternalData?.type}
          />
        </Col>
      </Row>
      <ToastConfirmation
        accept={accept}
        reject={reject}
        visible={showConfirmation}
        onHide={() => setShowConfirmation(false)}
      />
      <Toast ref={toast} position='top-center' />
    </>
  )
}
