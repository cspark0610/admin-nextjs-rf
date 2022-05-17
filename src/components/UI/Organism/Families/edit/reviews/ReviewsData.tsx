// main tools
import Image from 'next/image'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { FC, useState, ChangeEvent, useEffect, useRef } from 'react'

// bootstrap components
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap'

// prime components
import { Toast } from 'primereact/toast'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { Rating } from 'components/UI/Atoms/Rating'
import { InputSwitch } from 'primereact/inputswitch'
import { PencilSquare } from 'react-bootstrap-icons'
import { InputTextarea } from 'primereact/inputtextarea'
import { Rating as PrimeRating } from 'primereact/rating'
import { UploadFile } from 'components/UI/Atoms/UploadFile'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
// services
import { useGenerics } from 'hooks/useGenerics'
import { ReviewsService } from 'services/Reviews'
// styles
import classes from 'styles/Families/page.module.scss'
import PhotoStyles from 'styles/UI/inputs.module.scss'
//utils
import { fieldTitles } from './utils'

interface IReviewsData {
  review?: any
  familyId: string
  setCloseModal: () => void
}
export const ReviewsData: FC<IReviewsData> = ({
  familyId = '',
  setCloseModal,
  review = {
    studentName: '',
    studentNationality: {},
    program: {},
    date: new Date(),
    feedback: '',
    studentSchool: {},
    treatment: 1,
    meals: 1,
    room: 1,
    activities: 1,
    communication: 1,
  },
}) => {
  const setOverall = useRef(false)
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [visible, setVisible] = useState(false)
  const [overallScore, setoverallScore] = useState(1)
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null)
  const [studentVideo, setStudentVideo] = useState<File | null>(null)
  const {
    loading,
    school: schools,
    country: nationality,
    academicCourse: academicPrograms,
  } = useGenerics(['country', 'academicCourse', 'school'])
  const [reviewData, setReviewData] = useState(review)
  /**
   * State handler for the inputs
   */
  const handleReviewDataChange = (
    e:
      | DropdownChangeParams
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) =>
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    })

  /**
   * Star rate handler
   */
  const handleRate = (fieldName: string, val: number) => {
    setReviewData({ ...reviewData, [fieldName]: val })
    setOverall.current = true
  }

  /**
   * Submit handler
   */
  const handleSave = async () => {
    const data = {
      ...reviewData,
      isRecommended: visible,
      program: reviewData?.program?._id,
      studentSchool: reviewData?.studentSchool?._id,
      studentNationality: reviewData?.studentNationality?._id,
      studentPhoto:
        review._id && studentPhoto === null
          ? review.studentPhoto
          : studentPhoto,
      studentVideo:
        review._id && studentVideo === null
          ? review.studentVideo
          : studentVideo,
    }
    //form validation
    let fieldErrors = []
    for (const key in reviewData) {
      const thisKeyValue = reviewData[key as keyof typeof reviewData]
      if (typeof thisKeyValue === 'string' && thisKeyValue === '')
        fieldErrors.push(fieldTitles.find((ft) => ft.name === key)?.title)
    }
    //show errors condition
    if (fieldErrors.length > 0) {
      toast.current?.show({
        life: 8000,
        closable: true,
        severity: 'warn',
        summary: `Fields ${fieldErrors.join(', ')} are required`,
      })
      //submit
    } else if (session?.token) {
      const res = !review?._id
        ? await ReviewsService.createReview(session?.token, familyId, data)
        : await ReviewsService.updateReview(
            session?.token,
            familyId,
            review._id,
            data
          )
      if (!res?.data) {
        toast.current?.show({
          life: 3000,
          closable: true,
          severity: 'error',
          summary: `Someting is wen't wrong`,
        })
      } else {
        toast.current?.show({
          life: 3000,
          closable: true,
          severity: 'success',
          summary: `Data succesfully submitted`,
        })
        setCloseModal()
      }
    }
  }
  /**
   *Effects
   */
  useEffect(() => {
    //Calculate overall score
    if (!!setOverall.current) {
      let scores = []
      for (const key in reviewData) {
        if (typeof reviewData[key as keyof typeof reviewData] === 'number')
          scores.push(reviewData[key as keyof typeof reviewData] as number)
      }
      let overall = Math.round((scores.reduce((a, b) => a + b) / 5) as number)
      if (scores.length > 0) setoverallScore(overall)
      setOverall.current = false
    }
  }, [setOverall.current])

  useEffect(() => {
    //On edit review, load the prop review to reviewData state
    if (
      [
        typeof review.studentNationality,
        typeof review.studentSchool,
        typeof review.program,
      ].includes('string') &&
      nationality?.length > 0 &&
      schools?.length > 0 &&
      academicPrograms?.length > 0
    ) {
      setReviewData({
        ...reviewData,
        familyTreatment: reviewData.treatment,
        date: dayjs(reviewData.date).format('YYYY-MM-DD'),
        program: academicPrograms.find((o) => o._id === reviewData.program),
        studentSchool: schools.find((o) => o._id === reviewData.studentSchool),
        studentNationality: nationality.find(
          (o) => o._id === reviewData.studentNationality
        ),
      })
      setVisible(review.isRecommended)
    }
  }, [nationality, schools, academicPrograms])

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Container>
          <Row xs='auto' className='justify-content-center mb-4'>
            <PencilSquare size={28} />
            <h3>{!review?._id ? 'Create' : 'Edit'} Review</h3>
          </Row>
          <Row className={classes.modal_content}>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>Student name</p>
              <InputText
                required
                name='studentName'
                className={classes.input}
                placeholder='Student name'
                value={reviewData.studentName}
                onChange={handleReviewDataChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>Nationality</p>
              {loading ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  appendTo='self'
                  optionLabel='name'
                  options={nationality}
                  className={classes.input}
                  name='studentNationality'
                  placeholder='Select nationality'
                  onChange={handleReviewDataChange}
                  value={reviewData.studentNationality}
                />
              )}
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>Course or program</p>
              {loading ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  name='program'
                  appendTo='self'
                  optionLabel='name'
                  className={classes.input}
                  value={reviewData.program}
                  options={academicPrograms}
                  placeholder='Select program'
                  onChange={handleReviewDataChange}
                />
              )}
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>School</p>
              {loading ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  appendTo='self'
                  options={schools}
                  optionLabel='name'
                  name='studentSchool'
                  className={classes.input}
                  placeholder='Select school'
                  value={reviewData.studentSchool}
                  onChange={handleReviewDataChange}
                />
              )}
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>Date</p>
              <Calendar
                name='date'
                appendTo='self'
                className='w-100'
                maxDate={new Date()}
                inputClassName={classes.input}
                value={reviewData.date as Date}
                onChange={handleReviewDataChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12}>
              <p>Comments</p>
              <InputTextarea
                rows={6}
                required
                name='feedback'
                className={classes.input}
                value={reviewData.feedback}
                placeholder='Put some comments...'
                onChange={handleReviewDataChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} lg={6}>
              <p>Student video</p>
              {review._id && review?.studentVideo !== 'null' ? (
                <div className={PhotoStyles.upload_file}>
                  <video
                    controls
                    src={reviewData?.studentVideo}
                    className={PhotoStyles.upload_preview_file}
                  />
                </div>
              ) : (
                <UploadFile
                  accept='video'
                  chooseLabel='you haven´t uploaded a video yet'
                  setBlobFile={setStudentVideo}
                />
              )}
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} lg={6}>
              <p>Student photo</p>
              {review._id && review?.studentPhoto !== 'null' ? (
                <div className={PhotoStyles.upload_file}>
                  <Image
                    alt='profile'
                    layout='fill'
                    src={reviewData?.studentPhoto}
                    className={PhotoStyles.file_preview_photo}
                  />
                </div>
              ) : (
                <UploadFile
                  accept='image'
                  setBlobFile={setStudentPhoto}
                  chooseLabel='you haven´t uploaded a photo yet'
                />
              )}
            </Col>
            <Col className={`${classes.col} ${classes.score} mt-4`} xs={12}>
              <h5>Scores</h5>
            </Col>
            <Rating
              name='treatment'
              setRate={handleRate}
              title='Family treatment'
              value={reviewData.treatment}
            />
            <Rating
              name='communication'
              setRate={handleRate}
              value={reviewData.communication}
            />
            <Rating
              name='activities'
              setRate={handleRate}
              value={reviewData.activities}
            />
            <Rating
              name='meals'
              setRate={handleRate}
              value={reviewData.meals}
            />
            <Rating value={reviewData.room} name='room' setRate={handleRate} />

            <Col className={`${classes.col} my-2`} xs={12} sm={6} lg={4}>
              <p>Overall Score</p>
              <PrimeRating value={overallScore} readOnly cancel={false} />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12}>
              <p>Is Visible?</p>
              <Row>
                <Col xs='auto'>
                  <InputSwitch
                    inputId='visible'
                    checked={visible}
                    onChange={(e) => setVisible(e.value)}
                  />
                </Col>
                <Col xs='auto'>
                  <label htmlFor='visible'>yes make it public</label>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Button className={classes.button} onClick={handleSave}>
                Save
              </Button>
            </Col>
          </Row>
          <Toast ref={toast} />
        </Container>
      )}
    </>
  )
}
