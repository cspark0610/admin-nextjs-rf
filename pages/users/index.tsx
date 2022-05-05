// main tools
import { useState, useEffect, useRef, useCallback } from 'react'
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

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setUserToEdit(data[0])
    setShowEdit(true)
  }

  /**
   * handle show create user form
   */
  const handleCreate = () => setShowCreate(true)

  /**
   * handle delete selected users
   */
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

  /**
   * handle fetch for get all users
   */
  const getUsers = useCallback(async () => {
    setLoading(true)
    const { data, response } = await UsersService.getUsers(
      session?.token as string
    )
    if (!response) setUsers(data)
    else setError(response.data?.message)
    setLoading(false)
  }, [session])

  /**
   * handle get users on change values
   * for showCreate and showEdit fields
   */
  useEffect(() => {
    ;(async () => await getUsers())()
  }, [showCreate, showEdit, getUsers])

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
            Delete: { action: handleDeleteMany, icon: Trash, danger: true },
            Create: { action: handleCreate, icon: Pencil },
            Reload: { action: getUsers, icon: ArrowClockwise },
          }}
        />
      )}
      {showCreate && (
        <CreateUser setShowCreate={setShowCreate} setError={setError} />
      )}
      {showEdit && (
        <UpdateUser
          setError={setError}
          userData={userToEdit}
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

export default UsersPage
