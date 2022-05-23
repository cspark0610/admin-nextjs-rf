//main tools
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { FollowUpAcctionData } from './followUpAcctionsData'

// bootstrap components
import { Pencil, Trash } from 'react-bootstrap-icons'
import { Modal } from 'react-bootstrap'

// prime components
import { CalendarChangeParams } from 'primereact/calendar'
import { Toast } from 'primereact/toast'

// validations
import { validateUpdateFollowUp } from 'validations/updateFamilyData'

// services
import { FamiliesService } from 'services/Families'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  FamilyDataType,
  FamilyMemberDataType,
  followUpActionsType,
} from 'types/models/Family'
import { DataTableRowEditParams } from 'primereact/datatable'
import { FC, Dispatch, ChangeEvent } from 'react'
import { ChangeType } from 'types'

type EditFollowUpActionsProps = {
  followUpActions: followUpActionsType[]
  familyData: FamilyDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev:
            | ChangeType
            | CalendarChangeParams
            | ChangeEvent<HTMLTextAreaElement>
          idx?: number
        }
      | null
      | number
      | string[]
    type: string
  }>
}

export const EditFollowUpActionsTab: FC<EditFollowUpActionsProps> = ({
  followUpActions,
  familyData,
  dispatch,
}) => {
  const [selected, setSelected] = useState<FamilyMemberDataType[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showFollowUpData, setShowFollowUpData] = useState(false)
  const [action, setAction] = useState<string | null>(null)
  const [followUpIndex, setFollowUpIndex] = useState(0)
  const { data: session } = useSession()
  const toast = useRef<Toast>(null)

  /**
   * show errors
   */
  const showErrors = (errors: string[]) =>
    toast.current?.show({
      severity: 'error',
      summary: 'Required fields',
      detail: (
        <ul>
          {errors.map((err, idx: number) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      ),
    })

  /**
   * handle delete many follow Up
   */
  const accept = async () => {
    const followUpIdx = selected.map(({ _id }) => _id ?? '')

    await FamiliesService.updatefamily(
      session?.token as string,
      familyData._id as string,
      {
        familyInternalData: {
          ...familyData.familyInternalData,
          followUpActions: followUpActions.filter(
            ({ _id }) => !followUpIdx.includes(_id)
          ) as [],
        },
      }
    )

    dispatch({ type: 'handleRemoveFollowUpByIdx', payload: followUpIdx })
  }

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setFollowUpIndex(index)
    setShowFollowUpData(true)
    setAction('UPDATE')
  }

  /**
   * handle show create follow Up
   */
  const handleCreate = () => {
    setFollowUpIndex(followUpActions.length)
    dispatch({ type: 'handleAddFollowUp', payload: followUpActions.length })
    setShowFollowUpData(true)
    setAction('CREATE')
  }

  /**
   * handle save follow Up
   */
  const handleSave = async () => {
    const validationError = validateUpdateFollowUp(followUpActions)
    if (validationError.length) showErrors(validationError)
    else {
      const { response, data } = await FamiliesService.updatefamily(
        session?.token as string,
        familyData._id as string,
        {
          familyInternalData: {
            ...familyData.familyInternalData,
            followUpActions: familyData.familyInternalData?.followUpActions,
          },
        }
      )

      if (data?.familyInternalData.followUpActions)
        dispatch({
          type: 'updateFollowUp',
          payload: data.familyInternalData.followUpActions,
        })

      if (!response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Follow Up Actions succesfully',
        })
        setShowFollowUpData(false)
      } else dispatch({ type: 'cancel', payload: null })
    }
  }

  /**
   * handle close create follow Up
   */
  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE') {
        dispatch({
          type: 'removeNotCreatedFollowUp',
          payload: followUpIndex,
        })
      }
    }
    setFollowUpIndex(0)
    setAction(null)
    setShowFollowUpData(false)
  }

  return (
    <>
      {!showFollowUpData && (
        <DataTable
          schema={schema}
          selection={selected}
          value={followUpActions}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Delete: {
              action: () => setShowConfirmation(true),
              icon: Trash,
              danger: true,
            },
            Create: { action: handleCreate, icon: Pencil },
          }}
        />
      )}
      <Modal
        size='xl'
        centered
        show={showFollowUpData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body>
          <FollowUpAcctionData
            idx={followUpIndex}
            dispatch={dispatch}
            handleSave={handleSave}
            data={followUpActions[followUpIndex] || {}}
          />
        </Modal.Body>
      </Modal>
      <ToastConfirmation
        accept={accept}
        visible={showConfirmation}
        reject={() => setShowConfirmation(false)}
        onHide={() => setShowConfirmation(false)}
      />
      <Toast ref={toast} position='top-center' />
    </>
  )
}
