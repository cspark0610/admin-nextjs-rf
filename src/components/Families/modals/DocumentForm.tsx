import React, { useRef, useState, useContext } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/client'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import FileUploader from 'components/UI/Atoms/FileUploader'
import { ProgressBar } from 'primereact/progressbar'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { classNames } from 'primereact/utils'
//context
import { FamilyContext } from 'context/FamilyContext'
//hooks
import useMembers from 'hooks/useMembers'
type DocumentData = {
  _id: string
  name: string
  remarks: string
  owner: {
    kind: string
    id: string
  }
}
interface Props {
  data?: DocumentData
  onSubmit: (params: any, id?: string) => void
}
const formatedKindOfOwner = {
  hosts: 'Host',
  Host: 'hosts',
  familyMembers: 'FamilyMember',
  FamilyMember: 'familyMembers',
  tenants: 'Tenant',
  Tenant: 'tenants',
  externalStudents: 'ExternalStudent',
  ExternalStudent: 'externalStudents',
}
const formatOwner = (owner) => {
  return {
    name: `${owner.firstName} ${owner.lastName}`,
    id: owner.id,
  }
}

const DocumentsForm: React.FC<Props> = ({ data, onSubmit }) => {
  const { family } = useContext(FamilyContext)
  const members = useMembers({})
  const toast = useRef(null)
  const [name, setName] = useState(data?.name || '')
  const [fileName, setFileName] = useState(data?.name || '')
  const [description, setDescription] = useState(data?.remarks || '')
  const [owner, setOwner] = useState(
    data ? formatOwner(data?.owner) : { name: '', id: '' }
  )
  const [kindOfOwner, setKindOfOwner] = useState(
    formatedKindOfOwner[data?.owner.kind] || ''
  )
  const [session] = useSession()
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  //errors
  const [fileError, setFileError] = useState('')
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [ownerError, setOwnerError] = useState('')

  const showSuccess = (msg) => {
    toast.current.show({
      severity: 'success',
      summary: 'Success Message',
      detail: msg,
      life: 3000,
    })
  }
  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error Message',
      detail: 'An error has ocurred',
      life: 3000,
    })
  }
  const kindOfOwnerInput = [
    {
      label: 'Host',
      name: 'hosts',
    },
    {
      label: 'Family Member',
      name: 'familyMembers',
    },
    {
      label: 'Tenant',
      name: 'tenants',
    },
    {
      label: 'External Student',
      name: 'externalStudents',
    },
  ]

  const validate = (file) => {
    const acceptedFormats =
      '.rar, .zip, .vbs, .bat, .exe, .cmd, .jar, .com, .sys, .dll, .swf, .js, .class, .wsc, .wsf, .wsh, .jse, .drv, .java, .php, .html, .jar, .htm, .swf, .do, .class, .pl, .rb, .py, .c, .cpp, .bash, .sh, .csh, .xml,  jse, .phps, .cfm, .inc, .phtml, .dhtml'

    let nameError = ''
    let ownerError = ''
    let descriptionError = ''
    let fileError = ''
    if (!fileName) {
      fileError = 'Upload a document is required'
      setFileError(fileError)
    }
    if (file.name) {
      for (const el of acceptedFormats.split(',')) {
        if (file.name.includes(el.trim())) {
          fileError = 'The document is not among the allowed formats'
          setFileError(fileError)
        }
      }
    }
    if (!name.trim()) {
      nameError = 'Name is required'
      setNameError(nameError)
    }
    if (!description.trim()) {
      descriptionError = 'Description is required'
      setDescriptionError(descriptionError)
    }
    if (nameError || ownerError || descriptionError || fileError) {
      return false
    }
    return true
  }

  const createDoc = (body) => {
    const msFamily = 'ms-fands'
    setIsLoading(true)
    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${family._id}/documents`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${session?.token}`,
      },
      data: body,
      onUploadProgress: (p) => {
        setProgress((p.loaded / p.total) * 100)
      },
    })
      .then(() => {
        showSuccess('Documents successfully created')
        onSubmit(true)
      })
      .catch((err) => {
        showError()
        console.error(err)
        onSubmit(false)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (owner.id && kindOfOwner) {
      formData.append('owner[kind]', formatedKindOfOwner[kindOfOwner])
      formData.append('owner[id]', owner.id)
    }
    if (validate(formData.get('file'))) {
      if (data) {
        onSubmit(formData, data._id)
      } else {
        createDoc(formData)
      }
    }
  }
  const getFormErrorMessage = (error: string) => {
    return <small className='p-error'>{error}</small>
  }
  return (
    <form onSubmit={handleSubmit}>
      <InputContainer
        label='Upload file'
        labelClass={classNames({ 'p-error': fileError })}
      >
        <FileUploader
          id='file'
          name='file'
          placeholder='Upload document'
          onChange={(e) => {
            setFileName(e.target.files[0].name)
          }}
        />
        <p>{fileName ? fileName : "You haven't uploaded a Document yet"}</p>
        {getFormErrorMessage(fileError)}
      </InputContainer>
      <InputContainer
        label='Name'
        labelClass={classNames({ 'p-error': nameError })}
      >
        <InputText
          placeholder='Document name'
          name='name'
          className={classNames({ 'p-invalid': nameError })}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        {getFormErrorMessage(nameError)}
      </InputContainer>
      <InputContainer label='kind of owner'>
        <Dropdown
          id='kindOfOwner'
          options={kindOfOwnerInput}
          optionLabel='label'
          value={kindOfOwner}
          onChange={(e) => {
            setKindOfOwner(e.target.value)
          }}
          optionValue='name'
          placeholder='Select kind of owner'
        />
      </InputContainer>
      <InputContainer
        label='Owner'
        labelClass={classNames({ 'p-error': ownerError })}
      >
        <Dropdown
          optionLabel='name'
          options={members[kindOfOwner] || []}
          placeholder='Select owner'
          className={classNames({ 'p-invalid': ownerError })}
          value={owner}
          onChange={(e) => {
            setOwner(e.value)
          }}
        />
        {getFormErrorMessage(ownerError)}
      </InputContainer>
      <InputContainer
        label='Description'
        labelClass={classNames({ 'p-error': descriptionError })}
      >
        <InputTextarea
          name='remarks'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          className={classNames({ 'p-invalid': descriptionError })}
          placeholder='Describe the documents...'
          rows={5}
          cols={30}
          autoResize
        />
        {getFormErrorMessage(descriptionError)}
      </InputContainer>
      {isLoading && (
        <ProgressBar
          style={{ margin: '1em 0' }}
          value={Math.round(progress)}
        ></ProgressBar>
      )}
      <div>
        <Button type='submit'>Save</Button>
      </div>
      <Toast ref={toast} />
    </form>
  )
}
export default DocumentsForm
