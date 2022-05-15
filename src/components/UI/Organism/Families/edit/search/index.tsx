// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { MultiSelect } from 'primereact/multiselect'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { FamilyDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'
import { useGenerics } from 'hooks/useGenerics'

type UpdateSearchProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const UpdateSearch: FC<UpdateSearchProps> = ({ data, dispatch }) => {
  const { label: labels } = useGenerics(['label'])

  /**
   * handle change family info and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'familyInfo', payload: { ev } })

  return (
    <Container fluid className={classes.container}>
      <h2 className={classes.subtitle}>Search</h2>
      <Row>
        <Col className={classes.col} xs={6}>
          <h2 className={classes.subtitle}>Tags</h2>
          {labels === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <>
              <MultiSelect
                filter
                showClear
                display='chip'
                name='labels'
                options={labels}
                optionLabel='name'
                value={data.labels}
                placeholder='Select'
                onChange={handleChange}
                className={classes.input}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}
