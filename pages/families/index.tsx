//main tools
import { useState, useEffect, useRef, useCallback } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

//components
import {
  AdvancedSearch,
  INITIAL_FILTER_STATE,
} from '@organisms/Families/AdvancedSearch/AdvancedSearch'
import { ToastConfirmation } from '@atoms/toastConfirmation'
import { CreateFamily } from '@organisms/Families/create'
import { DataTable } from '@molecules/Datatable'
import { Layout } from 'components/Layout'

// bootstrap icons
import {
  Trash,
  Pencil,
  Search,
  CloudUpload,
  ArrowClockwise,
  FileEarmarkArrowDown,
} from 'react-bootstrap-icons'
import { Button, Col, Row } from 'react-bootstrap'

// prime components
import { Toast } from 'primereact/toast'

//utils
import { schema } from '@organisms/Families/utils'
import { exportCsv } from 'utils/exportCsv'
//services
import { FamiliesService } from 'services/Families'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { FilterFamilyDataType } from 'types/models/Family'
import { GetServerSidePropsContext, NextPage } from 'next'
import { FamilyDataType } from 'types/models/Family'
import { GetSSPropsType } from 'types'

const FamilyPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [families, setFamilies] = useState<FamilyDataType[]>([])
  const [showSearcher, setShowSearcher] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const filter = schema.map((item) => item.field)
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { push, query } = useRouter()
  const toast = useRef<Toast>(null)

  const formatFamilies =
    families?.map((family: FamilyDataType) => ({
      ...family,
      familyInternalData: {
        ...(family?.familyInternalData || {}),
        localManager: family?.familyInternalData?.localManager || {
          firstName: 'Not assigned',
        },
      },
    })) || []

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    const [family] = data
    push(`/families/${family._id || family.id}`)
  }

  /**
   * handle show create family form
   */
  const handleCreate = () => setShowCreate(true)

  /**
   * handle show advanced search modal
   */
  const handleSearch = () => setShowSearcher(true)

  const handleSearchFamilies = useCallback(
    async (filter: FilterFamilyDataType) => {
      setLoading(true)
      const { data } = await FamiliesService.searchFamilies(
        session?.token as string,
        { size: 5, page: 0, options: filter }
      )

      setFamilies(
        data?.hits?.hits?.map(
          (family: { _source: FamilyDataType }) => family?._source
        )
      )
      setLoading(false)
    },
    [session?.token]
  )

  /**
   * Handle export csv
   */

  const handleExportCsv = async () => {
    if (selected.length > 0) {
      const res = await FamiliesService.exportFamiliesToCsv(
        session?.token as string,
        selected.map((family: FamilyDataType) => family?._id as string)
      )
      if (res?.data) {
        exportCsv(res.data)
        toast.current?.show({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Families successfully exported!',
          life: 3000,
        })
      } else {
        toast.current?.show({
          severity: 'danger',
          summary: 'Error',
          detail: 'An error has ocurred',
          life: 3000,
        })
      }
    } else {
      alert('You need to select the families to export')
    }
  }

  /**
   * handle delete selected families
   */
  const accept = async () => {
    const { response } = await FamiliesService.deleteMany(
      session?.token as string,
      selected.map((family: FamilyDataType) => family._id as string)
    )
    if (!response) {
      setSelected([])
      getFamilies()
    } else setError(response.data?.message)
    setShowConfirmation(false)
  }

  /**
   * handle fetch for get all families
   */
  const getFamilies = useCallback(async () => {
    setLoading(true)
    const { data, response } = await FamiliesService.getFamilies(
      session?.token as string,
      ['home', 'user', 'familyInternalData.localManager']
    )

    window.localStorage.setItem(
      'lastFilter',
      JSON.stringify(INITIAL_FILTER_STATE)
    )

    if (!response) setFamilies(data)
    else setError(response.data?.message)
    setLoading(false)
  }, [session])

  /**
   * handle get families on change values
   * for showCreate and showEdit fields
   */
  useEffect(() => {
    ;(async () => {
      if (query.getLatestFilter) {
        const latestFilterStringify = window.localStorage.getItem('lastFilter')
        const latestFilter = await JSON.parse(latestFilterStringify || '')
        handleSearchFamilies(latestFilter)
      } else await getFamilies()
    })()
  }, [query, showCreate, getFamilies, handleSearchFamilies])

  return (
    <Layout setError={setError} error={error} loading={loading}>
      <Row className='mb-5'>
        <h1 className={classes.title}>Families</h1>
        <Col>
          <Link href='/families/import' passHref>
            <Button className={`${classes.button_back} py-2`}>
              {' '}
              <CloudUpload size={30} className='me-3' /> Import families
            </Button>
          </Link>
        </Col>
      </Row>
      {!showCreate && (
        <DataTable
          schema={schema}
          loading={loading}
          selection={selected}
          value={formatFamilies}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Delete: {
              action: () => setShowConfirmation(true),
              icon: Trash,
              danger: true,
            },
            ExportCsv: { action: handleExportCsv, icon: FileEarmarkArrowDown },
            Create: { action: handleCreate, icon: Pencil },
            Reload: { action: getFamilies, icon: ArrowClockwise },
            Search: { action: handleSearch, icon: Search },
          }}
        />
      )}
      {showCreate && (
        <CreateFamily setShowCreate={setShowCreate} setError={setError} />
      )}
      <ToastConfirmation
        accept={accept}
        visible={showConfirmation}
        reject={() => setShowConfirmation(false)}
        onHide={() => setShowConfirmation(false)}
      />
      <AdvancedSearch
        showSearcher={showSearcher}
        setShowSearcher={setShowSearcher}
        handleSearch={handleSearchFamilies}
      />
      <Toast ref={toast} position='top-center' />
    </Layout>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx)
  if (!session)
    return { redirect: { destination: '/login', permanent: false }, props: {} }

  return { props: { session } }
}

export default FamilyPage
