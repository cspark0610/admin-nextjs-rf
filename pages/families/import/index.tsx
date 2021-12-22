// main tools
import { useState } from 'react'
import { getSession } from 'next-auth/client'

// prime components
import { FileUpload } from 'primereact/fileupload'

// components
import Layout from 'components/Layout'
import { emptyTemplate } from 'components/UI/Atoms/uploadFiles/emptyTemplate'
import { itemTemplate } from 'components/UI/Atoms/uploadFiles/itemTemplate'
import { ResumeTable } from 'components/UI/Atoms/uploadFiles/resumeTable'

// services
import FamiliesServices from 'services/Families'

// styles
import classes from 'styles/Families/import.module.scss'

// types
import { NextPage, GetServerSidePropsContext } from 'next'
import { FileUploadUploadParams } from 'primereact/fileupload'

const ImportFamiliesPage: NextPage<{ session: any }> = ({ session }) => {
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState([])
  const [loading, setLoading] = useState(false)
  const acceptedFiles = 'application/json'
  const chooseOptions = {
    icon: 'pi pi-fw pi-file',
    className: 'p-button-rounded p-button-outlined',
  }
  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    className: 'p-button-success p-button-rounded p-button-outlined',
  }
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    className: 'p-button-danger p-button-rounded p-button-outlined',
  }

  const formatError = (user: string, message: string) => ({
    status: 'Error',
    user,
    message,
  })
  const formatSuccess = (user: string, message: string) => ({
    status: 'Success',
    user,
    message,
  })

  const handleUpload = (ev: FileUploadUploadParams) => {
    setErrors([])
    setSuccess([])

    const reader = new FileReader()
    for (const file of ev.files) {
      if (file.type === acceptedFiles) {
        setLoading(true)
        reader.readAsBinaryString(file)
        reader.onload = async (ev) => {
          const { result: fileContent } = ev.target
          const isArray = (fileContent as string).startsWith('[')
          const res = await FamiliesServices.importFamilies(
            session.token,
            JSON.parse(fileContent as string)
          )
          setLoading(false)
          if (isArray) {
            setErrors(
              res.error.map((err) =>
                formatError(err.primaryHostEmail, err.error)
              )
            )
            setSuccess(
              res.success.map((sc) =>
                formatSuccess(sc.user.email, 'created successfully')
              )
            )
          } else {
            if (res.isError)
              setErrors([formatError(res.primaryHostEmail, res.error)])
            else
              setSuccess([
                formatSuccess(res.user.email, 'created successfully'),
              ])
          }
        }
      }
    }
  }

  return (
    <Layout>
      <h1>Import Families</h1>
      <FileUpload
        multiple
        uploadLabel='Import'
        onUpload={handleUpload}
        emptyTemplate={emptyTemplate}
        itemTemplate={itemTemplate}
        accept={acceptedFiles}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        className={classes.uploader}
      />
      <ResumeTable loading={loading} value={[...errors, ...success]} />
    </Layout>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  return { props: { session } }
}

export default ImportFamiliesPage
