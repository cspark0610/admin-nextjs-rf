//main tools
import { ChangeEvent, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { ExternalStudentsData } from './externalStudentsData'

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
import { DataTableRowEditParams } from 'primereact/datatable'
import { ExternalStudentDataType } from 'types/models/Family'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type EditExternalStudentsTabProps = {
  noRedLeafStudentsList: ExternalStudentDataType[]
  dispatch: Dispatch<{
    payload:
      | {
          ev:
            | ChangeType
            | DropdownChangeParams
            | ChangeEvent<HTMLTextAreaElement>
          idx?: number
        }
      | null
      | string[]
      | number
    type: string
  }>
  familyId: string
}

export const EditExternalStudentsTab: FC<EditExternalStudentsTabProps> = ({
  noRedLeafStudentsList,
  familyId,
  dispatch,
}) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const filter = schema.map((item) => item.field)
  const [studentIndex, setStudentsIndex] = useState(0)
  const [action, setAction] = useState<string | null>(null)
  const [showStudentData, setShowStudentData] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selected, setSelected] = useState<ExternalStudentDataType[]>([])

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setStudentsIndex(index)
    setAction('UPDATE')
    setShowStudentData(true)
  }

  /**
   * handle show create external stundent form
   */
  const handleCreate = () => {
    setStudentsIndex(noRedLeafStudentsList.length)
    dispatch({ type: 'addStudent', payload: noRedLeafStudentsList.length })
    setAction('CREATE')
    setShowStudentData(true)
  }

  /**
   * handle delete many students
   */
  const accept = async () => {
    const studentsIdx = selected.map(({ _id }) => _id ?? '')

    await FamiliesService.updatefamily(session?.token as string, familyId, {
      noRedLeafStudentsList: noRedLeafStudentsList?.filter(({ _id }) => 
        !studentsIdx.includes(_id as string)),
    })

    dispatch({
      type: 'handleRemoveStudentByIdx',
      payload: studentsIdx,
    })
  }

  /**
   * handle save external students
   */
  const handleSave = async () => {
    const { response, data } = await FamiliesService.updatefamily(
      session?.token as string,
      familyId,
      { noRedLeafStudentsList },
      ['noRedLeafStudentsList.gender', 'noRedLeafStudentsList.nationality']
    )

    if (data?.noRedLeafStudentsList) dispatch({ type: 'updateStudent', payload: data.noRedLeafStudentsList })

    if (!response) {
      toast.current?.show({
        severity: 'success',
        summary: 'External Student succesfully',
      })
      setShowStudentData(false)
    } else dispatch({ type: 'cancel', payload: null })
  }

  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE')
        dispatch({ type: 'removeNotCreatedStudent', payload: studentIndex })
    }
    
    setStudentsIndex(0)
    setAction(null)
    setShowStudentData(false)
  }

  return (
    <>
      {!showStudentData && (
        <DataTable
          schema={schema}
          selection={selected}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          value={noRedLeafStudentsList}
          globalFilterFields={filter as string[]}
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
        show={showStudentData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal_small}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body>
          <ExternalStudentsData
            idx={studentIndex}
            dispatch={dispatch}
            handleSave={handleSave}
            data={noRedLeafStudentsList[studentIndex] || {}}
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
