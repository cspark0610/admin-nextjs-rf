import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Col, Container, Modal, Row } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'

import classes from 'styles/Families/page.module.scss'

import { DocumentService } from 'services/Documents'

import { DocumentDataType } from 'types/models/Documents'
import { FamilyDataType } from 'types/models/Family'
interface IEditDocuments {
  mode: 'edit' | 'create'
  data?: DocumentDataType
  showModal: boolean
  familyData: FamilyDataType
}

export const EditDocuments: FC<IEditDocuments> = ({
  mode = 'create',
  showModal = true,
  familyData,
}) => {
  const { data: session } = useSession()
  const [show, setShow] = useState(showModal)
  const [userFile, setUserFile] = useState<File | Blob | null>(null)
  const [documentType, setDocumentType] = useState<string | null>(null)
  const [owner, setowner] = useState<any>({})
  const [familyDocument, setFamilyDocument] = useState({
    name: '',
    remarks: '',
    isDeclaration: false,
    isPoliceCheck: false,

    kindOfOwner: '',
    firstName: '',
    lastName: '',
  })

  useEffect(() => {
    setFamilyDocument({
      ...familyDocument,

      firstName: owner?.firstName,
      lastName: owner?.lastName,
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
    if (!!session?.token && mode === 'create') {
      console.log(userFile)
      const documentFormData = new FormData()
      documentFormData.append('file', userFile as Blob)
      documentFormData.append('name', familyDocument.name as string)
      documentFormData.append('remarks', familyDocument.remarks as string)
      documentFormData.append(
        'isPoliceCheck',
        familyDocument.isPoliceCheck.toString() as string
      )
      documentFormData.append(
        'isDeclaration',
        familyDocument.isDeclaration.toString() as string
      )
      documentFormData.append('kind', familyDocument.kindOfOwner as string)
      documentFormData.append('firstName', familyDocument.firstName as string)
      documentFormData.append('lastName', familyDocument.lastName as string)

      await DocumentService.createFamilyDocument(
        session?.token,
        familyData?._id as string,
        documentFormData
      )
    }
  }

  return (
    <>
      <Container>
        <h1 className='mb-4'>Upload document</h1>
        <Row>
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
              name='remarks'
              placeholder='Description of the document...'
              value={familyDocument.remarks}
              className={classes.input}
              onChange={(e) => handleChange(e)}></InputTextarea>
          </Col>

          <Col xs={12} className='mb-4'>
            <p>Kind of owner</p>
            <Dropdown
              value={familyDocument.kindOfOwner}
              options={[
                { value: 'Host' },
                { value: 'Family Member' },
                { value: 'Tenant' },
                { value: 'External Student' },
              ]}
              className={classes.input}
              onChange={(e) => {
                setFamilyDocument({ ...familyDocument, kindOfOwner: e.value })
              }}
              optionLabel='value'
              placeholder='Select a owner'
            />
          </Col>
          <Col xs={12}>
            <p>Owner</p>
            <Dropdown
              value={owner}
              options={familyData.mainMembers}
              className={classes.input}
              onChange={(e) => {
                setowner(e.value)
              }}
              optionLabel='firstName'
              placeholder='Select a owner'
            />
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
            <Button onClick={handleSubmit}>Submit</Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}
