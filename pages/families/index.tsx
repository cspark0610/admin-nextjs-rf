//main tools
import { useState, useEffect, useRef, useCallback } from 'react'
import { getSession } from 'next-auth/react'

//components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { CreateFamily } from 'components/UI/Organism/Families/create'
import { EditFamilies } from 'components/UI/Organism/Families/edit'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { Layout } from 'components/Layout'

// bootstrap icons
import {
  FileEarmarkArrowDown,
  ArrowClockwise,
  Pencil,
  Search,
  Trash,
} from 'react-bootstrap-icons'

// prime components
import { Toast } from 'primereact/toast'

//utils
import { schema } from 'components/UI/Organism/Families/utils'

//services
import { FamiliesService } from 'services/Families'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { GetServerSidePropsContext, NextPage } from 'next'
import { FamilyDataType } from 'types/models/Family'
import { GetSSPropsType } from 'types'

const FamilyPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
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
  const handleSearch = () => setShowSearcher(!showSearcher)

  /**
   * handle show create family form
   */
  const handleCreate = () => setShowCreate(true)

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
      [
        'home',
        'labels',
        'pets.type',
        'schools.school',
        'rulesForStudents',
        'tenantList.gender',
        'schools.transports',
        'familyMembers.gender',
        'tenantList.occupation',
        'welcomeStudentGenders',
        'mainMembers.occupation',
        'familyMembers.situation',
        'noRedLeafStudentsList.gender',
        'familyMembers.spokenLanguages',
        'familyInternalData.localManager',
        'familyMembers.familyRelationship',
        'noRedLeafStudentsList.nationality',
        'familyInternalData.availablePrograms',
      ]
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
    ;(async () => await getFamilies())()
  }, [showCreate, showEdit, getFamilies])

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
            Delete: {
              action: () => setShowConfirmation(true),
              icon: Trash,
              danger: true,
            },
            // Export: { action: () => {}, icon: FileEarmarkArrowDown },
            Create: { action: handleCreate, icon: Pencil },
            Reload: { action: getFamilies, icon: ArrowClockwise },
            // Search: { action: handleSearch, icon: Search },
          }}
        />
      )}
      {showCreate && (
        <CreateFamily setShowCreate={setShowCreate} setError={setError} />
      )}
      {showEdit && (
        <EditFamilies
          data={familyToEdit}
          setError={setError}
          setShowEdit={setShowEdit}
        />
      )}
      <ToastConfirmation
        accept={accept}
        visible={showConfirmation}
        reject={() => setShowConfirmation(false)}
        onHide={() => setShowConfirmation(false)}
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
