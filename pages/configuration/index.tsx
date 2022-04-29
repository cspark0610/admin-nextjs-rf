// main tools
import { useState, useEffect, useRef } from 'react'
import { getSession } from 'next-auth/react'

// components
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'
import { CreateGeneric } from 'components/UI/Organism/Generics/create'
import { UpdateGeneric } from 'components/UI/Organism/Generics/update'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { Layout } from 'components/Layout'

// bootstrap components
import { Row, Col } from 'react-bootstrap'
import { ArrowClockwise, Pencil, Trash } from 'react-bootstrap-icons'

// prime components
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'

// utils
import { schema, modelNames } from 'components/UI/Organism/Generics/utils'

//services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Config/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { GetServerSidePropsContext, NextPage } from 'next'
import { GenericDataType } from 'types/models/Generic'
import { GetSSPropsType } from 'types'

const GenericsPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
}) => {
  const [modelname, setModelname] = useState({
    name: 'Academic courses',
    model: 'academicCourse',
    url: 'academic-courses',
  })
  const [genericToEdit, setGenericToEdit] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [generics, setGenerics] = useState(undefined)
  const filter = schema.map((item) => item.field)
  const [showEdit, setShowEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')
  const toast = useRef<Toast>(null)

  /**
   * handle ser generic to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setGenericToEdit(data[0])
    setShowEdit(true)
  }

  /**
   * handle show create form
   */
  const handleCreate = () => setShowCreate(true)

  /**
   * handle delete many generics
   */
  const handleDeleteMany = () =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            const { response } = await GenericsService.deleteMany(
              session?.token as string,
              modelname.url,
              selected.map((generic: GenericDataType) => generic._id as string)
            )
            if (!response) {
              setSelected([])
              getGeneric()
            } else setError(response.data?.message)
          }}
          reject={() => setSelected([])}
        />
      ),
    })

  /**
   * handle request for get generics
   */
  const getGeneric = async () => {
    setLoading(true)
    const { data, response } = await GenericsService.getAllByModelnames(
      session?.token as string,
      [modelname.model]
    )
    if (!response) setGenerics(data[modelname.model])
    else setError(response.data?.message)
    setLoading(false)
  }

  /**
   * handle get generics on every change of
   * model, showcreate and showEdit fields
   */
  useEffect(() => {
    ;(async () => await getGeneric())()
    setSelected([])
  }, [modelname, showCreate, showEdit])

  return (
    <Layout setError={setError} error={error} loading={loading}>
      <h1 className={classes.title}>Generics</h1>
      {!showEdit && !showCreate && (
        <>
          <Row>
            <Col xs={12} sm={3}>
              <h3 className={`me-5 ${classes.subtitle}`}>Choose generic</h3>
              <Dropdown
                value={modelname}
                optionLabel='name'
                options={modelNames}
                className={classes.input}
                onChange={(ev) => setModelname(ev.value)}
              />
            </Col>
          </Row>
          <DataTable
            schema={schema}
            value={generics}
            loading={loading}
            selection={selected}
            selectionMode='checkbox'
            onRowEditChange={handleEdit}
            globalFilterFields={filter as string[]}
            onSelectionChange={(e) => setSelected(e.value)}
            actions={{
              Delete: { action: handleDeleteMany, icon: Trash },
              Create: { action: handleCreate, icon: Pencil },
              Reload: { action: getGeneric, icon: ArrowClockwise },
            }}
          />
        </>
      )}
      {showCreate && (
        <CreateGeneric
          model={modelname}
          setError={setError}
          setShowCreate={setShowCreate}
        />
      )}
      {showEdit && (
        <UpdateGeneric
          model={modelname}
          setError={setError}
          generic={genericToEdit}
          setShowEdit={setShowEdit}
        />
      )}
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

export default GenericsPage
