//main tools
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'

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
import { DropdownChangeParams } from 'primereact/dropdown'
import { SchoolDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'
import { SchoolData } from './schoolData'

type EditSchoolsTabProps = {
  schools: SchoolDataType[]
  dispatch: Dispatch<{
    payload:
      | {
          ev: ChangeType | DropdownChangeParams
          idx?: number
        }
      | null
      | string[]
      | number
    type: string
  }>
  familyId: string
}

export const EditSchoolsTab: FC<EditSchoolsTabProps> = ({
  schools,
  dispatch,
  familyId,
}) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [schoolIndex, setSchoolIndex] = useState(0)
  const [action, setAction] = useState<string | null>(null)
  const [showSchoolData, setShowSchoolData] = useState(false)
  const [selected, setSelected] = useState<SchoolDataType[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setSchoolIndex(index)
    setAction('UPDATE')
    setShowSchoolData(true)
  }

  /**
   * handle show asign school form
   */
  const handleCreate = () => {
    setSchoolIndex(schools.length)
    dispatch({ type: 'handleAddSchool', payload: null })
    setAction('CREATE')
    setShowSchoolData(true)
  }

  /**
   * handle delete many members
   */
  const accept = async () => {
    const schoolsIdx = selected.map(({ school }) => school._id ?? '')

    await FamiliesService.updatefamily(session?.token as string, familyId, {
      schools: schools.filter(
        ({ school }) => !schoolsIdx.includes(school._id as string)
      ),
    })

    dispatch({ type: 'handleRemoveSchoolsByIdx', payload: schoolsIdx })
  }

  const handleSave = async () => {
    const { response, data } = await FamiliesService.updatefamily(
      session?.token as string,
      familyId,
      { schools },
      ['schools.school', 'schools.transports']
    )

    if (data?.schools)
      dispatch({ type: 'updateSchools', payload: data.schools })

    if (!response) {
      toast.current?.show({
        severity: 'success',
        summary: 'Schools succesfully',
      })
      setShowSchoolData(false)
    } else dispatch({ type: 'cancel', payload: null })
  }

  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE')
        dispatch({ type: 'removeNotCreatedSchools', payload: schoolIndex })
    }
    setSchoolIndex(0)
    setAction(null)
    setShowSchoolData(false)
  }

  return (
    <>
      {!showSchoolData && (
        <DataTable
          value={schools}
          schema={schema}
          selection={selected}
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
        show={showSchoolData}
        onHide={handleCloseCreate}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body className='py-5'>
          <SchoolData
            idx={schoolIndex}
            dispatch={dispatch}
            handleSave={handleSave}
            data={schools[schoolIndex] || {}}
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
