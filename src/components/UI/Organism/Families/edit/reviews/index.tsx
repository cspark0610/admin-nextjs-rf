//main tools
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

// components
import { DataTable } from 'components/UI/Molecules/Datatable'

// bootstrap components
import { Trash, Pencil, ArrowClockwise } from 'react-bootstrap-icons'
import { Container, Row, Col, Spinner, Modal } from 'react-bootstrap'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
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
import { ReviewsData } from './ReviewsData'

type UpdateReviewsProps = {
  setError: SetStateType<string>
  data: FamilyDataType
}

export const UpdateReviews: FC<UpdateReviewsProps> = ({ data, setError }) => {
  const [reviews, setReviews] = useState<ReviewDataType[] | undefined>(
    undefined
  )
  const [reviewToEdit, setReviewToEdit] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const filter = schema.map((item) => item.field)
  const { data: session, status } = useSession()
  const [selected, setSelected] = useState([])
  const toast = useRef<Toast>(null)
  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setReviewToEdit(data[0])
    setShowEdit(true)
    setShowModal(true)
  }

  /**
   * handle show create review
   */
  const handleCreate = () => {
    setShowCreate(true)
    setShowModal(true)
  }

  const handleGetFamilyReviews = async () => {
    const res = await ReviewsService.getReviewsFromAFamily(
      session?.token as string,
      data?._id as string
    )

    if (res.data.length > 0) {
      setReviews(res.data)
    }
  }

  const handleDeleteMany = () => {
    if (selected.length > 0)
      confirmDialog({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept: async () => {
          const res = await ReviewsService.bulkDeleteReview(
            session?.token as string,
            data._id as string,
            selected.map((s: any) => s._id)
          )
          if (!!res) {
            toast.current?.show({
              severity: 'success',
              summary: 'Confirmed',
              detail: 'Selected reviews are deleted',
              life: 3000,
            })
          }
        },
        reject: () => {
          toast.current?.show({
            severity: 'warn',
            summary: 'Rejected',
            detail: 'You have rejected',
            life: 3000,
          })
        },
      })
    else
      toast.current?.show({
        severity: 'warn',
        summary: 'No items',
        detail: 'You need select at least one item to delete',
        life: 3000,
      })
  }

  const handleCloseModal = () => {
    setShowCreate(false)
    setShowEdit(false)
    setShowModal(false)
    handleGetFamilyReviews()
  }
  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const res = await ReviewsService.getReviewsFromAFamily(
          session.token as string,
          data._id as string
        )
        if (!res.data) setError(res.response.data.error)
        else setReviews(res.data)
      })()
    }
  }, [session, status, data, setError])

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
          Delete: { action: handleDeleteMany, icon: Trash, danger: true },
          Create: { action: handleCreate, icon: Pencil },
          Reload: { action: handleGetFamilyReviews, icon: ArrowClockwise },
        }}
      />

      <Modal
        size='xl'
        show={showModal}
        onHide={handleCloseModal}
        contentClassName={classes.modal}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body>
          {showCreate && !showEdit && (
            <ReviewsData
              setCloseModal={handleCloseModal}
              familyId={data._id as string}
            />
          )}
          {!showCreate && showEdit && (
            <ReviewsData
              setCloseModal={handleCloseModal}
              familyId={data._id as string}
              review={reviewToEdit}
            />
          )}
        </Modal.Body>
      </Modal>
      <ConfirmDialog />
      <Toast ref={toast} />
    </Container>
  )
}
