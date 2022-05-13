// bootstrap components
import { Row, Col } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'

// styles
import classes from 'styles/Config/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { ChangeType } from 'types'
import { FC } from 'react'

export type CreateServiceProps = {
  handleChange: (ev: ChangeType & DropdownChangeParams) => void
  data: GenericDataType
}

export const CreateService: FC<CreateServiceProps> = ({
  handleChange,
  data,
}) => {
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
        <h4 className='my-4'>Icon</h4>
      </Col>
    </Row>
  )
}
