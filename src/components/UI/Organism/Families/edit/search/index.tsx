// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// bootstrap components
import { Container, Row, Col, Spinner, Modal } from 'react-bootstrap'
import { Trash, Pencil } from 'react-bootstrap-icons'

// prime components
import { MultiSelect } from 'primereact/multiselect'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { PublicUrlsData } from './publicUrlsData'

// utils
import { schema } from './utils'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// services
import { FamiliesService } from 'services/Families'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { FamilyDataType, FamilyPublicUrlDataType } from 'types/models/Family'
import { DropdownChangeParams } from 'primereact/dropdown'
import { ChangeType, SetStateType } from 'types'
import { FC, Dispatch } from 'react'

type UpdateSearchProps = {
  data: FamilyDataType
  setError: SetStateType<string>
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const UpdateSearch: FC<UpdateSearchProps> = ({
  data,
  dispatch,
  setError,
}) => {
  const [reload, setReload] = useState(false)
  const [urlIndex, setUrlIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const { data: session, status } = useSession()
  const filter = schema.map((item) => item.field)
  const { label: labels } = useGenerics(['label'])
  const [showUrlData, setShowUrlData] = useState(false)
  const [action, setAction] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [urls, setUrls] = useState<FamilyPublicUrlDataType[] | undefined>(
    undefined
  )

  /**
   * handle change family info and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'familyInfo', payload: { ev } })

  /**
   * handle show create document
   */
  const handleCreate = () => {
    setUrlIndex(urls?.length as number)
    setAction('CREATE')
    setShowUrlData(true)
  }

  /**
   * handle delete many documents
   */
  const accept = async () => {
    const urlsIdx: string[] = selected.map(({ _id }) => _id ?? '')

    await FamiliesService.deleteManyPublicUrls(
      session?.token as string,
      urlsIdx
    )

    setUrls(urls?.filter(({ _id }) => !urlsIdx.includes(_id as string)) || [])
  }

  /**
   * handle close modal
   */
  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE')
        setUrls(urls?.filter((_, idx) => idx !== urlIndex))
    }
    setUrlIndex(0)
    setAction(null)
    setShowUrlData(false)
  }

  /**
   * handle get documents
   */
  useEffect(() => {
    setUrls(undefined)
    if (status === 'authenticated') {
      ;(async () => {
        const res = await FamiliesService.getFamilyPublicUrls(
          session?.token as string,
          data._id as string
        )
        if (!res?.data) setError(res?.response?.data?.error)
        else setUrls(res?.data)
      })()
    }
  }, [status, session?.token, data._id, reload, setError])

  return (
    <Container fluid className={classes.container}>
      <h2 className={classes.subtitle}>Search</h2>
      <Row>
        <Col className={classes.col} xs={12} md={6}>
          <h2 className={classes.subtitle}>Tags</h2>
          {labels === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <>
              <MultiSelect
                filter
                showClear
                display='chip'
                name='labels'
                options={labels}
                optionLabel='name'
                value={data.labels}
                placeholder='Select'
                onChange={handleChange}
                className={classes.input}
              />
            </>
          )}
        </Col>
        <Col className={`mt-4 ${classes.col}`} xs={12}>
          <h2 className={classes.subtitle}>Family shareable URLs</h2>
          <DataTable
            value={urls}
            schema={schema}
            selection={selected}
            selectionMode='checkbox'
            loading={data === undefined}
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
        </Col>
      </Row>
      <Modal
        size='xl'
        show={showUrlData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body>
          <PublicUrlsData
            data={{}}
            familyData={data}
            setReload={setReload}
            handleCloseCreate={handleCloseCreate}
          />
        </Modal.Body>
      </Modal>
      <ToastConfirmation
        accept={accept}
        visible={showConfirmation}
        reject={() => setShowConfirmation(false)}
        onHide={() => setShowConfirmation(false)}
      />
    </Container>
  )
}
