// bootstrap components
import { Row, Col, Button } from 'react-bootstrap'

// prime components
import { PrimeIcons } from 'primereact/api'

// styles
import classes from 'styles/UI/Atoms/confirmation.module.scss'

// types
import { FC } from 'react'

type ToastConfirmationTemplateProps = {
  accept: () => void
  reject: () => void
}

export const ToastConfirmationTemplate: FC<ToastConfirmationTemplateProps> = ({
  accept,
  reject,
}) => (
  <div className={classes.container}>
    <i className={`${PrimeIcons.EXCLAMATION_TRIANGLE} ${classes.icon}`} />
    <h4>Are you sure?</h4>
    <p>Confirm to proceed</p>
    <Row>
      <Col xs={6}>
        <Button onClick={accept} className={classes.button_cancel}>
          Accept
        </Button>
      </Col>
      <Col xs={6}>
        <Button onClick={reject} className={classes.button}>
          Reject
        </Button>
      </Col>
    </Row>
  </div>
)
