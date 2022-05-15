//main tools
import { ChangeEvent, useState } from 'react'

// components
import { Map } from 'components/UI/Molecules/GoogleMap'

// prime components
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'

// bootstrap components
import { Col, Row, Spinner } from 'react-bootstrap'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { FamilyDataType, FamilyLocationDataType } from 'types/models/Family'
import { CheckboxChangeParams } from 'primereact/checkbox'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type LocationHomeProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev:
            | ChangeType
            | DropdownChangeParams
            | ChangeEvent<HTMLTextAreaElement>
            | { target: { name: string; value: null | '' } }
        }
      | { [key: string]: string }
      | DropdownChangeParams
      | FamilyLocationDataType
    type: string
  }>
}

export const LocationHome: FC<LocationHomeProps> = ({ dispatch, data }) => {
  const {
    city: cities,
    country: countrys,
    province: provinces,
    community: communitys,
  } = useGenerics(['city', 'province', 'country', 'community'])
  const [selectCityFreeComment, setSelectCityFreecoment] = useState(
    !!data.home?.cityFreeComment
  )
  const [markers, setMarkers] = useState<FamilyLocationDataType>({
    latitude: data.location?.latitude as number,
    longitude: data.location?.longitude as number,
  })

  const handleSelectCityFreeComment = (ev: CheckboxChangeParams) => {
    const { checked } = ev

    setSelectCityFreecoment(checked)

    if (checked)
      dispatch({
        type: 'handleLodgingChange',
        payload: { ev: { target: { name: 'city', value: null } } },
      })
    else
      dispatch({
        type: 'handleLodgingChange',
        payload: { ev: { target: { name: 'cityFreeComment', value: '' } } },
      })
  }

  const handleChange = (
    ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>
  ) => dispatch({ type: 'handleLodgingChange', payload: { ev } })

  const handleComunityChange = (ev: DropdownChangeParams) =>
    dispatch({ type: 'handleInternalDataChange', payload: ev })

  const handleLocationChange = (ev: ChangeType) => {
    setMarkers({ ...markers, [ev.target.name]: Number(ev.target.value) })
    dispatch({
      type: 'handleFamilyLocationChange',
      payload: { [ev.target.name]: ev.target.value },
    })
  }

  return (
    <>
      <h2 className={classes.subtitle}>Location</h2>
      <Divider />
      <Row>
        <Col className={classes.col} xs={12} md={6}>
          <p>Countrys</p>
          {!countrys ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              name='countrys'
              appendTo='self'
              optionLabel='name'
              options={countrys}
              onChange={handleChange}
              className={classes.input}
              value={data.home?.country}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Community</p>
          {!communitys ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              appendTo='self'
              name='community'
              optionValue='_id'
              optionLabel='name'
              options={communitys}
              className={classes.input}
              onChange={handleComunityChange}
              value={data.familyInternalData?.community}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Province</p>
          {!provinces ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              name='province'
              appendTo='self'
              optionLabel='name'
              options={provinces}
              onChange={handleChange}
              className={classes.input}
              value={data.home?.province}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>City</p>
          {!cities ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              name='city'
              appendTo='self'
              options={cities}
              optionLabel='name'
              value={data.home?.city}
              onChange={handleChange}
              className={classes.input}
              disabled={selectCityFreeComment}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Address</p>
          <InputTextarea
            rows={6}
            name='address'
            onChange={handleChange}
            className={classes.input}
            value={data.home?.address}
          />
        </Col>
        <Col xs={12} md={6}>
          <Row>
            <Col className={classes.col} xs={12}>
              <Checkbox
                className='mb-3 me-3'
                inputId='city-freecomment'
                checked={selectCityFreeComment}
                onChange={handleSelectCityFreeComment}
              />
              <label className='mb-3' htmlFor='city-freecomment'>
                City free comment
              </label>
              <InputText
                name='cityFreeComment'
                onChange={handleChange}
                className={classes.input}
                value={data.home?.cityFreeComment}
                disabled={!!!selectCityFreeComment}
              />
            </Col>
            <Col className={classes.col} xs={12}>
              <p>Main intersection</p>
              <InputText
                name='mainIntersection'
                onChange={handleChange}
                className={classes.input}
                value={data.home?.mainIntersection}
              />
            </Col>
          </Row>
        </Col>

        <Col className={classes.col} xs={12} md={6}>
          <p>Latitude</p>
          <InputText
            type='number'
            name='latitude'
            className={classes.input}
            value={data.location?.latitude}
            onChange={handleLocationChange}
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Postal Code</p>
          <InputText
            name='postalCode'
            onChange={handleChange}
            className={classes.input}
            value={data.home?.postalCode}
          />
        </Col>
        <Col className={classes.col} xs={12} md={6}>
          <p>Longitude</p>
          <InputText
            type='number'
            name='longitude'
            className={classes.input}
            onChange={handleLocationChange}
            value={data.location?.longitude}
          />
        </Col>
        <Col className={classes.col} xs={12}>
          <Map
            family={data}
            markers={markers}
            dispatch={dispatch}
            setMarkers={setMarkers}
          />
        </Col>
      </Row>
    </>
  )
}
