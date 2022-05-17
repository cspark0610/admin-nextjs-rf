// main tools
import { FC, useState, ChangeEvent, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

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
import Image from 'next/image'

interface IReviewsData {
  familyId: string
  review?: any
  setCloseModal: () => void
}
export const ReviewsData: FC<IReviewsData> = ({
  familyId = '',
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
  setCloseModal,
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

  const handleRate = (fieldName: string, val: number) => {
    setReviewData({ ...reviewData, [fieldName]: val })
    setOverall.current = true
  }

  const handleSave = async () => {
    const data = {
      ...reviewData,
      program: reviewData?.program?._id,
      studentNationality: reviewData?.studentNationality?._id,
      studentSchool: reviewData?.studentSchool?._id,
      studentPhoto,
      studentVideo,
      isRecommended: visible,
    }
    let fieldErrors = []
    for (const key in reviewData) {
      const thisKeyValue = reviewData[key as keyof typeof reviewData]
      if (typeof thisKeyValue === 'string' && thisKeyValue === '')
        fieldErrors.push(fieldTitles.find((ft) => ft.name === key)?.title)
    }
    if (fieldErrors.length > 0) {
      toast.current?.show({
        severity: 'warn',
        summary: `Fields ${fieldErrors.join(', ')} are required`,
        life: 8000,
        closable: true,
      })
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
          severity: 'error',
          summary: `Someting is wen't wrong`,
          life: 3000,
          closable: true,
        })
      } else {
        toast.current?.show({
          severity: 'success',
          summary: `Data succesfully submitted`,
          life: 3000,
          closable: true,
        })
        setCloseModal()
      }
    }
  }

  //Effects
  useEffect(() => {
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
        studentNationality: nationality.find(
          (o) => o._id === reviewData.studentNationality
        ),
        date: dayjs(reviewData.date),
        studentSchool: schools.find((o) => o._id === reviewData.studentSchool),
        program: academicPrograms.find((o) => o._id === reviewData.program),
        familyTreatment: reviewData.treatment,
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
                placeholder='Student name'
                className={classes.input}
                onChange={handleReviewDataChange}
                name='studentName'
                value={reviewData.studentName}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>Nationality</p>
              <Dropdown
                showClear
                placeholder='Select nationality'
                className={classes.input}
                appendTo='self'
                options={nationality}
                optionLabel='name'
                onChange={handleReviewDataChange}
                name='studentNationality'
                value={reviewData.studentNationality}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>Course or program</p>
              <Dropdown
                showClear
                placeholder='Select program'
                className={classes.input}
                appendTo='self'
                options={academicPrograms}
                optionLabel='name'
                onChange={handleReviewDataChange}
                name='program'
                value={reviewData.program}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>School</p>
              <Dropdown
                showClear
                placeholder='Select school'
                className={classes.input}
                appendTo='self'
                options={schools}
                optionLabel='name'
                onChange={handleReviewDataChange}
                name='studentSchool'
                value={reviewData.studentSchool}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} md={6}>
              <p>Date</p>
              <Calendar
                appendTo='self'
                className='w-100'
                inputClassName={classes.input}
                onChange={handleReviewDataChange}
                name='date'
                value={reviewData.date as Date}
                maxDate={new Date()}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12}>
              <p>Comments</p>
              <InputTextarea
                required
                rows={6}
                name='feedback'
                value={reviewData.feedback}
                className={classes.input}
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
                    src={reviewData?.studentPhoto}
                    alt='profile'
                    layout='fill'
                    className={PhotoStyles.file_preview_photo}
                  />
                </div>
              ) : (
                <UploadFile
                  accept='image'
                  chooseLabel='you haven´t uploaded a photo yet'
                  setBlobFile={setStudentPhoto}
                />
              )}
            </Col>
            <Col className={`${classes.col} ${classes.score} mt-4`} xs={12}>
              <h5>Scores</h5>
            </Col>
            <Rating
              value={reviewData.treatment}
              title='Family treatment'
              name='treatment'
              setRate={handleRate}
            />
            <Rating
              value={reviewData.communication}
              name='communication'
              setRate={handleRate}
            />
            <Rating
              value={reviewData.activities}
              name='activities'
              setRate={handleRate}
            />
            <Rating
              value={reviewData.meals}
              name='meals'
              setRate={handleRate}
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
