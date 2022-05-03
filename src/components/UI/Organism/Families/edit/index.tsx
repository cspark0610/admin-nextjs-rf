// main tools
import { useReducer } from 'react'

// bootstrap components
import { Container, Row, Col, Button } from 'react-bootstrap'
import { ArrowLeft, Save2 } from 'react-bootstrap-icons'

// components
import { EditFamilyNavbar } from './navbar'

// reduers
import { FamilyManagement } from 'reducers/FamilyReducers'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { FamilyDataType } from 'types/models/Family'
import { SetStateType } from 'types'
import { FC } from 'react'

type EditFamiliesProps = {
  setShowEdit: SetStateType<boolean>
  setError: SetStateType<string>
  data: FamilyDataType
}

export const EditFamilies: FC<EditFamiliesProps> = ({
  data: familyData,
  setShowEdit,
  setError,
}) => {
  const [data, dispatch] = useReducer(FamilyManagement, { ...familyData })

  return (
    <Container fluid>
      <Row className='mb-5'>
        <Col xs={2}>
          <Button
            className={classes.button_back}
            onClick={() => setShowEdit(false)}
          >
            <ArrowLeft /> <span>Back</span>
          </Button>
        </Col>
        <Col xs={2}>
          <Button className={classes.button} onClick={() => setShowEdit(false)}>
            <Save2 /> <span>Save</span>
          </Button>
        </Col>
      </Row>
      <EditFamilyNavbar data={data} dispatch={dispatch} setError={setError} />
    </Container>
  )
}
