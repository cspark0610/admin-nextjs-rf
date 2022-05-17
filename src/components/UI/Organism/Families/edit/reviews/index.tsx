//main tools
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { ReviewsData } from './ReviewsData'

// bootstrap components
import { Trash, Pencil } from 'react-bootstrap-icons'
import { Container, Modal } from 'react-bootstrap'
import { Toast } from 'primereact/toast'

// services
import { ReviewsService } from 'services/Reviews'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { ReviewDataType } from 'types/models/Review'
import { FamilyDataType } from 'types/models/Family'
import { SetStateType } from 'types'
import { FC } from 'react'

type UpdateReviewsProps = {
  setError: SetStateType<string>
  data: FamilyDataType
}

export const UpdateReviews: FC<UpdateReviewsProps> = ({ data, setError }) => {
  const toast = useRef<Toast>(null)
  const [reload, setReload] = useState(false)
  const [selected, setSelected] = useState([])
  const [reviewIdx, setReviewIdx] = useState(0)
  const { data: session, status } = useSession()
  const filter = schema.map((item) => item.field)
  const [action, setAction] = useState<string | null>(null)
  const [showReviewData, setShowReviewData] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reviews, setReviews] = useState<ReviewDataType[] | undefined>(
    undefined
  )

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setReviewIdx(index)
    setAction('UPDATE')
    setShowReviewData(true)
  }

  /**
   * handle show create review
   */
  const handleCreate = () => {
    setReviewIdx(reviews?.length || 0)
    setAction('CREATE')
    setShowReviewData(true)
  }

  /**
   * handle delete many reviews
   */
  const accept = async () => {
    const documentsIdx: string[] = selected.map(({ _id }) => _id ?? '')

    const res = await ReviewsService.bulkDeleteReview(
      session?.token as string,
      data._id as string,
      documentsIdx
    )

    setReviews(
      reviews?.filter(({ _id }) => !documentsIdx.includes(_id as string)) || []
    )
  }

  /**
   * handle close modal
   */
  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE')
        setReviews(reviews?.filter((_, idx) => idx !== reviewIdx))
    }

    setReviewIdx(0)
    setAction(null)
    setShowReviewData(false)
  }

  /**
   * handle get reviews
   */
  useEffect(() => {
    setReviews(undefined)
    if (status === 'authenticated') {
      ;(async () => {
        const res = await ReviewsService.getReviewsFromAFamily(
          session.token as string,
          data._id as string,
          ['family', 'program', 'studentNationality', 'studentSchool']
        )
        if (!res.data) setError(res.response.data.error)
        else setReviews(res.data)
      })()
    }
  }, [session?.token, status, data, reload, setError])

  return (
    <Container fluid className={classes.container}>
      <h2 className={classes.subtitle}>Reviews</h2>
      <DataTable
        value={reviews}
        schema={schema}
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
        show={showReviewData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body>
          <ReviewsData
            action={action}
            idx={reviewIdx}
            familyData={data}
            setReload={setReload}
            handleCloseCreate={handleCloseCreate}
            data={(reviews && reviews[reviewIdx]) || { _id: data._id }}
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
