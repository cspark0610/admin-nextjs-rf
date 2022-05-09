// main tools
import { useState } from 'react'

// components
import { UploadFile } from 'components/UI/Atoms/UploadFile'
import { Rating } from 'components/UI/Atoms/Rating'

// bootstrap components
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'

// prime components
import { InputTextarea } from 'primereact/inputtextarea'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'

// styles
import classes from 'styles/UI/Molecules/createReview.module.scss'

// types
import { FC } from 'react'

export const CreateReview: FC = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Modal
      size='lg'
      show={true}
      //onHide={() => setShow(false)}
      contentClassName={classes.modal}>
      <Modal.Header className={classes.modal_close} closeButton></Modal.Header>
      <Modal.Body>
        <Row xs='auto' className='justify-content-center'>
          <PencilSquare size={28} />
          <h3>Create Review</h3>
        </Row>
        <Row className={classes.modal_content}>
          <Col className={classes.col} xs={12} md={6}>
            <p>Student name</p>
            <InputText
              required
              placeholder='Student name'
              className={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>Nationality</p>
            <Dropdown
              showClear
              placeholder='Select nationality'
              className={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>Course or program</p>
            <Dropdown
              showClear
              placeholder='Select program'
              className={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>School</p>
            <Dropdown
              showClear
              placeholder='Select school'
              className={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={12} md={6}>
            <p>Date</p>
            <Calendar
              appendTo='self'
              className='w-100'
              inputClassName={classes.input}
            />
          </Col>
          <Col className={classes.col} xs={12}>
            <p>Comments</p>
            <InputTextarea
              required
              rows={6}
              className={classes.input}
              placeholder='Put some comments...'
            />
          </Col>
          <Col className={classes.col} xs={12} lg={6}>
            <p>Student video</p>
            <UploadFile
              accept='video'
              chooseLabel='you haven´t uploaded a video yet'
            />
          </Col>
          <Col className={classes.col} xs={12} lg={6}>
            <p>Student photo</p>
            <UploadFile
              accept='image'
              chooseLabel='you haven´t uploaded a photo yet'
            />
          </Col>
          <Col className={`${classes.col} ${classes.score}`} xs={12}>
            <h5>Scores</h5>
          </Col>
          <Col className={classes.col} xs={12} sm={6} lg={4}>
            <p>Family treatment</p>
            <Rating />
          </Col>
          <Col className={classes.col} xs={12} sm={6} lg={4}>
            <p>Comunication</p>
            <Rating />
          </Col>
          <Col className={classes.col} xs={12} sm={6} lg={4}>
            <p>Activities</p>
            <Rating />
          </Col>
          <Col className={classes.col} xs={12} sm={6} lg={4}>
            <p>Meals</p>
            <Rating />
          </Col>
          <Col className={classes.col} xs={12} sm={6} lg={4}>
            <p>Room</p>
            <Rating />
          </Col>
          <Col className={classes.col} xs={12} sm={6} lg={4}>
            <p>Overall score</p>
            <Rating />
          </Col>
          <Col className={classes.col} xs={12}>
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
            <Button className={classes.button}>Save</Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
