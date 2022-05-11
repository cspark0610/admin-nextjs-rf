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
import { useGenerics } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { StudentRoomDataType } from 'types/models/Home'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

interface EditBedroomsProps {
  data: StudentRoomDataType
  handleSave: ()=> void
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
      idx?: number
    }
    type: string
  }>
  idx: number
}

export const EditBedrooms: FC<EditBedroomsProps> = ({data, handleSave, dispatch, idx }) => {
  const [room, setRoom] = useState(data)
  const { floors, bedTypes, roomPrivacity, additionalRoomFeatures } = 
    useGenerics()
  
  const handleRoomChange = (ev: SelectButtonChangeParams) => {
    setRoom({...room, [ev.target.name]: ev.value })
    dispatch({ type: 'handleRoomsChange', payload: { ev, idx  } })
  }

  return (
    <Row className={classes.container}>
      <Col xs={6} className={`text-center ${classes.col}`}>
        <h2 className={classes.subtitle}>Room type</h2>
        {roomPrivacity === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <SelectButton
            required
            name='type'
            optionValue='_id'
            value={room?.type}
            optionLabel='name'
            options={roomPrivacity}
            className={classes.buttons}
            onChange={(ev) => handleRoomChange(ev)}
          />
        )}
      </Col>
      <Col xs={6} className={`text-center ${classes.col}`}>
        <h2 className={classes.subtitle}>Bathroom type</h2>
        {roomPrivacity === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <SelectButton
            required
            name='bathType'
            optionValue='_id'
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
            value={room?.aditionalFeatures}
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
            value={room?.bedType}
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
        <Button className={classes.button} onClick={handleSave}>Save</Button>
      </Col>
    </Row>
  )
}
