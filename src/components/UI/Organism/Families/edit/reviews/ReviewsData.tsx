// main tools
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

// components
import { UploadFile } from 'components/UI/Atoms/UploadFile'

// bootstrap components
import {
  Button,
  Col,
  Container,
  ProgressBar,
  Row,
  Spinner,
} from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'

// prime components
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Rating } from 'primereact/rating'
import { Toast } from 'primereact/toast'

// services
import { ReviewsService } from 'services/Reviews'

// utils
import { validateUpdateReviews } from 'validations/updateFamilyData'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { GenericDataType } from 'types/models/Generic'
import { FamilyDataType } from 'types/models/Family'
import { ReviewDataType } from 'types/models/Review'
import { ChangeType, SetStateType } from 'types'
import { FC, ChangeEvent } from 'react'

type ReviewDataProps = {
  data: ReviewDataType
  action: string | null
  familyData: FamilyDataType
  handleCloseCreate: () => void
  setReload: SetStateType<boolean>
}
export const ReviewsData: FC<ReviewDataProps> = ({
  data,
  action,
  setReload,
  familyData,
  handleCloseCreate,
}) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [review, setReview] = useState(data)
  const [uploadFilesProcess, setUploadFilesProcess] = useState(0)
  const {
    loading,
    school: schools,
    program: programs,
    nationality: nationalities,
  } = useGenerics(['nationality', 'program', 'school'])

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

  /**
   * handle format review dte
   */
  const formatReviewDate = (date: string | Date) =>
    typeof date === 'string' ? new Date(date) : date

  /**
   * handle change review data
   */
  const handleChange = (
    ev:
      | ChangeType
      | DropdownChangeParams
      | CheckboxChangeParams
      | ChangeEvent<HTMLTextAreaElement>
  ) => setReview({ ...review, [ev.target.name]: ev.target.value })

  /**
   * handle save review
   */
  const handleSave = async () => {
    const validationError = validateUpdateReviews(review)
    if (validationError.length > 0) showErrors(validationError)
    else if (action === 'CREATE') {
      const { response } = await ReviewsService.createReview(
        session?.token as string,
        familyData?._id as string,
        {
          ...review,
          overallScore: undefined,
          program: (review.program as GenericDataType)?._id,
          studentSchool: (review.studentSchool as GenericDataType)?._id,
          studentNationality: (review.studentNationality as GenericDataType)
            ?._id,
        },
        setUploadFilesProcess
      )

      if (response?.data) showErrors([response?.data?.error])
      else {
        setReload((prev) => !prev)
        handleCloseCreate()
      }
    } else {
      const { response } = await ReviewsService.updateReview(
        session?.token as string,
        familyData._id as string,
        review._id as string,
        {
          ...review,
          family: (review.family as FamilyDataType)._id,
          program: (review.program as GenericDataType)._id,
          studentSchool: (review.studentSchool as GenericDataType)._id,
          studentNationality: (review.studentNationality as GenericDataType)
            ._id,
        },
        setUploadFilesProcess
      )

      if (response?.data) showErrors([response?.data?.error])
      else {
        setReload((prev) => !prev)
        handleCloseCreate()
      }
    }
  }

  /**
   * handle update overal score
   */
  useEffect(() => {
    const sum =
      (review.treatment || 0) +
      (review.communication || 0) +
      (review.activities || 0) +
      (review.meals || 0) +
      (review.room || 0)
    setReview((prev) => ({ ...prev, overallScore: sum / 5 }))
  }, [
    review.room,
    review.meals,
    review.treatment,
    review.activities,
    review.communication,
  ])

  return (
    <Container>
      <Row xs='auto' className='justify-content-center mb-4'>
        <PencilSquare size={28} />
        <h2>Review</h2>
      </Row>
      <Row className={classes.container}>
        <Col className={classes.col} xs={12} md={6}>
          <p>Student name</p>
          <InputText
            required
            name='studentName'
            onChange={handleChange}
            className={classes.input}
            placeholder='Student name'
            value={review.studentName}
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Nationality</p>
          {loading ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              filter
              showClear
              appendTo='self'
              optionLabel='name'
              onChange={handleChange}
              options={nationalities}
              name='studentNationality'
              className={classes.input}
              placeholder='Select nationality'
              value={review.studentNationality}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Course or program</p>
          {loading ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              filter
              showClear
              name='program'
              appendTo='self'
              optionLabel='name'
              options={programs}
              value={review.program}
              onChange={handleChange}
              className={classes.input}
              placeholder='Select program'
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>School</p>
          {loading ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              filter
              showClear
              appendTo='self'
              options={schools}
              optionLabel='name'
              name='studentSchool'
              onChange={handleChange}
              className={classes.input}
              placeholder='Select school'
              value={review.studentSchool}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12}>
          <p>Date</p>
          <Calendar
            inline
            name='date'
            appendTo='self'
            className='w-100'
            maxDate={new Date()}
            onChange={handleChange}
            inputClassName={classes.input}
            value={formatReviewDate(review.date as Date)}
          />
        </Col>
        <Col className={classes.col} xs={12}>
          <p>Comments</p>
          <InputTextarea
            rows={6}
            required
            name='feedback'
            value={review.feedback}
            onChange={handleChange}
            className={classes.input}
            placeholder='Put some comments...'
          />
        </Col>
        <Col className={classes.col} xs={12} lg={6}>
          <p>Student video</p>
          <UploadFile
            accept='video'
            name='studentVideo'
            setData={setReview}
            data={review.studentVideo as string}
            chooseLabel="you haven't uploaded a video yet"
          />
        </Col>
        <Col className={classes.col} xs={12} lg={6}>
          <p>Student photo</p>
          <UploadFile
            accept='image'
            name='studentPhoto'
            setData={setReview}
            data={review.studentPhoto as string}
            chooseLabel='you haven??t uploaded a photo yet'
          />
        </Col>
      </Row>
      <Row className={classes.container}>
        <h5>Scores</h5>
        <Col className={classes.col} xs={6} md={4}>
          <p>Treatment</p>
          <Rating
            cancel={false}
            name='treatment'
            onChange={handleChange}
            value={review.treatment as number}
          />
        </Col>
        <Col className={classes.col} xs={6} md={4}>
          <p>Communication</p>
          <Rating
            cancel={false}
            name='communication'
            onChange={handleChange}
            value={review.communication as number}
          />
        </Col>
        <Col className={classes.col} xs={6} md={4}>
          <p>Activities</p>
          <Rating
            cancel={false}
            name='activities'
            onChange={handleChange}
            value={review.activities as number}
          />
        </Col>
        <Col className={classes.col} xs={6} md={4}>
          <p>Meals</p>
          <Rating
            name='meals'
            cancel={false}
            onChange={handleChange}
            value={review.meals as number}
          />
        </Col>
        <Col className={classes.col} xs={6} md={4}>
          <p>Room</p>
          <Rating
            name='room'
            cancel={false}
            onChange={handleChange}
            value={review.room as number}
          />
        </Col>
        <Col className={classes.col} xs={6} md={4}>
          <p>Overall Score</p>
          <Rating readOnly value={review.overallScore} cancel={false} />
        </Col>

        <Col className={classes.col} xs={12}>
          <p>Is Visible?</p>
          <Checkbox
            name='show'
            className='me-3'
            inputId='visible'
            checked={review.show}
            onChange={handleChange}
            value={!review.show as boolean}
          />
          <label htmlFor='visible'>yes make it public</label>
        </Col>

        <Col className='mb-5' xs={12}>
          <Button className={classes.button} onClick={handleSave}>
            Save
          </Button>
        </Col>
        {uploadFilesProcess !== 0 && (
          <>
            <h5>Uploading files process</h5>
            <ProgressBar className='my-3' now={uploadFilesProcess} />
          </>
        )}
      </Row>
      <Toast ref={toast} position='top-right' />
    </Container>
  )
}
