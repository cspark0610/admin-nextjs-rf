// main tools
import { useState, useReducer, useRef } from 'react'
import { useSession } from 'next-auth/react'

// bootstrap components
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import { ArrowLeft, Save2 } from 'react-bootstrap-icons'

// prime components
import { Toast } from 'primereact/toast'

// components
import { UpdatePreferences } from './preferences'
import { UpdateFamilyData } from './familyData'
import { UpdateDocuments } from './documents'
import { UpdateMainMembers } from './hosts'
import { UpdateActivity } from './activity'
import { EditFamilyNavbar } from './navbar'
import { UpdateReviews } from './reviews'
import { UpdateHome } from './home'

// reduers
import { FamilyManagement } from 'reducers/FamilyReducers'

// utils
import { validateUpdateFamily } from 'validations/updateFamilyData'

// services
import { FamiliesService } from 'services/Families'
import { HomeService } from 'services/Home'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  FamilyDataType,
  MainMemberDataType,
  UpdateFamilyFilesType,
} from 'types/models/Family'
import { UpdateHomeFilesType } from 'types/models/Home'
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
  const [uploadHomeFilesProcess, setUploadHomeFilesProcess] = useState(0)
  const [uploadFamilyFilesProcess, setUploadFamilyFilesProcess] = useState(0)
  const { data: session } = useSession()
  const toast = useRef<Toast>(null)

  const tabs = [
    { key: 'host', title: 'Hosts', Item: UpdateMainMembers },
    { key: 'home', title: 'Home details', Item: UpdateHome },
    { key: 'family', title: 'Family', Item: UpdateFamilyData },
    { key: 'preferences', title: 'Description', Item: UpdatePreferences },
    { key: 'reviews', title: 'Reviews', Item: UpdateReviews },
    { key: 'activities', title: 'Activities', Item: UpdateActivity },
    { key: 'documents', title: 'Documents', Item: UpdateDocuments },
  ]

  const showErrors = (errors: string[]) =>
    toast.current?.show({
      severity: 'error',
      summary: 'Required fields',
      detail: (
        <ul>
          {errors.map((err, idx: number) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      ),
    })

  /**
   * handle update family data
   */
  const handleSave = async () => {
    const {
      home: { video, ...home },
      video: FamilyVideo,
      mainMembers,
      ...family
    } = data

    toast.current?.show({
      severity: 'info',
      summary: 'Update in progress, please wait. . .',
    })
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

    const familyFilesData: UpdateFamilyFilesType = {
      video: FamilyVideo,
      mainMembers: mainMembers.map((member: MainMemberDataType) => ({
        photo: member.photo,
      })),
    }
    const homeFilesData: UpdateHomeFilesType = {
      video,
    }
    FamiliesService.updatefamilyfile(
      session?.token as string,
      data._id as string,
      familyFilesData,
      setUploadFamilyFilesProcess
    )
    HomeService.updateHomefiles(
      session?.token as string,
      family._id as string,
      homeFilesData,
      setUploadHomeFilesProcess
    )
  }

  return (
    <Container fluid>
      <Row className='mb-5'>
        <Col xs='auto'>
          <Button
            className={classes.button_back}
            onClick={() => setShowEdit(false)}>
            <ArrowLeft /> <span>Back</span>
          </Button>
        </Col>
        <Col xs='auto'>
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
        defaultActiveKey={tabs[0].key}>
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={tab.title}
            className={classes.tabs_item}>
            <tab.Item
              data={data}
              dispatch={dispatch}
              setError={setError}
              uploadHomeFilesProcess={uploadHomeFilesProcess}
              uploadFamilyFilesProcess={uploadFamilyFilesProcess}
            />
          </Tab>
        ))}
      </Tabs>
      <Toast ref={toast} position='top-right' />
    </Container>
  )
}
