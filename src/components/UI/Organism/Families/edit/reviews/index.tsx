//main tools
import { useState, useEffect } from 'react'
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
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// services
import { ReviewsService } from 'services/Reviews'

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
  const filter = schema.map((item) => item.field)
  const { data: session, status } = useSession()
  const [selected, setSelected] = useState([])

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setReviewToEdit(data[0])
    setShowEdit(true)
  }

  /**
   * handle show create review
   */
  const handleCreate = () => setShowCreate(true)

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
      {!showEdit && !showCreate && (
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
            // Delete: { action: handleDeleteMany, icon: Trash, danger: true },
            Create: { action: handleCreate, icon: Pencil },
            // Reload: { action: getFamilies, icon: ArrowClockwise },
          }}
        />
      )}
    </Container>
  )
}
