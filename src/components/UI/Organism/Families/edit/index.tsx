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
import { UpdateHome } from './home'
import { UpdatePreferences } from './preferences'

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

  const tabs = [
    { key: 'host', title: 'Hosts', Item: UpdateMainMembers },
    { key: 'home', title: 'Home details', Item: UpdateHome },
    { key: 'family', title: 'Family', Item: UpdateFamilyData },
    { key: 'preferences', title: 'Description', Item: UpdatePreferences },
  ]

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
        className={classes.tabs}
        defaultActiveKey={tabs[0].key}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={tab.title}
            className={classes.tabs_item}
          >
            <tab.Item data={data} dispatch={dispatch} />
          </Tab>
        ))}
      </Tabs>
    </Container>
  )
}
