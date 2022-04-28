//main tools
import { useState, useEffect, useRef } from 'react'
import { getSession } from 'next-auth/react'

//components
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'
import FiltersModal from 'components/Families/modals/FiltersModal'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { Layout } from 'components/Layout'

// bootstrap icons
import {
  ArrowClockwise,
  Pencil,
  Search,
  Trash,
  FileEarmarkArrowDown,
} from 'react-bootstrap-icons'

// prime components
import { Toast } from 'primereact/toast'

//utils
import { schema } from 'components/UI/Organism/Families/utils'

//services
import FamiliesService from 'services/Families'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { GetServerSidePropsContext, NextPage } from 'next'
import { GetSSPropsType } from 'types'
import { FamilyDataType } from 'types/models/Family'

const FamilyPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
}) => {
  const [showSearcher, setShowSearcher] = useState(false)
  const [familyToEdit, setFamilyToEdit] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const filter = schema.map((item) => item.field)
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [families, setFamilies] = useState([])
  const [error, setError] = useState('')
  const toast = useRef<Toast>(null)

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setFamilyToEdit(data[0])
    setShowEdit(true)
  }

  /**
   * handle show create family form
   */
  const handleCreate = () => setShowCreate(true)

  /**
   * handle delete selected families
   */
  const handleDeleteMany = () =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            const { response } = await FamiliesService.deleteMany(
              session?.token as string,
              selected.map((family: FamilyDataType) => family._id as string)
            )
            if (!response) {
              setSelected([])
              getFamilies()
            } else setError(response.data?.message)
          }}
          reject={() => setSelected([])}
        />
      ),
    })

  /**
   * handle fetch for get all families
   */
  const getFamilies = async () => {
    setLoading(true)
    const { data, response } = await FamiliesService.getFamilies(
      session?.token as string
    )
    if (!response) setFamilies(data)
    else setError(response.data?.message)
    setLoading(false)
  }

  /**
   * handle get families on change values
   * for showCreate and showEdit fields
   */
  useEffect(() => {
    ;(async () => await getFamilies())()
  }, [showCreate, showEdit])

  return (
    <Layout setError={setError} error={error} loading={loading}>
      <h1 className={classes.title}>Families</h1>
      {!showEdit && !showCreate && (
        <DataTable
          schema={schema}
          value={families}
          loading={loading}
          selection={selected}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            delete: { action: handleDeleteMany, icon: Trash },
            Export: { action: () => {}, icon: FileEarmarkArrowDown },
            create: { action: handleCreate, icon: Pencil },
            reload: { action: getFamilies, icon: ArrowClockwise },
            Search: { action: () => {}, icon: Search },
          }}
        />
      )}
      {showCreate && <p onClick={() => setShowCreate(false)}>Create</p>}
      {showEdit && <p onClick={() => setShowEdit(false)}>Edit</p>}
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
