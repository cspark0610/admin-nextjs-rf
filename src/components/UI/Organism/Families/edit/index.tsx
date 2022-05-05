// main tools
import { useSession } from 'next-auth/react'
import { useReducer, useRef } from 'react'

// bootstrap components
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import { ArrowLeft, Save2 } from 'react-bootstrap-icons'

// prime components
import { Toast } from 'primereact/toast'

// components
import { UpdatePreferences } from './preferences'
import { UpdateFamilyData } from './familyData'
import { UpdateMainMembers } from './hosts'
import { EditFamilyNavbar } from './navbar'
import { UpdateHome } from './home'

// reduers
import { FamilyManagement } from 'reducers/FamilyReducers'

// services
import { FamiliesService } from 'services/Families'
import { HomeService } from 'services/Home'

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
  const { data: session } = useSession()
  const toast = useRef<Toast>(null)

  const tabs = [
    { key: 'host', title: 'Hosts', Item: UpdateMainMembers },
    { key: 'home', title: 'Home details', Item: UpdateHome },
    { key: 'family', title: 'Family', Item: UpdateFamilyData },
    { key: 'preferences', title: 'Description', Item: UpdatePreferences },
  ]

  const handleSave = async () => {
    const { home, ...family } = data
    const { response: familyResponse } = await FamiliesService.updatefamily(
      session?.token as string,
      data._id as string,
      family
    )
    if (!familyResponse)
      toast.current?.show({
        severity: 'success',
        summary: 'Update family succesfully',
      })
    else {
      setError(familyResponse.data?.message)
      dispatch({ type: 'cancel', payload: null })
    }

    const { response: homeResponse } = await HomeService.updateHome(
      session?.token as string,
      data._id as string,
      home
    )
    if (!homeResponse)
      toast.current?.show({
        severity: 'success',
        summary: 'Update Home succesfully',
      })
    else {
      setError(homeResponse.data?.message)
      dispatch({ type: 'cancel', payload: null })
    }
  }

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
          <Button className={classes.button} onClick={handleSave}>
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
      <Toast ref={toast} position='top-center' />
    </Container>
  )
}
