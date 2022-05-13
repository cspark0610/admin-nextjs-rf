//main tools
import { ChangeEvent, FC, useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
//bootstrap or primereact components
import { Col, Container, Row } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
//styles
import classes from 'styles/Families/page.module.scss'
//services
import { DocumentService } from 'services/Documents'
//types
import { DocumentDataType } from 'types/models/Documents'
import { FamilyDataType } from 'types/models/Family'
import { kindOptions } from '../utils'
//interface
interface IEditDocuments {
  mode: 'edit' | 'create'
  data?: DocumentDataType
  setCloseModal: () => void
  familyData: FamilyDataType
  docToEdit?: DocumentDataType
}

export const EditDocuments: FC<IEditDocuments> = ({
  mode = 'create',
  setCloseModal,
  familyData,
  docToEdit = {
    name: '',
    remarks: '',
    isDeclaration: false,
    isPoliceCheck: false,
    kindOfOwner: '',
    firstName: '',
    lastName: '',
  },
}) => {
  //kind enum

  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const { data: session } = useSession()
  const [userFile, setUserFile] = useState<File | Blob | null>(null)
  const [documentType, setDocumentType] = useState<string | null>(null)
  const [owner, setowner] = useState<any>(docToEdit?.owner || {})
  const [editKind, setEditKind] = useState(false)
  const [editOwner, setEditOwner] = useState(false)
  const toast = useRef<any>(null)
  const [familyDocument, setFamilyDocument] = useState<any>(docToEdit)
  //On edit mode
  useEffect(() => {
    if (mode === 'edit' && !!docToEdit && !!docToEdit?.owner) {
      setFamilyDocument({
        ...docToEdit,
        kindOfOwner: docToEdit.owner.kind as string,
        lastName: docToEdit.owner.lastName as string,
        firstName: docToEdit.owner.firstName as string,
      })
      setowner(docToEdit.owner)
      handleDocumentTypeChange(
        docToEdit.isDeclaration === true ? 'isDeclaration' : 'isPoliceCheck'
      )
    }
    setFamilyMembers([
      ...[
        ...(familyData?.mainMembers as any),
        ...(familyData?.familyMembers as any),
      ]?.map((m) => ({
        ...m,
        fullName: `${m.firstName} ${m.lastName}`,
      })),
    ])
  }, [])

  //Set firstName and lastName before submit
  useEffect(() => {
    setFamilyDocument({
      ...familyDocument,
      firstName: owner?.firstName as string,
      lastName: owner?.lastName,
      fullName: `${owner?.firstName} ${owner?.lastName}`,
    })
  }, [owner])

  const handleDocumentTypeChange = (val: string) => {
    setDocumentType(val)
    if (val === 'isDeclaration') {
      setFamilyDocument({
        ...familyDocument,
        isDeclaration: true,
        isPoliceCheck: false,
      })
    } else if (val === 'isPoliceCheck') {
      setFamilyDocument({
        ...familyDocument,
        isDeclaration: false,
        isPoliceCheck: true,
      })
    }
  }

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | DropdownChangeParams
  ) => {
    setFamilyDocument({
      ...familyDocument,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    let fieldErrors = false
    let keyError = ''
    if (!!session?.token) {
      let submitData = { ...familyDocument, file: userFile }
      if (!familyDocument.firstName || !familyDocument.lastName) {
        keyError = 'Owner'
      }
      if (!familyDocument.isDeclaration && !familyDocument.isPoliceCheck) {
        keyError = 'document type'
      }
      if (!familyDocument.kindOfOwner) keyError = 'kind of owner'
      if (userFile === null) keyError = 'document file'
      if (keyError !== '') fieldErrors = true

      if (fieldErrors)
        toast.current.show({
          summary: `The ${keyError} is required`,
          severity: 'info',
        })
      if (!fieldErrors) {
        toast.current.show({
          summary: `Submitting the document`,
          severity: 'success',
        })
        if (mode === 'create')
          await DocumentService.createFamilyDocument(
            session?.token,
            familyData?._id as string,
            submitData
          )
        if (mode === 'edit')
          await DocumentService.updateFamilyDocument(
            session?.token,
            docToEdit?._id as string,
            submitData
          )
        setCloseModal()
      }
    }
  }

  return (
    <>
      <Container>
        <h2 className='mb-4'>
          {mode === 'create' ? 'Upload' : 'Edit'} document
        </h2>
        <Row className={classes.container}>
          <Col xs={12}>
            <FileUpload
              mode='basic'
              name='documentFile'
              accept='.pdf, .docx, .jpg, .jpeg, .png'
              maxFileSize={10000000}
              onSelect={(e) => setUserFile(e.files[0])}
              customUpload
              chooseLabel='Browse file'
            />
          </Col>
          <form onSubmit={handleSubmit}>
            <Col className={`${classes.col} my-4`} xs={12}>
              <p className='text-capitalize'>Name</p>
              <InputText
                required
                name='name'
                placeholder='myfile'
                value={familyDocument.name}
                className={classes.input}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col className={`${classes.col} my-4`} xs={12}>
              <p className='text-capitalize'>Description</p>
              <InputTextarea
                required
                name='remarks'
                placeholder='Description of the document...'
                value={familyDocument.remarks}
                className={classes.input}
                onChange={(e) => handleChange(e)}></InputTextarea>
            </Col>
            <Col xs={12} className={`${classes.col} mb-4`}>
              <p>Kind of owner</p>
              {(mode === 'edit' && editKind) || mode === 'create' ? (
                <Dropdown
                  appendTo='self'
                  optionLabel='name'
                  placeholder='Select a owner'
                  value={familyDocument.kindOfOwner}
                  className={classes.input}
                  onChange={(e) => {
                    setFamilyDocument({
                      ...familyDocument,
                      kindOfOwner: e.value,
                    })
                  }}
                  options={kindOptions}
                />
              ) : (
                <>
                  <InputText
                    value={
                      kindOptions.find((opt: any) => opt.value === owner?.kind)
                        ?.name as string
                    }
                    disabled
                  />
                  <Button onClick={() => setEditKind(true)}>Edit</Button>
                </>
              )}
            </Col>
            <Col xs={12}>
              <p>Owner</p>
              {(mode === 'edit' && editOwner) || mode === 'create' ? (
                <Dropdown
                  value={owner}
                  appendTo='self'
                  options={familyMembers}
                  className={classes.input}
                  onChange={(e) => {
                    setowner(e.value)
                  }}
                  optionLabel='fullName'
                  placeholder='Select a owner'
                />
              ) : (
                <>
                  <InputText
                    value={`${owner.firstName} ${owner.lastName}`}
                    disabled
                  />
                  <Button onClick={() => setEditOwner(true)}>Edit</Button>
                </>
              )}
            </Col>

            <Col>
              <div className='my-2'>
                <RadioButton
                  inputId='docType1'
                  name='docType'
                  value='isDeclaration'
                  onChange={(e) => handleDocumentTypeChange(e.value)}
                  checked={documentType === 'isDeclaration'}
                />
                <label htmlFor='docType1'>Declaration</label>
              </div>
              <div className='my-2'>
                <RadioButton
                  inputId='docType2'
                  name='docType'
                  value='isPoliceCheck'
                  onChange={(e) => handleDocumentTypeChange(e.value)}
                  checked={documentType === 'isPoliceCheck'}
                />
                <label htmlFor='docType2'>Police Check</label>
              </div>
            </Col>

            <Col md={12} className='mt-4'>
              <Button type='submit'>Submit</Button>
            </Col>
          </form>
        </Row>
      </Container>
      <Toast ref={toast} />
    </>
  )
}
