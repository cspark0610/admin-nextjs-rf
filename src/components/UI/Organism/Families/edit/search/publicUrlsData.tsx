//main tools
import { useSession } from 'next-auth/react'
import { useState, useRef } from 'react'
import dayjs from 'dayjs'

//bootstrap components
import { Col, Row, Button, Container } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'

//services
import { FamiliesService } from 'services/Families'

// utils
import { validatePublicUrlData } from 'validations/updateFamilyData'

//styles
import classes from 'styles/Families/page.module.scss'

// types
import { FamilyDataType, FamilyPublicUrlDataType } from 'types/models/Family'
import { CalendarChangeParams } from 'primereact/calendar'
import { ChangeType, SetStateType } from 'types'
import { FC } from 'react'

type PublicUrlsDataProps = {
  familyData: FamilyDataType
  data: FamilyPublicUrlDataType
  handleCloseCreate: () => void
  setReload: SetStateType<boolean>
}

export const PublicUrlsData: FC<PublicUrlsDataProps> = ({
  data,
  setReload,
  familyData,
  handleCloseCreate,
}) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [publicUrl, setPublicUrl] = useState<FamilyPublicUrlDataType>(data)

  /**
   * disable google's autocomplete attribute
   */
  const disableAutocomplete = (ref: InputText | HTMLInputElement | null) => {
    if (ref) (ref as HTMLInputElement).autocomplete = 'disabled'
  }

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

  const handleChange = (ev: ChangeType | CalendarChangeParams) =>
    setPublicUrl({ ...publicUrl, [ev.target.name]: ev.target.value })

  const handleSave = async () => {
    const validationError = validatePublicUrlData(publicUrl)
    if (validationError.length > 0) showErrors(validationError)
    else {
      await FamiliesService.createFamilyPublicUrl(
        session?.token as string,
        familyData._id as string,
        publicUrl
      )

      setReload((prev) => !prev)
      handleCloseCreate()
    }
  }

  return (
    <Container>
      <h2 className='mb-4'>Family public profile</h2>
      <Row className={classes.container}>
        <Col className={classes.col} xs={12} md={6}>
          <InputText
            name='name'
            onChange={handleChange}
            value={publicUrl?.name}
            ref={disableAutocomplete}
            className={classes.input}
            placeholder='Document name'
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <InputText
            name='password'
            onChange={handleChange}
            ref={disableAutocomplete}
            className={classes.input}
            value={publicUrl?.password}
            placeholder='Password (optional)'
          />
        </Col>
        <Col className={classes.col} xs={12}>
          <p>Expiration date (optional)</p>
          <Calendar
            inline
            showButtonBar
            name='expiresIn'
            className='w-100'
            onChange={handleChange}
            minDate={dayjs().toDate()}
            inputClassName={classes.input}
            value={publicUrl.expiresIn as Date}
          />
        </Col>
        <Col xs={12} className={`mb-4 ${classes.col}`}>
          <Button className={classes.button} onClick={handleSave}>
            Submit
          </Button>
        </Col>
      </Row>
      <Toast ref={toast} position='top-right' />
    </Container>
  )
}
