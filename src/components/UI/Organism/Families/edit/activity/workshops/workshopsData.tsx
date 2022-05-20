// bootstrap components
import { Button, Col, Row, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'

// services
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { GenericDataType } from 'types/models/Generic'
import { FC, Dispatch } from 'react'

interface WorkshopsParams {
  data: GenericDataType
  handleSave: (ev: GenericDataType) => void
  dispatch: Dispatch<{
    payload: {
      ev: DropdownChangeParams
      idx?: number
    }
    type: string
  }>
  idx: number
}

export const WorkshopsData: FC<WorkshopsParams> = ({
  idx,
  data,
  dispatch,
  handleSave,
}) => {
  const { loading, workshop: workshops } = useGenerics(['workshop'])

  /**
   * handle change user and dispatch data
   */
  const handleChange = (ev: DropdownChangeParams, idx: number) =>
    dispatch({ type: 'handleWorkshopsChange', payload: { ev, idx } })

  return (
    <Row key={idx} className={classes.container}>
      <Divider />
      <Col className={classes.col} xs={12}>
        <p>Workshops</p>
        {loading ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            showClear
            value={data}
            appendTo='self'
            optionLabel='name'
            options={workshops}
            name='workshopsAttended'
            className={classes.input}
            placeholder='Select workshops'
            onChange={(ev) => handleChange(ev, idx)}
          />
        )}
      </Col>
      <Col xs={12}>
        <Button
          onClick={handleSave}
          className={classes.button}
          disabled={!Object.keys(data).length}>
          Save
        </Button>
      </Col>
    </Row>
  )
}
