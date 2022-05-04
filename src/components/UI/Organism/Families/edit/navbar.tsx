// main tools
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

// components
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'

// bootstrap components
import { Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

// services
import { GenericsService } from 'services/Generics'
import { FamiliesService } from 'services/Families'

// utils
import {
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
  const [coordinators, setCoordinators] = useState(undefined)
  const { data: session, status } = useSession()
  const toast = useRef<Toast>(null)

  /**
   * handle show confirmation modal
   */
  const ShowConfirmationModal = (body: FamilyDataType) =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
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
          }}
          reject={() => dispatch({ type: 'cancel', payload: null })}
        />
      ),
    })

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
        const { data } = await GenericsService.getAllByModelnames(
          session.token,
          ['localManager']
        )

        setCoordinators(data.localManager)
      })()
    }
  }, [status, session])

  return (
    <>
      <Row>
        <Col xs={3}>
          <h4>Family:</h4>
          <strong>{data.name}</strong>
        </Col>
        <Col xs={3}>
          <h4>Local coordinator:</h4>
          {coordinators === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              optionValue='_id'
              optionLabel='name'
              name='localManager'
              options={coordinators}
              className={classes.input}
              onChange={handleInternalDataChange}
              value={data.familyInternalData?.localManager}
            />
          )}
        </Col>
        <Col xs={3}>
          <h4>Status:</h4>
          <Dropdown
            showClear
            name='status'
            className={classes.input}
            options={FamilyStatusOptions}
            onChange={handleInternalDataChange}
            value={data.familyInternalData?.status}
          />
        </Col>
        <Col xs={3}>
          <h4>Score:</h4>
          <Dropdown
            showClear
            name='familyScore'
            value={data.familyScore}
            className={classes.input}
            options={FamilyScoresOptions}
            onChange={handleFamilyScoreChange}
          />
        </Col>
      </Row>
      <Toast ref={toast} position='top-center' />
    </>
  )
}
