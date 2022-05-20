//main tools
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { WorkshopsData } from './workshopsData'

// bootstrap components
import { Pencil, Trash } from 'react-bootstrap-icons'
import { Modal } from 'react-bootstrap'

// prime components
import { Toast } from 'primereact/toast'

// services
import { FamiliesService } from 'services/Families'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FamilyDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type EditWorkshopsTabProps = {
  familyData: FamilyDataType
  workshopsAttended: []
  dispatch: Dispatch<{
    payload: 
      {
        ev: ChangeType | DropdownChangeParams | MultiSelectChangeParams
        idx?: number
      } 
      | null
      | number
      | string[]
    type: string
  }>
}

export const EditWorkshopsTab: FC<EditWorkshopsTabProps> = ({
  dispatch,
  familyData,
  workshopsAttended,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showWorkshopData, setShowWorkshopData] = useState(false)
  const [action, setAction] = useState<string | null>(null)
  const [workshopIndex, setWorkshopIndex] = useState(0)
  const filter = schema.map((item) => item.field)
  const [selected, setSelected] = useState([])
  const { data: session } = useSession()
  const toast = useRef<Toast>(null)
  
  /**
   * handle delete many workshops
   */
   const accept = async () => {
    const workshopIdx = selected.map(({ _id }) => _id ?? '')
  
    await FamiliesService.updatefamily(
      session?.token as string,
      familyData._id as string,
      {
        ...familyData,
        familyInternalData: {
          ...familyData.familyInternalData,
          workshopsAttended: workshopsAttended.filter(
            ({ _id }) => !workshopIdx.includes(_id)
          ) as [],
        }
      }
    )
  
    dispatch({ type: 'handleRemoveWorkshopsByIdx', payload: workshopIdx })
  }

  /**
   * handle set data to edit
   * and show edit form
   */
   const handleEdit = ({ index }: DataTableRowEditParams) => {
    setWorkshopIndex(index)
    setAction('UPDATE')
    setShowWorkshopData(true)
  }

  /**
   * handle show create workshop
   */
   const handleCreate = () => {
    setWorkshopIndex(workshopsAttended.length)
    dispatch({ type: 'handleAddWorkshops', payload: workshopsAttended.length })
    setShowWorkshopData(true)
    setAction('CREATE')
  }

  /**
   * handle save workshops
   */
   const handleSave = async () => {
    const { response, data } = await FamiliesService.updatefamily(
      session?.token as string,
      familyData._id as string,
      { ...familyData },
      ['familyInternalData.workshopsAttended'],
    )

    if (data?.familyInternalData.workshopsAttended)
      dispatch({ type: 'updateWorkshops', payload: data.familyInternalData.workshopsAttended })
    
    if (!response) {
      toast.current?.show({
        severity: 'success',
        summary: 'Workshop succesfully',
      })
      setShowWorkshopData(false)
    } else dispatch({ type: 'cancel', payload: null })
  }

  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE') {
        dispatch({
          type: 'removeNotCreatedWorkshops',
          payload: null,
        })
      }
    }
    setWorkshopIndex(0)
    setAction(null)
    setShowWorkshopData(false)
  }

  return (
    <>
      {!showWorkshopData && (
        <DataTable
          schema={schema}
          selection={selected}
          selectionMode='checkbox'
          value={workshopsAttended}
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Delete: { action: () => setShowConfirmation(true), icon: Trash, danger: true },
            Create: { action: handleCreate, icon: Pencil },
          }}
        />
      )}
      <Modal
        size='xl'
        centered
        show={showWorkshopData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body>
          <WorkshopsData
            idx={workshopIndex}
            dispatch={dispatch}
            handleSave={handleSave}
            data={workshopsAttended[workshopIndex]}
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
