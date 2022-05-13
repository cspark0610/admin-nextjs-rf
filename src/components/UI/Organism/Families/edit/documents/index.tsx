//main tools
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

// components
import { DataTable } from 'components/UI/Molecules/Datatable'

// bootstrap components
import {
  Trash,
  Search,
  Pencil,
  ArrowClockwise,
  FileEarmarkArrowDown,
} from 'react-bootstrap-icons'
import { Container, Row, Col, Spinner, Modal } from 'react-bootstrap'
import { Toast } from 'primereact/toast'
// services
import { DocumentService } from 'services/Documents'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { ReviewDataType } from 'types/models/Review'
import { FamilyDataType } from 'types/models/Family'
import { ChangeType, SetStateType } from 'types'
import { FC, Dispatch } from 'react'
import { EditDocuments } from './edit/EditDocuments'
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'

type UpdateDocumentsProps = {
  setError: SetStateType<string>
  data: FamilyDataType
}

export const UpdateDocuments: FC<UpdateDocumentsProps> = ({
  data,
  setError,
}) => {
  const [documents, setDocuments] = useState<ReviewDataType[] | undefined>(
    undefined
  )
  const [documentToEdit, setDocumentToEdit] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const filter = schema.map((item) => item.field)
  const { data: session, status } = useSession()
  const [selected, setSelected] = useState([])
  const toast = useRef<any>(null)

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setDocumentToEdit(data[0])
    setShowEdit(true)
  }

  /**
   * handle show create document
   */
  const handleCreate = () => setShowCreate(true)

  /**
   * handle get documents
   */
  const getDocuments = async () => {
    if (status === 'authenticated') {
      const res = await DocumentService.getFamilyDocuments(
        session?.token as string,
        data._id as string
      )
      if (!res.data) setError(res.response.data.error)
      else setDocuments(res.data)
    }
  }
  /**
   * Close the modal on submit
   */
  const setCloseModal = () => {
    setShowCreate(false)
    setShowEdit(false)
    getDocuments()
  }

  /**
   * data table delete action
   */
  const handleDeleteMany = async () => {
    toast.current?.show({
      severity: 'warn',
      life: 15000,
      closable: true,
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            const res = await DocumentService.bulkDeleteFamilyDocument(
              session?.token as string,
              [...selected.map((s: any) => s?._id)] as string[]
            )
            if (!res.data) setError(res.response.data.error)
            getDocuments()
          }}
          reject={() => {
            let el: any = document.querySelector('.p-toast-icon-close-icon')
            el.click()
          }}
        />
      ),
    })
  }

  /**
   * toast management
   */
  const showToast = (
    severity: 'success' | 'warn' | 'error',
    summary: string
  ) => {
    toast.current?.show({
      severity,
      summary,
    })
  }

  useEffect(() => {
    getDocuments()
  }, [])

  return (
    <Container fluid className={classes.container}>
      <h2 className={classes.subtitle}>Documents</h2>
      <DataTable
        value={documents}
        schema={schema}
        selection={selected}
        selectionMode='checkbox'
        loading={data === undefined}
        onRowEditChange={handleEdit}
        globalFilterFields={filter as string[]}
        onSelectionChange={(e) => setSelected(e.value)}
        actions={{
          Delete: { action: handleDeleteMany, icon: Trash, danger: true },
          Create: { action: handleCreate, icon: Pencil },
          // Reload: { action: getFamilies, icon: ArrowClockwise },
        }}
      />

      <Modal
        size='xl'
        className={classes.modal}
        show={showCreate || showEdit}
        onHide={setCloseModal}
        contentClassName={classes.modal}>
        <Modal.Header
          className={classes.modal_close}
          closeButton></Modal.Header>
        <Modal.Body>
          <EditDocuments
            familyData={data}
            docToEdit={documentToEdit || {}}
            mode={showCreate ? 'create' : 'edit'}
            setCloseModal={setCloseModal}
          />
        </Modal.Body>
      </Modal>
      <Toast ref={toast} />
    </Container>
  )
}
