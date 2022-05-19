//main tools
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { EditDocuments } from './edit/EditDocuments'

// bootstrap components
import { Trash, Pencil } from 'react-bootstrap-icons'
import { Container, Modal } from 'react-bootstrap'

// prime components
import { Toast } from 'primereact/toast'

// services
import { DocumentService } from 'services/Documents'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { DocumentDataType } from 'types/models/Documents'
import { FamilyDataType } from 'types/models/Family'
import { SetStateType } from 'types'
import { FC } from 'react'

type UpdateDocumentsProps = {
  data: FamilyDataType
  setError: SetStateType<string>
}

export const UpdateDocuments: FC<UpdateDocumentsProps> = ({
  data,
  setError,
}) => {
  const toast = useRef<any>(null)
  const [reload, setReload] = useState(false)
  const [selected, setSelected] = useState([])
  const { data: session, status } = useSession()
  const filter = schema.map((item) => item.field)
  const [documentIndex, setDocumentIndex] = useState(0)
  const [action, setAction] = useState<string | null>(null)
  const [showDocumentData, setShowDocumentData] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [documents, setDocuments] = useState<DocumentDataType[] | undefined>(
    undefined
  )

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setDocumentIndex(index)
    setAction('UPDATE')
    setShowDocumentData(true)
  }

  /**
   * handle show create document
   */
  const handleCreate = () => {
    setDocumentIndex(documents?.length as number)
    setAction('CREATE')
    setShowDocumentData(true)
  }

  /**
   * handle delete many documents
   */
  const accept = async () => {
    const documentsIdx: string[] = selected.map(({ _id }) => _id ?? '')

    await DocumentService.bulkDeleteFamilyDocument(
      session?.token as string,
      documentsIdx
    )

    setDocuments(
      documents?.filter(({ _id }) => !documentsIdx.includes(_id as string)) ||
        []
    )
  }

  /**
   * handle close modal
   */
  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE')
        setDocuments(documents?.filter((_, idx) => idx !== documentIndex))
    }
    setDocumentIndex(0)
    setAction(null)
    setShowDocumentData(false)
  }

  /**
   * handle get documents
   */
  useEffect(() => {
    setDocuments(undefined)
    if (status === 'authenticated') {
      ;(async () => {
        const res = await DocumentService.getFamilyDocuments(
          session?.token as string,
          data._id as string
        )
        if (!res?.data) setError(res?.response?.data?.error)
        else setDocuments(res?.data)
      })()
    }
  }, [status, session?.token, data._id, reload, setError])

  return (
    <Container fluid className={classes.container}>
      <h2 className={classes.subtitle}>Documents</h2>
      <DataTable
        schema={schema}
        value={documents}
        selection={selected}
        selectionMode='checkbox'
        loading={data === undefined}
        onRowEditChange={handleEdit}
        globalFilterFields={filter as string[]}
        onSelectionChange={(e) => setSelected(e.value)}
        actions={{
          Delete: {
            icon: Trash,
            danger: true,
            action: () => setShowConfirmation(true),
          },
          Create: { action: handleCreate, icon: Pencil },
        }}
      />

      <Modal
        size='xl'
        show={showDocumentData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body>
          <EditDocuments
            action={action}
            familyData={data}
            idx={documentIndex}
            setReload={setReload}
            handleCloseCreate={handleCloseCreate}
            data={(documents && documents[documentIndex]) || {}}
          />
        </Modal.Body>
      </Modal>
      <ToastConfirmation
        accept={accept}
        visible={showConfirmation}
        reject={() => setShowConfirmation(false)}
        onHide={() => setShowConfirmation(false)}
      />
      <Toast ref={toast} />
    </Container>
  )
}
