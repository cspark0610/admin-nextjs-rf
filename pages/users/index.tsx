// main tools
import { getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// components
import { DataTable } from 'components/UI/Molecules/Datatable'
import { Layout } from 'components/Layout'

import { ArrowClockwise, Pencil, Trash } from 'react-bootstrap-icons'

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
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])

  const handleEdit = ({ data }: DataTableRowEditParams) => {
    setUserToEdit(data[0])
    setShowEdit(true)
  }
  const handleCreate = () => {
    setUserToEdit({})
    setShowCreate(true)
  }
  const handleDeleteMany = async () => {
    const { data, response } = await UsersService.deleteMany(
      session?.token as string,
      selected.map((user: UserDataType) => user._id as string)
    )
    getUsers()
  }

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
  }, [])

  return (
    <Layout error={error} loading={loading}>
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
      {showCreate && <p onClick={() => setShowCreate(false)}>creating</p>}
      {showEdit && (
        <p onClick={() => setShowEdit(false)}>
          <>{console.log(userToEdit)}editing</>
        </p>
      )}
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
