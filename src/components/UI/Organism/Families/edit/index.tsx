// main tools
import { useReducer } from 'react'

// bootstrap components
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
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
import { UpdateMainMembers } from './hosts'
import { UpdateFamilyData } from './familyData'

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
      <Tabs
        mountOnEnter
        unmountOnExit
        defaultActiveKey='Hosts'
        className={classes.tabs}
      >
        <Tab eventKey='Hosts' title='Hosts' className={classes.tabs_item}>
          <UpdateMainMembers data={data} dispatch={dispatch} />
        </Tab>
        <Tab eventKey='Home' title='Home details' className={classes.tabs_item}>
          <p>details</p>
        </Tab>
        <Tab eventKey='Family' title='Family' className={classes.tabs_item}>
          <UpdateFamilyData data={data} dispatch={dispatch} />
        </Tab>
        <Tab
          eventKey='Preferences'
          title='Description'
          className={classes.tabs_item}
        >
          <p>preferences</p>
        </Tab>
      </Tabs>
    </Container>
  )
}
