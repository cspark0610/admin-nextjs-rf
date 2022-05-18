//main tools
import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'

//bootstrap components
import {
  Col,
  Row,
  Button,
  Spinner,
  Container,
  ProgressBar,
} from 'react-bootstrap'

// prime components
import { InputTextarea } from 'primereact/inputtextarea'
import { RadioButton } from 'primereact/radiobutton'
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

//services
import { DocumentService } from 'services/Documents'

// utils
import { validateUpdateDocuments } from 'validations/updateFamilyData'
import { kindOptions } from '../utils'

//styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  FamilyDataType,
  TenantDataType,
  MainMemberDataType,
  ExternalStudentDataType,
} from 'types/models/Family'
import { DocumentDataType, DocumentOwnerDataType } from 'types/models/Documents'
import { RadioButtonChangeParams } from 'primereact/radiobutton'
import { FileUploadSelectParams } from 'primereact/fileupload'
import { DropdownChangeParams } from 'primereact/dropdown'
import { ChangeType, SetStateType } from 'types'
import { FC, ChangeEvent } from 'react'

type IEditDocuments = {
  idx: number
  action: string | null
  data: DocumentDataType
  familyData: FamilyDataType
  handleCloseCreate: () => void
  setReload: SetStateType<boolean>
}

export const EditDocuments: FC<IEditDocuments> = ({
  idx,
  data,
  action,
  setReload,
  familyData,
  handleCloseCreate,
}) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [uploadDocumentProcess, setUploadDocumentProcess] = useState(0)
  const [familyDocument, setFamilyDocument] = useState<DocumentDataType>(data)
  const [owners, setOwners] = useState<DocumentOwnerDataType[] | undefined>(
    undefined
  )

  const showErrors = (errors: string[]) =>
    toast.current?.show({
      severity: 'error',
      summary: 'Required fields',
      detail: (
        <ul>
          {errors.map((err, idx: number) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      ),
    })

  const formatOwners = (
    kind: string,
    members?: (MainMemberDataType | TenantDataType | ExternalStudentDataType)[]
  ) =>
    members?.map((member) => ({
      kind,
      _id: member._id,
      lastName:
        (member as MainMemberDataType).lastName ||
        (member as ExternalStudentDataType).name,
      firstName: (member as MainMemberDataType).firstName,
    }))

  const handleChange = (ev: ChangeType | ChangeEvent<HTMLTextAreaElement>) =>
    setFamilyDocument({ ...familyDocument, [ev.target.name]: ev.target.value })

  const handleSelectFile = (ev: FileUploadSelectParams) =>
    setFamilyDocument({ ...familyDocument, file: ev.files[0] })

  const handleOwnerChange = (ev: DropdownChangeParams) =>
    setFamilyDocument({ ...familyDocument, owner: ev.target.value })

  const handleKindOfOwnerChange = (ev: DropdownChangeParams) =>
    setFamilyDocument({
      ...familyDocument,
      owner: {
        ...familyDocument,
        _id: '',
        lastName: '',
        firstName: '',
        kind: ev.target.value,
      },
    })

  const handleDocumentTypeChange = (ev: RadioButtonChangeParams) => {
    const { name, checked } = ev.target
    const reset = { isPoliceCheck: false, isDeclaration: false }

    setFamilyDocument({ ...familyDocument, ...reset, [name]: checked })
  }

  const handleSave = async () => {
    const validationError = validateUpdateDocuments(familyDocument)
    if (validationError.length > 0) showErrors(validationError)
    else if (action === 'CREATE') {
      await DocumentService.createFamilyDocument(
        session?.token as string,
        familyData._id as string,
        { ...familyDocument, ...familyDocument.owner },
        setUploadDocumentProcess
      )

      setReload((prev) => !prev)
      handleCloseCreate()
    } else {
      await DocumentService.updateFamilyDocument(
        session?.token as string,
        data._id as string,
        { ...familyDocument, ...familyDocument.owner },
        setUploadDocumentProcess
      )

      setReload((prev) => !prev)
      handleCloseCreate()
    }
  }

  useEffect(() => {
    switch (familyDocument.owner?.kind) {
      case 'HOST':
        setOwners(
          formatOwners(familyDocument.owner?.kind, familyData.mainMembers)
        )
        break
      case 'FAMILY_MEMBER':
        setOwners(
          formatOwners(familyDocument.owner?.kind, familyData.familyMembers)
        )
        break
      case 'TENANT':
        setOwners(
          formatOwners(familyDocument.owner?.kind, familyData.tenantList)
        )
        break
      case 'STUDENT':
        setOwners(
          formatOwners(
            familyDocument.owner?.kind,
            familyData.noRedLeafStudentsList
          )
        )
        break
      case 'EXTERNAL_STUDENT':
        setOwners(
          formatOwners(
            familyDocument.owner?.kind,
            familyData.noRedLeafStudentsList
          )
        )
        break

      default:
        setOwners([])
        break
    }
  }, [familyData, familyDocument.owner?.kind])

  return (
    <Container>
      <h2 className='mb-4'>document</h2>
      <Row className={classes.container}>
        <Col className={classes.col} xs={12}>
          <FileUpload
            mode='basic'
            customUpload
            name='documentFile'
            maxFileSize={10000000}
            chooseLabel='Browse file'
            onSelect={handleSelectFile}
            accept='.pdf, .docx, .jpg, .jpeg, .png'
          />
          {familyDocument.file && typeof familyDocument.file === 'string' && (
            <p className='mt-3'>{familyDocument.file}</p>
          )}
        </Col>
        <Col className={classes.col} xs={12}>
          <InputText
            name='name'
            onChange={handleChange}
            className={classes.input}
            value={familyDocument?.name}
            placeholder='Document name'
          />
        </Col>
        <Col className={classes.col} xs={12}>
          <InputTextarea
            rows={5}
            name='remarks'
            placeholder='Description of the document...'
            value={familyDocument.remarks}
            className={classes.input}
            onChange={handleChange}
          />
        </Col>
        <Col className={classes.col} xs={12}>
          <h6>Kind of owner</h6>
          <Dropdown
            name='kind'
            appendTo='self'
            optionLabel='name'
            options={kindOptions}
            className={classes.input}
            placeholder='Select a owner'
            onChange={handleKindOfOwnerChange}
            value={familyDocument.owner?.kind}
          />
        </Col>
        <Col className={classes.col} xs={12}>
          <p>Owner</p>
          {owners === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              appendTo='self'
              options={owners}
              optionLabel='firstName'
              className={classes.input}
              value={familyDocument.owner}
              onChange={handleOwnerChange}
              placeholder='Select a owner'
            />
          )}
        </Col>
        <Col className={classes.col} xs={12}>
          <div className='my-2'>
            <RadioButton
              name='isDeclaration'
              inputId='isDeclaration'
              onChange={handleDocumentTypeChange}
              checked={familyDocument.isDeclaration as boolean}
            />
            <label className='ms-3' htmlFor='docType1'>
              Declaration
            </label>
          </div>
          <div className='my-2'>
            <RadioButton
              name='isPoliceCheck'
              inputId='isPoliceCheck'
              onChange={handleDocumentTypeChange}
              checked={familyDocument.isPoliceCheck}
            />
            <label className='ms-3' htmlFor='docType2'>
              Police Check
            </label>
          </div>
        </Col>
        <Col xs={12} className={`mb-4 ${classes.col}`}>
          <Button className={classes.button} onClick={handleSave}>
            Submit
          </Button>
        </Col>
        {uploadDocumentProcess > 0 && (
          <>
            <h5>Uploading files process</h5>
            <ProgressBar className='my-3' now={uploadDocumentProcess} />
          </>
        )}
      </Row>
      <Toast ref={toast} position='top-right' />
    </Container>
  )
}
