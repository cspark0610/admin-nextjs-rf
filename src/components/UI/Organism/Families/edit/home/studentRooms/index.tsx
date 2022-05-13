//main tools
import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { EditBedrooms } from 'components/UI/Molecules/Bedrooms/editBedrooms'
import { DataTable } from 'components/UI/Molecules/Datatable'

// prime components
import { Toast } from 'primereact/toast'

// bootstrap components
import { Pencil, Trash } from 'react-bootstrap-icons'
import { Modal } from 'react-bootstrap'

// services
import { HomeService } from 'services/Home'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { HomeDataType, StudentRoomDataType } from 'types/models/Home'
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DataTableRowEditParams } from 'primereact/datatable'
import { INITIAL_ROOM_STATE } from 'reducers/FamilyActions'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type EditStudentRoomsProps = {
  familyId: string
  home: HomeDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
          idx?: number
        }
      | string[]
      | null
    type: string
  }>
}

export const EditStudentRooms: FC<EditStudentRoomsProps> = ({
  dispatch,
  familyId,
  home,
}) => {
  const [roomToEdit, setRoomToEdit] = useState<{
    idx?: number
    data: StudentRoomDataType | undefined
  }>({ idx: NaN, data: undefined })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const filter = schema.map((item) => item.field)
  const [selected, setSelected] = useState([])
  const { data: session } = useSession()
  const toast = useRef<Toast>(null)

  /**
   * handle add student room
   */
  const handleAddRoom = () => {
    dispatch({ type: 'handleAddRoom', payload: null })
    const newIndex = (home?.studentRooms as StudentRoomDataType[]).length
    setRoomToEdit({
      idx: newIndex,
      data: {
        ...INITIAL_ROOM_STATE,
        roomNumber: newIndex,
      } as StudentRoomDataType,
    })
    setShowEdit(true)
  }

  /**
   * handle delete many student rooms
   */
  const accept = async () => {
    dispatch({
      type: 'handleRemoveRoomByIdx',
      payload: selected.map(({ _id }) => _id ?? ''),
    })
    setSelected([])
    setShowConfirmation(false)
  }

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data, index }: DataTableRowEditParams) => {
    setRoomToEdit({ ...roomToEdit, data: data[0], idx: index })
    setShowEdit(true)
  }

  const handleSave = async () => {
    const { response: homeResponse } = await HomeService.updateHome(
      session?.token as string,
      familyId,
      home
    )
    if (!homeResponse) {
      toast.current?.show({
        severity: 'success',
        summary: 'Room add succesfully',
      })
      setShowEdit(false)
    } else dispatch({ type: 'cancel', payload: null })
  }

  return (
    <>
      {!showEdit && !showCreate && (
        <DataTable
          schema={schema}
          selection={selected}
          selectionMode='checkbox'
          value={home?.studentRooms}
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Create: { action: handleAddRoom, icon: Pencil },
            Delete: {
              action: () => setShowConfirmation(true),
              icon: Trash,
              danger: true,
            },
          }}
        />
      )}
      <Modal
        size='xl'
        show={showEdit}
        onHide={() => setShowEdit(false)}
        contentClassName={classes.modal}>
        <Modal.Header
          className={classes.modal_close}
          closeButton></Modal.Header>
        <Modal.Body>
          <EditBedrooms
            dispatch={dispatch}
            handleSave={handleSave}
            idx={roomToEdit.idx as number}
            data={roomToEdit?.data as StudentRoomDataType}
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
