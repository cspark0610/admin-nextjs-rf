// main tools
import { useState } from 'react'

// components
import { AvailabilityPicker } from 'components/UI/Atoms/AvailabilityPicker'
import { locations } from '../Datatable/options'

// bootstrap components
import { Button, Col, Row, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { SelectButton } from 'primereact/selectbutton'
import { MultiSelect } from 'primereact/multiselect'

// services
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { StudentRoomDataType } from 'types/models/Home'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

interface EditBedroomsProps {
  data: StudentRoomDataType
  handleSave: () => void
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
      idx?: number
    }
    type: string
  }>
  idx: number
}

export const EditBedrooms: FC<EditBedroomsProps> = ({
  idx,
  data,
  dispatch,
  handleSave,
}) => {
  const [room, setRoom] = useState(data)
  const { loading, floor, bedType, roomPrivacity, additionalRoomFeature } =
    useGenerics(['floor', 'bedType', 'roomPrivacity', 'additionalRoomFeature'])

  /**
   * handle change room
   * data by index
   */
  const handleRoomChange = (ev: SelectButtonChangeParams) => {
    setRoom({ ...room, [ev.target.name]: ev.value })
    dispatch({ type: 'handleRoomsChange', payload: { ev, idx } })
  }

  return (
    <Row className={classes.container}>
      <h2 className={`text-center ${classes.subtitle}`}>
        Student room: {room?.roomNumber}
      </h2>
      <Col xs={6} className={`text-center ${classes.col}`}>
        <h2 className={classes.subtitle}>Room type</h2>
        {loading ? (
          <Spinner animation='grow' />
        ) : (
          <SelectButton
            required
            name='type'
            optionLabel='name'
            value={room?.type}
            options={roomPrivacity}
            className={classes.buttons}
            onChange={(ev) => handleRoomChange(ev)}
          />
        )}
      </Col>
      <Col xs={6} className={`text-center ${classes.col}`}>
        <h2 className={classes.subtitle}>Bathroom type</h2>
        {loading ? (
          <Spinner animation='grow' />
        ) : (
          <SelectButton
            required
            name='bathType'
            optionLabel='name'
            value={room?.bathType}
            options={roomPrivacity}
            className={classes.buttons}
            onChange={(ev) => handleRoomChange(ev)}
          />
        )}
      </Col>
      <Col className={classes.col} xs={12}>
        <p>Additional features</p>
        {loading ? (
          <Spinner animation='grow' />
        ) : (
          <MultiSelect
            filter
            showClear
            display='chip'
            appendTo='self'
            optionLabel='name'
            name='aditionalFeatures'
            className={classes.input}
            value={room?.aditionalFeatures}
            options={additionalRoomFeature}
            placeholder='Additional features'
            onChange={(ev) => handleRoomChange(ev)}
          />
        )}
      </Col>
      <Col className={classes.col} xs={4}>
        <p>Bed type</p>
        {loading ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            showClear
            name='bedType'
            appendTo='self'
            options={bedType}
            optionLabel='name'
            value={room?.bedType}
            placeholder='Bed types'
            className={classes.input}
            onChange={(ev) => handleRoomChange(ev)}
          />
        )}
      </Col>
      <Col className={classes.col} xs={4}>
        <p>Bedroom level</p>
        {loading ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            showClear
            name='floor'
            appendTo='self'
            options={floor}
            optionLabel='name'
            value={room?.floor}
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
          value={room?.bathroomLocation}
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
          dates={room?.availability as Date[]}
        />
      </Col>
      <Col>
        <Button className={classes.button} onClick={handleSave}>
          Save
        </Button>
      </Col>
    </Row>
  )
}
