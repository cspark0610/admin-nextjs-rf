// main tools
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// components
import { PhotoGallery } from 'components/UI/Atoms/PhotoGallery'
import { UploadVideo } from 'components/UI/Atoms/UploadVideo'
import { EditStudentRooms } from './studentRooms'

// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// services
import { HomeService } from 'services/Home'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FamilyDataType } from 'types/models/Family'
import { HomeDataType } from 'types/models/Home'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type UpdateHomeProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
          idx?: number
        }
      | {
          file: File | { caption: string; photo: string }
          selectedCategory: string
        }
      | string[]
      | File
      | null
    type: string
  }>
}

export const UpdateHome: FC<UpdateHomeProps> = ({ data, dispatch }) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const {
    service: services,
    homeType: homeTypes,
    roomType: roomTypes,
    nearbyService: nearbyServices,
  } = useGenerics(['service', 'homeType', 'roomType', 'nearbyService'])

  /**
   * handle format room types
   */
  const formatRoomTypes = () =>
    roomTypes?.map((roomType) => ({ amount: 1, roomType }))

  /**
   * handle format actual
   * home data room types
   */
  const formatHomeDataRoomTypes = (roomTypes: HomeDataType['houseRooms']) =>
    roomTypes?.map((roomType) => {
      delete roomType._id
      return roomType
    })

  /**
   * handle home info change
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'handleLodgingChange', payload: { ev } })

  /**
   * handle get family home
   */
  useEffect(() => {
    ;(async () => {
      const homePopulateFields = [
        'city',
        'country',
        'province',
        'homeType',
        'services',
        'nearbyServices',
        'studentRooms.type',
        'studentRooms.floor',
        'houseRooms.roomType',
        'studentRooms.bedType',
        'studentRooms.bathType',
        'studentRooms.aditionalFeatures',
      ]

      const res = await HomeService.getFamilyHome(
        session?.token as string,
        data._id as string,
        homePopulateFields
      )

      res && dispatch({ type: 'addHomeData', payload: res.data })
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data._id, session?.token])

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Container fluid className={classes.container}>
          <Row>
            <h2 className={classes.subtitle}>Home</h2>
            <Col className={classes.col} xs={6}>
              <p>Home video</p>
              <UploadVideo
                data={data.home?.video as string}
                dispatch={dispatch}
              />
            </Col>
            <Col className={classes.col} xs={6}>
              <p>Home photos</p>
              <PhotoGallery
                dispatch={dispatch}
                selectedCategory='home'
                pictures={data.home?.photoGroups || []}
              />
            </Col>
            <Col className={classes.col} xs={6}>
              <p>Home type</p>
              {homeTypes === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  name='homeType'
                  optionLabel='name'
                  options={homeTypes}
                  onChange={handleChange}
                  placeholder='Home types'
                  className={classes.input}
                  value={data.home?.homeType}
                />
              )}
            </Col>
            <Col className={classes.col} xs={6}>
              <p>Inside</p>
              {roomTypes === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  name='houseRooms'
                  onChange={handleChange}
                  className={classes.input}
                  optionLabel='roomType.name'
                  options={formatRoomTypes()}
                  placeholder='Inside room types'
                  value={formatHomeDataRoomTypes(data.home?.houseRooms)}
                />
              )}
            </Col>
            <Col className={classes.col} xs={6}>
              <p>Household amenities</p>
              {services === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  name='services'
                  optionLabel='name'
                  options={services}
                  onChange={handleChange}
                  className={classes.input}
                  value={data.home?.services}
                  placeholder='Household amenities'
                />
              )}
            </Col>
            <Col className={classes.col} xs={6}>
              <p>Nearby services (within 10 minutes walk)</p>
              {nearbyServices === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  optionLabel='name'
                  name='nearbyServices'
                  onChange={handleChange}
                  options={nearbyServices}
                  className={classes.input}
                  placeholder='Nearby services'
                  value={data.home?.nearbyServices}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12}>
              <h2 className={classes.subtitle}>Bedrooms</h2>
              <EditStudentRooms
                dispatch={dispatch}
                familyId={data._id as string}
                home={data.home as HomeDataType}
              />
            </Col>
          </Row>
          <Toast ref={toast} position='top-center' />
        </Container>
      )}
    </>
  )
}
