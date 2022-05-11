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
import { DropdownChangeParams } from 'primereact/dropdown'
import { FamilyDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type EditExternalStudentsTabProps = {
  noRedLeafStudents: FamilyDataType['noRedLeafStudentsList']
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | MultiSelectChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const EditExternalStudentsTab: FC<EditExternalStudentsTabProps> = ({
  noRedLeafStudents,
  dispatch,
}) => {
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const filter = schema.map((item) => item.field)
  const [studentToEdit, setStudentToEdit] = useState({})
  const [selected, setSelected] = useState([])

  /**
   * handle add external student
   */
  const handleAddStudent = () =>
    dispatch({ type: 'handleAddFamiliar', payload: null })

  /**
   * handle remove external student by index
   */
  const handleRemoveStudent = () =>
    dispatch({ type: 'handleRemoveFamiliar', payload: null })

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setStudentToEdit(data[0])
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
          value={noRedLeafStudents}
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
