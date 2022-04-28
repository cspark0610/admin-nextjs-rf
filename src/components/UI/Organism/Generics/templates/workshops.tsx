// bootstrap components
import { Row, Col } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'

// styles
import classes from 'styles/Config/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { ChangeType } from 'types'
import { FC } from 'react'

export type CreateWorkshopProps = {
  handleChange: (ev: ChangeType & DropdownChangeParams) => void
  data: GenericDataType
}

export const CreateWorkshop: FC<CreateWorkshopProps> = ({
  handleChange,
  data,
}) => {
  const formatDate = (date: string | Date | undefined) =>
    typeof date === 'string' ? new Date(date) : date

  return (
    <Row>
      <Col className={classes.col} xs={6}>
        <InputText
          required
          name='name'
          value={data.name}
          onChange={handleChange}
          className={classes.input}
          placeholder="Generic's name"
        />
      </Col>
      <Col className={classes.col} xs={6}>
        <InputText
          required
          name='remarks'
          value={data.remarks}
          placeholder='Remarks'
          onChange={handleChange}
          className={classes.input}
        />
      </Col>
      <Col className={classes.col} xs={6}>
        <Calendar
          inline
          name='date'
          minDate={new Date()}
          onChange={handleChange}
          value={formatDate(data.date)}
        />
      </Col>
    </Row>
  )
}
