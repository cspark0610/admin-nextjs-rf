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
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { StudentRoomDataType } from 'types/models/Home'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type EditStudentRoomsProps = {
  familyId: string
  bedrooms?: StudentRoomDataType[]
  dispatch: Dispatch<{
    payload:
      | {
          ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
          idx?: number
        }
      | number
      | string[]
      | null
    type: string
  }>
}

export const EditStudentRooms: FC<EditStudentRoomsProps> = ({
  dispatch,
  familyId,
  bedrooms,
}) => {
  const [selected, setSelected] = useState<StudentRoomDataType[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showBedroomData, setShowBedroomData] = useState(false)
  const [action, setAction] = useState<string | null>(null)
  const [bedroomIndex, setBedroomIndex] = useState(0)
  const filter = schema.map((item) => item.field)
  const { data: session } = useSession()
  const toast = useRef<Toast>(null)

  /**
   * handle delete many bedrooms
   */
  const accept = async () => {
    const bedroomsIdx = selected.map(({ _id }) => _id ?? '')

    await HomeService.updateHome(session?.token as string, familyId, {
      studentRooms: bedrooms?.filter(
        ({ _id }) => !bedroomsIdx.includes(_id as string)
      ),
    })

    dispatch({ type: 'handleRemoveRoomByIdx', payload: bedroomsIdx })
  }

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setBedroomIndex(index)
    setShowBedroomData(true)
    setAction('UPDATE')
  }

  /**
   * handle show create family form
   */
  const handleCreate = () => {
    if (bedrooms?.length && bedrooms?.length < 2) {
      setBedroomIndex(bedrooms?.length || 0)
      dispatch({ type: 'handleAddRoom', payload: null })
      setShowBedroomData(true)
      setAction('CREATE')
    } else
      toast.current?.show({
        severity: 'error',
        summary: 'Max bedrooms quantity created',
        detail: 'Only 2 bedrooms can be created',
      })
  }

  /**
   * handle save bedroom
   */
  const handleSave = async () => {
    const { response, data } = await HomeService.updateHome(
      session?.token as string,
      familyId,
      { studentRooms: bedrooms },
      [
        'studentRooms.type',
        'studentRooms.floor',
        'studentRooms.bedType',
        'studentRooms.bathType',
        'studentRooms.aditionalFeatures',
      ]
    )

    if (data?.studentRooms)
      dispatch({ type: 'updateStudentRooms', payload: data.studentRooms })

    if (!response) {
      toast.current?.show({
        severity: 'success',
        summary: 'Room add succesfully',
      })
      setShowBedroomData(false)
    } else dispatch({ type: 'cancel', payload: null })
  }

  /**
   * handle close modal
   */
  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE')
        dispatch({ type: 'removeNotCreatedBedrooms', payload: bedroomIndex })
    }
    setBedroomIndex(0)
    setAction(null)
    setShowBedroomData(false)
  }

  return (
    <>
      {!showBedroomData && (
        <DataTable
          schema={schema}
          value={bedrooms}
          selection={selected}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Create: { action: handleCreate, icon: Pencil },
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
        show={showBedroomData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal}>
        <Modal.Header
          className={classes.modal_close}
          closeButton></Modal.Header>
        <Modal.Body>
          <EditBedrooms
            idx={bedroomIndex}
            dispatch={dispatch}
            handleSave={handleSave}
            data={bedrooms ? bedrooms[bedroomIndex] : {}}
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
