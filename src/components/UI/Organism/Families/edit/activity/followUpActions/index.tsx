//main tools
import { useState } from 'react'

// components
import { DataTable } from 'components/UI/Molecules/Datatable'

// bootstrap icons
import {
  FileEarmarkArrowDown,
  ArrowClockwise,
  Pencil,
  Search,
  Trash,
} from 'react-bootstrap-icons'

// utils
import { schema } from './utils'

// types
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DataTableRowEditParams } from 'primereact/datatable'
import { FamilyInternalDataType } from 'types/models/Family'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type EditFollowUpActionsTabProps = {
  followUpActions: FamilyInternalDataType['followUpActions']
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | MultiSelectChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const EditFollowUpActionsTab: FC<EditFollowUpActionsTabProps> = ({
  followUpActions,
  dispatch,
}) => {
  const [followUpActionToEdit, setFollowUpActionToEdit] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const filter = schema.map((item) => item.field)
  const [selected, setSelected] = useState([])

  /**
   * handle add follow up action
   */
  const handleAddFollowUpAction = () =>
    dispatch({ type: 'handleAddFamiliar', payload: null })

  /**
   * handle remove follow up action by index
   */
  const handleRemoveFollowUpAction = () =>
    dispatch({ type: 'handleRemoveFamiliar', payload: null })

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setFollowUpActionToEdit(data[0])
    setShowEdit(true)
  }

  /**
   * handle show create family form
   */
  const handleCreate = () => setShowCreate(true)

  return (
    <>
      {!showEdit && !showCreate && (
        <DataTable
          schema={schema}
          value={followUpActions}
          selection={selected}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            // Delete: { action: handleDeleteMany, icon: Trash, danger: true },
            Create: { action: handleCreate, icon: Pencil },
            // Reload: { action: getFamilies, icon: ArrowClockwise },
          }}
        />
      )}
    </>
  )
}
