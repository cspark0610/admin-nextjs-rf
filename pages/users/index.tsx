// main tools
import { useState, useEffect, useRef } from 'react'
import { getSession } from 'next-auth/react'

// components
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'
import { CreateUser } from 'components/UI/Organism/Users/create'
import { UpdateUser } from 'components/UI/Organism/Users/update'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { Layout } from 'components/Layout'

// bootstrap icons
import { ArrowClockwise, Pencil, Trash } from 'react-bootstrap-icons'

// prime components
import { Toast } from 'primereact/toast'

// utils
import { schema } from 'components/UI/Organism/Users/utils'

//services
import { UsersService } from 'services/Users'

// styles
import classes from 'styles/Users/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { GetServerSidePropsContext, NextPage } from 'next'
import { UserDataType } from 'types/models/User'
import { GetSSPropsType } from 'types'

const UsersPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
}) => {
  const [showCreate, setShowCreate] = useState(false)
  const [userToEdit, setUserToEdit] = useState({})
  const filter = schema.map((item) => item.field)
  const [showEdit, setShowEdit] = useState(false)
  const [users, setUsers] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')
  const toast = useRef<Toast>(null)

  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setUserToEdit(data[0])
    setShowEdit(true)
  }
  const handleCreate = () => setShowCreate(true)

  const handleDeleteMany = () =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            const { response } = await UsersService.deleteMany(
              session?.token as string,
              selected.map((user: UserDataType) => user._id as string)
            )
            if (!response) {
              setSelected([])
              getUsers()
            } else setError(response.data?.message)
          }}
          reject={() => setSelected([])}
        />
      ),
    })

  const getUsers = async () => {
    setLoading(true)
    const { data, response } = await UsersService.getUsers(
      session?.token as string
    )
    if (!response) setUsers(data)
    else setError(response.data?.message)
    setLoading(false)
  }

  useEffect(() => {
    ;(async () => await getUsers())()
  }, [showCreate, showEdit])

  return (
    <Layout setError={setError} error={error} loading={loading}>
      <h1 className={classes.title}>Users</h1>
      {!showEdit && !showCreate && (
        <DataTable
          value={users}
          schema={schema}
          loading={loading}
          selection={selected}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            delete: { action: handleDeleteMany, icon: Trash },
            create: { action: handleCreate, icon: Pencil },
            reload: { action: getUsers, icon: ArrowClockwise },
          }}
        />
      )}
      {showCreate && (
        <CreateUser setShowCreate={setShowCreate} setError={setError} />
      )}
      {showEdit && (
        <UpdateUser
          userData={userToEdit}
          setShowEdit={setShowEdit}
          setError={setError}
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

export default UsersPage
