// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// components
import { AvailabilityPicker } from 'components/UI/Atoms/AvailabilityPicker'

// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'

// prime components
import { SelectButton } from 'primereact/selectbutton'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DropdownChangeParams } from 'primereact/dropdown'
import { HomeDataType } from 'types/models/Home'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type CreateHomeProps = {
  data: HomeDataType
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
      idx?: number
    } | null
    type: string
  }>
}

export const CreateHome: FC<CreateHomeProps> = ({ data, dispatch }) => {
  const { data: session, status } = useSession()
  const [floors, setFloors] = useState(undefined)
  const [bedTypes, setBedTypes] = useState(undefined)
  const [services, setServices] = useState(undefined)
  const [roomTypes, setRoomTypes] = useState(undefined)
  const [homeTypes, setHomeTypes] = useState(undefined)
  const [nearbyServices, setNearbyServices] = useState(undefined)
  const [roomPrivacities, setRoomPrivacities] = useState(undefined)
  const [additionalRoomFeatures, setAdditionalRoomFeatures] =
    useState(undefined)

  const locations = [
    { label: 'In the room', value: 'IN_THE_ROOM' },
    { label: 'Outside of the room', value: 'OUTSIDE_OF_THE_ROOM' },
  ]

  /**
   * handle change home and dispatch data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'handleLodgingChange', payload: { ev } })

  /**
   * handle student room data change
   */
  const handleRoomChange = (ev: SelectButtonChangeParams, idx: number) =>
    dispatch({ type: 'handleRoomsChange', payload: { ev, idx } })

  /**
   * handle add new student room
   */
  const handleAddRoom = () => dispatch({ type: 'handleAddRoom', payload: null })

  /**
   * handle remove student room
   */
  const handleRemoveRoom = () =>
    dispatch({ type: 'handleRemoveRoom', payload: null })

  /**
   * handle get generics from backend
   */
  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          [
            'floor',
            'service',
            'bedType',
            'homeType',
            'roomType',
            'nearbyService',
            'roomPrivacity',
            'additionalRoomFeature',
          ]
        )

        setFloors(data.floor)
        setServices(data.service)
        setBedTypes(data.bedType)
        setHomeTypes(data.homeType)
        setRoomTypes(data.roomType)
        setNearbyServices(data.nearbyService)
        setRoomPrivacities(data.roomPrivacity)
        setAdditionalRoomFeatures(data.additionalRoomFeature)
      })()
    }
  }, [status, session])

  return (
    <Container fluid className={classes.container}>
      <Row>
        <h2 className={classes.subtitle}>Home</h2>
        <Col className={classes.col} xs={6}>
          <p>Home type</p>
          {homeTypes === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              name='homeType'
              optionValue='_id'
              optionLabel='name'
              options={homeTypes}
              value={data.homeType}
              onChange={handleChange}
              placeholder='Home types'
              className={classes.input}
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
              optionValue='_id'
              optionLabel='name'
              options={roomTypes}
              value={data.houseRooms}
              onChange={handleChange}
              className={classes.input}
              placeholder='Inside room types'
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
              optionValue='_id'
              optionLabel='name'
              options={services}
              value={data.services}
              onChange={handleChange}
              className={classes.input}
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
              optionValue='_id'
              optionLabel='name'
              name='nearbyServices'
              onChange={handleChange}
              options={nearbyServices}
              className={classes.input}
              value={data.nearbyServices}
              placeholder='Nearby services'
            />
          )}
        </Col>
        <Col className={classes.col} xs={4}>
          <h2 className={classes.subtitle}>Bedrooms</h2>
          <div className={classes.counter}>
            <DashCircle role='button' onClick={handleRemoveRoom} />
            <p>{data.studentRooms?.length}</p>
            <PlusCircle role='button' onClick={handleAddRoom} />
          </div>
        </Col>
      </Row>
      {data.studentRooms?.map((room, idx: number) => (
        <Row key={room.roomNumber}>
          <Divider />
          <Col xs={6} className={`text-center ${classes.col}`}>
            <h2 className={classes.subtitle}>Room type</h2>
            {roomPrivacities === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <SelectButton
                required
                name='type'
                optionValue='_id'
                value={room.type}
                optionLabel='name'
                options={roomPrivacities}
                className={classes.buttons}
                onChange={(ev) => handleRoomChange(ev, idx)}
              />
            )}
          </Col>
          <Col xs={6} className={`text-center ${classes.col}`}>
            <h2 className={classes.subtitle}>Bathroom type</h2>
            {roomPrivacities === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <SelectButton
                required
                name='bathType'
                optionValue='_id'
                optionLabel='name'
                value={room.bathType}
                options={roomPrivacities}
                className={classes.buttons}
                onChange={(ev) => handleRoomChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={12}>
            <p>Additional features</p>
            {additionalRoomFeatures === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <MultiSelect
                filter
                showClear
                display='chip'
                optionValue='_id'
                optionLabel='name'
                name='aditionalFeatures'
                className={classes.input}
                value={room.aditionalFeatures}
                options={additionalRoomFeatures}
                placeholder='Additional features'
                onChange={(ev) => handleRoomChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Bed type</p>
            {bedTypes === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                name='bedType'
                optionValue='_id'
                optionLabel='name'
                options={bedTypes}
                value={room.bedType}
                placeholder='Bed types'
                className={classes.input}
                onChange={(ev) => handleRoomChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Bedroom level</p>
            {floors === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                name='floor'
                options={floors}
                optionValue='_id'
                optionLabel='name'
                value={room.floor}
                className={classes.input}
                placeholder='Bedroom level'
                onChange={(ev) => handleRoomChange(ev, idx)}
              />
            )}
          </Col>
          <Col className={classes.col} xs={4}>
            <p>Bathroom location</p>
            <Dropdown
              showClear
              optionValue='value'
              optionLabel='label'
              options={locations}
              name='bathroomLocation'
              className={classes.input}
              value={room.bathroomLocation}
              placeholder='Bathroom location'
              onChange={(ev) => handleRoomChange(ev, idx)}
            />
          </Col>
          <Col className={`text-center ${classes.col}`} xs={12}>
            <h2 className={classes.subtitle}>Availability</h2>
            <AvailabilityPicker
              editable
              idx={idx}
              dispatch={dispatch}
              dates={room.availability as Date[]}
            />
          </Col>
        </Row>
      ))}
    </Container>
  )
}
