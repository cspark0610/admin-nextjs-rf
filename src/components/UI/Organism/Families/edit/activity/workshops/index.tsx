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
import { FamilyDataType, FamilyInternalDataType } from 'types/models/Family'
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type EditWorkshopsTabProps = {
  workshops: FamilyDataType['workshops']
  workshopsAttended: FamilyInternalDataType['workshopsAttended']
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | MultiSelectChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const EditWorkshopsTab: FC<EditWorkshopsTabProps> = ({
  dispatch,
  workshops,
  workshopsAttended,
}) => {
  const [workshopToEdit, setWorkshopToEdit] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const filter = schema.map((item) => item.field)
  const [selected, setSelected] = useState([])

  /**
   * handle add workshop
   */
  const handleAddFollowUpAction = () =>
    dispatch({ type: 'handleAddFamiliar', payload: null })

  /**
   * handle remove workshop  by index
   */
  const handleRemoveFollowUpAction = () =>
    dispatch({ type: 'handleRemoveFamiliar', payload: null })

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setWorkshopToEdit(data[0])
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
          value={workshops}
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
