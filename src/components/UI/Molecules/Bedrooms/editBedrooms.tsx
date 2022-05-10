// main tools
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

// components
import { AvailabilityPicker } from 'components/UI/Atoms/AvailabilityPicker'

// bootstrap components
import { Col, Row, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { SelectButton } from 'primereact/selectbutton'
import { MultiSelect } from 'primereact/multiselect'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { StudentRoomDataType } from 'types/models/Home'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

interface EditBedroomsProps {
  data: StudentRoomDataType
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
      idx?: number
    }
    type: string
  }>
  idx: number
}

export const EditBedrooms: FC<EditBedroomsProps> = ({data, dispatch, idx }) => {
  const { data: session, status } = useSession()
  const [floors, setFloors] = useState(undefined)
  const [bedTypes, setBedTypes] = useState(undefined)
  const [roomPrivacities, setRoomPrivacities] = useState(undefined)
  const [additionalRoomFeatures, setAdditionalRoomFeatures] = useState(undefined)

  const locations = [
    { label: 'In the room', value: 'IN_THE_ROOM' },
    { label: 'Outside of the room', value: 'OUTSIDE_OF_THE_ROOM' },
  ]

  const handleRoomChange = (ev: SelectButtonChangeParams) => {
    dispatch({ type: 'handleRoomsChange', payload: { ev, idx  } })
  }

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
        setBedTypes(data.bedType)
        setRoomPrivacities(data.roomPrivacity)
        setAdditionalRoomFeatures(data.additionalRoomFeature)
      })()
    }
  }, [status, session])

  return (
    <Row className={classes.container}>
      <Col xs={6} className={`text-center ${classes.col}`}>
        <h2 className={classes.subtitle}>Room type</h2>
        {roomPrivacities === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <SelectButton
            required
            name='type'
            optionValue='_id'
            value={data.type}
            optionLabel='name'
            options={roomPrivacities}
            className={classes.buttons}
            onChange={(ev) => handleRoomChange(ev)}
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
            value={data.bathType}
            options={roomPrivacities}
            className={classes.buttons}
            onChange={(ev) => handleRoomChange(ev)}
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
            appendTo='self'
            optionValue='_id'
            optionLabel='name'
            name='aditionalFeatures'
            className={classes.input}
            value={data.aditionalFeatures}
            options={additionalRoomFeatures}
            placeholder='Additional features'
            onChange={(ev) => handleRoomChange(ev)}
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
            appendTo='self'
            optionValue='_id'
            optionLabel='name'
            options={bedTypes}
            value={data.bedType}
            placeholder='Bed types'
            className={classes.input}
            onChange={(ev) => handleRoomChange(ev)}
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
            appendTo='self'
            options={floors}
            optionValue='_id'
            optionLabel='name'
            value={data.floor}
            className={classes.input}
            placeholder='Bedroom level'
            onChange={(ev) => handleRoomChange(ev)}
          />
        )}
      </Col>
      <Col className={classes.col} xs={4}>
        <p>Bathroom location</p>
        <Dropdown
          showClear
          appendTo='self'
          optionValue='value'
          optionLabel='label'
          options={locations}
          name='bathroomLocation'
          className={classes.input}
          value={data.bathroomLocation}
          placeholder='Bathroom location'
          onChange={(ev) => handleRoomChange(ev)}
        />
      </Col>
      <Col className={`text-center ${classes.col}`} xs={12}>
        <h2 className={classes.subtitle}>Availability</h2>
        <AvailabilityPicker
          editable
          idx={idx}
          dispatch={dispatch}
          dates={data.availability as Date[]}
        />
      </Col>
    </Row>
  )
}
