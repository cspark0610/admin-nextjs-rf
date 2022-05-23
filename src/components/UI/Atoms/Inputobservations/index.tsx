// main tools
import { FC, useState } from 'react'

// bootstrap components
import { Button, Col, Row } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { GenericDataType } from 'types/models/Generic'
import dayjs from 'dayjs'

type InputListProps = {
  name: string
  userId: string
  placeholder: string
  list?: GenericDataType[]
  onChange: (ev: any) => void
  onRemove: (id: string) => void
}

export const InputObservations: FC<InputListProps> = ({
  list,
  name,
  userId,
  onRemove,
  onChange,
  placeholder,
}) => {
  const [value, setValue] = useState('')

  /**
   * footer card and button remove
   */
  const footer = (item: GenericDataType) => {
    if (item.author?._id === userId)
      return (
        <Col className='text-end'>
          <Button onClick={() => onRemove(item._id as string)}>Delete</Button>
        </Col>
      )
  }

  /**
   * update value and clean state
   * for add another element
   */
  const handleClick = () => {
    if (value !== '' && value.trim() !== '') {
      onChange({
        target: { name, value: [{ isFreeComment: true, name: value }] },
      })
      setValue('')
    }
  }

  return (
    <>
      <div className='d-flex'>
        <InputText
          value={value}
          className={classes.input}
          placeholder={placeholder}
          style={{ borderRadius: '19px 0 0 19px' }}
          onChange={(ev) => setValue(ev.target.value)}
        />
        <Button
          onClick={handleClick}
          className={`px-4 ${classes.button}`}
          style={{ borderRadius: '0 19px 19px 0' }}>
          add
        </Button>
      </div>
      <Row>
        {list?.map((item, idx) => (
          <Col
            xs={12}
            md={6}
            lg={4}
            xl={3}
            key={`${item.isFreeComment}-${idx}`}>
            <Card
              className='my-2'
              footer={footer(item)}
              title={item.author?.firstName}
              subTitle={dayjs(item.createdAt).format('YYYY-MM-DD')}>
              {item.content}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
