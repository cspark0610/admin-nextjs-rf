//main tools
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'

// components
import { FamilyMemberData } from 'components/UI/Organism/Families/edit/familyData/familyMembers/familyMemberData'
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'

// bootstrap components
import { Modal } from 'react-bootstrap'
import { Pencil, Trash } from 'react-bootstrap-icons'

// prime components
import { Toast } from 'primereact/toast'

// validations
import { validateUpdateFamilyMembers } from 'validations/updateFamilyData'

// utils
import { schema } from './utils'

// services
import { FamiliesService } from 'services/Families'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DataTableRowEditParams } from 'primereact/datatable'
import { FamilyMemberDataType } from 'types/models/Family'
import { DropdownChangeParams } from 'primereact/dropdown'
import { ChangeType, SetStateType } from 'types'
import { FC, Dispatch } from 'react'

type EditFamilyMembersTabProps = {
  familyMembers: FamilyMemberDataType[]
  dispatch: Dispatch<{
    payload:
      | {
          ev: ChangeType | DropdownChangeParams | MultiSelectChangeParams
          idx?: number
        }
      | null
      | string[]
      | number
    type: string
  }>
  familyId: string
}

export const EditFamilyMembersTab: FC<EditFamilyMembersTabProps> = ({
  familyMembers,
  dispatch,
  familyId,
}) => {
  const [selected, setSelected] = useState<FamilyMemberDataType[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showFamilyData, setShowFamilyData] = useState(false)
  const [action, setAction] = useState<string | null>(null)
  const [memberIndex, setMemberIndex] = useState(0)
  const { data: session } = useSession()
  const toast = useRef<Toast>(null)

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
   * handle delete many members
   */
  const accept = async () => {
    const membersIdx = selected.map(({ _id }) => _id ?? '')

    await FamiliesService.updatefamily(session?.token as string, familyId, {
      familyMembers: familyMembers.filter(
        ({ _id }) => !membersIdx.includes(_id as string)
      ),
    })

    dispatch({ type: 'handleRemoveMembersByIdx', payload: membersIdx })
  }

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setMemberIndex(index)
    setShowFamilyData(true)
    setAction('UPDATE')
  }

  /**
   * handle show create family form
   */
  const handleCreate = () => {
    setMemberIndex(familyMembers.length)
    dispatch({ type: 'addFamilyMember', payload: familyMembers.length })
    setShowFamilyData(true)
    setAction('CREATE')
  }

  /**
   * handle save family member
   */
  const handleSave = async () => {
    const validationError = validateUpdateFamilyMembers(familyMembers)
    if (validationError.length) showErrors(validationError)
    else {
      const { response, data } = await FamiliesService.updatefamily(
        session?.token as string,
        familyId,
        { familyMembers },
        [
          'familyMembers.gender',
          'familyMembers.situation',
          'familyMembers.spokenLanguages',
          'familyMembers.familyRelationship',
        ]
      )

      if (data?.familyMembers)
        dispatch({ type: 'updateFamilyMembers', payload: data.familyMembers })

      if (!response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Member succesfully',
        })
        setShowFamilyData(false)
      } else dispatch({ type: 'cancel', payload: null })
    }
  }

  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE') {
        dispatch({
          type: 'removeNotCreatedMember',
          payload: memberIndex,
        })
      }
    }
    setMemberIndex(0)
    setAction(null)
    setShowFamilyData(false)
  }

  return (
    <>
      {!showFamilyData && (
        <DataTable
          schema={schema}
          selection={selected}
          value={familyMembers}
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
        show={showFamilyData}
        onHide={handleCloseCreate}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body className='p-5'>
          <FamilyMemberData
            idx={memberIndex}
            dispatch={dispatch}
            handleSave={handleSave}
            data={familyMembers[memberIndex] || {}}
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
