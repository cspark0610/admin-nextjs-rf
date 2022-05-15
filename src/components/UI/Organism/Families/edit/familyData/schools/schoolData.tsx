// bootstrap components
import { Button, Col, Row, Spinner } from 'react-bootstrap'

// prime components
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'

// services
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DropdownChangeParams } from 'primereact/dropdown'
import { SchoolDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'

type SchoolDataProps = {
  idx: number
  data: SchoolDataType
  handleSave: () => void
  dispatch: Dispatch<{
    type: string
    payload: {
      idx?: number
      ev: DropdownChangeParams | MultiSelectChangeParams
    }
  }>
}

export const SchoolData: FC<SchoolDataProps> = ({
  idx,
  data,
  dispatch,
  handleSave,
}) => {
  const {
    loading,
    school: schools,
    transport: transports,
  } = useGenerics(['school', 'transport'])

  /**
   * handle change school and dispatch data
   */
  const handleSchoolChange = (
    ev: DropdownChangeParams | MultiSelectChangeParams,
    idx: number
  ) => dispatch({ type: 'handleSchoolChange', payload: { ev, idx } })

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Row key={idx}>
          <Divider />
          <Col className='mb-2' xs={12} md={6}>
            <p>School</p>
            {loading === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                name='school'
                appendTo='self'
                options={schools}
                optionLabel='name'
                value={data.school}
                placeholder='Select'
                className={classes.input}
                onChange={(ev) => handleSchoolChange(ev, idx)}
              />
            )}
          </Col>
          <Col className='mb-2' xs={12} md={6}>
            <p>Transports</p>
            {loading === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <MultiSelect
                filter
                showClear
                display='chip'
                appendTo='self'
                name='transports'
                optionLabel='name'
                options={transports}
                placeholder='Select'
                value={data.transports}
                className={classes.input}
                onChange={(ev) => handleSchoolChange(ev, idx)}
              />
            )}
          </Col>
          <Col className='mt-5' xs={12}>
            <Button className={classes.button} onClick={handleSave}>
              Save
            </Button>
          </Col>
        </Row>
      )}
    </>
  )
}
