// main tools
import { Fragment, FC, useState, ChangeEvent, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

// bootstrap components
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Rating as PrimeRating } from 'primereact/rating'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputSwitch } from 'primereact/inputswitch'
import { Rating } from 'components/UI/Atoms/Rating'
import { PencilSquare } from 'react-bootstrap-icons'
import { UploadFile } from 'components/UI/Atoms/UploadFile'
import { Toast } from 'primereact/toast'
// services
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'
import { ReviewsService } from 'services/Reviews'
import { IReview } from 'types/models/Review'

export const ReviewsData = ({
  familyId = '',
  review = {
    studentName: '',
    nationality: '',
    academicProgram: '',
    date: new Date(),
    feedback: '',
    school: '',
    familyTreatment: 1,
    meals: 1,
    room: 1,
    activities: 1,
    comunication: 1,
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
    country: nationality,
    academicCourse: academicPrograms,
    school: schools,
  } = useGenerics(['country', 'academicCourse', 'school'])
  const [reviewData, setReviewData] = useState(review)
  const fieldTitles = [
    { title: 'Student name', name: 'studentName' },
    { title: 'Nationality', name: 'nationality' },
    { title: 'Course or program', name: 'academicProgram' },
    { title: 'School', name: 'school' },
    { title: 'Date', name: 'date' },
    { title: 'Comments', name: 'feedback' },
    { title: 'Student video', name: 'studentVideo' },
    { title: 'Student photo', name: 'studentPhoto' },
  ]
  const handleReviewDataChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | DropdownChangeParams
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    console.log(e.target.name, 'and ', e.target.value)
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRateChange = (fieldName: string, val: number) => {
    setReviewData({ ...reviewData, [fieldName]: val })
    setOverall.current = true
  }

  useEffect(() => {
    if (!!setOverall.current) {
      let scores = []
      for (const key in reviewData) {
        if (typeof reviewData[key as keyof typeof reviewData] === 'number') {
          scores.push(reviewData[key as keyof typeof reviewData] as number)
        }
      }
      let overall = Math.round((scores.reduce((a, b) => a + b) / 5) as number)
      console.log(overall)
      if (scores.length > 0) setoverallScore(overall)
      setOverall.current = false
    }
  }, [setOverall.current])

  const handleSave = () => {
    const data: IReview = {
      ...reviewData,
      studentPhoto,
      studentVideo,
      isRecommended: visible,
    }
    let fieldErrors = []
    for (const key in reviewData) {
      const thisKeyValue = reviewData[key as keyof typeof reviewData]
      if (typeof thisKeyValue === 'string' && thisKeyValue === '') {
        fieldErrors.push(fieldTitles.find((ft) => ft.name === key)?.title)
      }
    }
    if (fieldErrors.length > 0) {
      toast.current?.show({
        severity: 'warn',
        summary: `Fields ${fieldErrors.join(', ')} are required`,
        life: 8000,
        closable: true,
      })
    } else if (session?.token) {
      ReviewsService.createReview(session?.token, familyId, data)
    }
    console.log(session)
  }

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Container>
          <Row xs='auto' className='justify-content-center mb-4'>
            <PencilSquare size={28} />
            <h3>Create Review</h3>
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
                name='nationality'
                value={reviewData.nationality}
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
                name='academicProgram'
                value={reviewData.academicProgram}
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
                name='school'
                value={reviewData.school}
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
                value={reviewData.date}
                maxDate={new Date()}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12}>
              <p>Comments</p>
              <InputTextarea
                required
                rows={6}
                name='feedback'
                className={classes.input}
                placeholder='Put some comments...'
                onChange={handleReviewDataChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} lg={6}>
              <p>Student video</p>
              <UploadFile
                accept='video'
                chooseLabel='you haven´t uploaded a video yet'
                setBlobFile={setStudentVideo}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} lg={6}>
              <p>Student photo</p>
              <UploadFile
                accept='image'
                chooseLabel='you haven´t uploaded a photo yet'
                setBlobFile={setStudentPhoto}
              />
            </Col>
            <Col className={`${classes.col} ${classes.score} mt-4`} xs={12}>
              <h5>Scores</h5>
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} sm={6} lg={4}>
              <Rating
                title='Family treatment'
                fieldName='familyTreatment'
                setRate={handleRateChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} sm={6} lg={4}>
              <Rating
                title='Comunication'
                fieldName='comunication'
                setRate={handleRateChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} sm={6} lg={4}>
              <Rating
                title='Activities'
                fieldName='activities'
                setRate={handleRateChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} sm={6} lg={4}>
              <Rating
                title='Meals'
                fieldName='meals'
                setRate={handleRateChange}
              />
            </Col>
            <Col className={`${classes.col} my-2`} xs={12} sm={6} lg={4}>
              <Rating
                title='Room'
                fieldName='room'
                setRate={handleRateChange}
              />
            </Col>
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
