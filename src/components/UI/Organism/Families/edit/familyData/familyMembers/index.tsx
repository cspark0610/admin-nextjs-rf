//main tools
import { useRef, useState } from 'react'

// components
import { DataTable } from 'components/UI/Molecules/Datatable'

// bootstrap icons
import { Pencil, Trash } from 'react-bootstrap-icons'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DataTableRowEditParams } from 'primereact/datatable'
import { FamilyMemberDataType } from 'types/models/Family'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'
import { Modal } from 'react-bootstrap'
import { FamilyMemberData } from 'components/UI/Organism/Families/edit/familyData/familyMembers/familyMemberData'
import { useSession } from 'next-auth/react'
import { FamiliesService } from 'services/Families'
import { Toast } from 'primereact/toast'
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'

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
    type: string
  }>
  familyId: string
}

export const EditFamilyMembersTab: FC<EditFamilyMembersTabProps> = ({
  familyMembers,
  dispatch,
  familyId,
}) => {
  const { data: session } = useSession()
  const [memberIndex, setMemberIndex] = useState(0)
  const [showEdit, setShowEdit] = useState(false)
  const [showFamilyData, setShowFamilyData] = useState(false)
  const filter = schema.map((item) => item.field)
  const [selected, setSelected] = useState<FamilyMemberDataType[]>([])
  const toast = useRef<Toast>(null)

  /**
   * handle delete many members
   */
  const handleDeleteMany = () =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            const membersIdx = selected.map(({ _id }) => _id ?? '')

            await FamiliesService.updatefamily(
              session?.token as string,
              familyId,
              {
                familyMembers: familyMembers.filter(
                  ({ _id }) => !membersIdx.includes(_id as string)
                ),
              }
            )

            dispatch({
              type: 'handleRemoveMembersByIdx',
              payload: membersIdx,
            })
          }}
          reject={() => setSelected([])}
        />
      ),
    })

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setMemberIndex(index)
    setShowFamilyData(true)
  }

  /**
   * handle show create family form
   */
  const handleCreate = () => {
    setMemberIndex(familyMembers.length)
    setShowFamilyData(true)
  }

  const handleSave = async () => {
    const { response } = await FamiliesService.updatefamily(
      session?.token as string,
      familyId,
      {
        familyMembers,
      }
    )
    if (!response) {
      toast.current?.show({
        severity: 'success',
        summary: 'Member succesfully',
      })
      setShowFamilyData(false)
    } else dispatch({ type: 'cancel', payload: null })
  }

  return (
    <>
      {!showEdit && !showFamilyData && (
        <DataTable
          schema={schema}
          selection={selected}
          value={familyMembers}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Delete: { action: handleDeleteMany, icon: Trash, danger: true },
            Create: { action: handleCreate, icon: Pencil },
            // Reload: { action: getFamilies, icon: ArrowClockwise },
          }}
        />
      )}
      <Modal
        size='xl'
        show={showFamilyData}
        onHide={() => setShowFamilyData(false)}
        contentClassName={classes.modal}>
        <Modal.Header
          className={classes.modal_close}
          closeButton></Modal.Header>
        <Modal.Body>
          <FamilyMemberData
            dispatch={dispatch}
            handleSave={handleSave}
            idx={memberIndex}
            data={familyMembers[memberIndex] || {}}
          />
        </Modal.Body>
      </Modal>
      <Toast ref={toast} position='top-center' />
    </>
  )
}
