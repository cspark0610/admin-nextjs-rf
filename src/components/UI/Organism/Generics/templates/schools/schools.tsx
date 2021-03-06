// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// components
import { SchoolsMap } from './Map'

// bootstrap components
import { Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'

//services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Config/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { ChangeType } from 'types'
import { FC } from 'react'

export type CreateSchoolProps = {
  handleChange: (ev: ChangeType | DropdownChangeParams | object) => void
  handleChangeLocation: (ev: {
    latLng: { lat: () => number; lng: () => number }
  }) => void
  data: GenericDataType
}

export const CreateSchool: FC<CreateSchoolProps> = ({
  handleChangeLocation,
  handleChange,
  data,
}) => {
  const { data: session } = useSession()
  const [countries, setCountries] = useState<GenericDataType[] | undefined>(
    undefined
  )
  const [provinces, setProvinces] = useState<GenericDataType[] | undefined>(
    undefined
  )
  const [cities, setCities] = useState<GenericDataType[] | undefined>(undefined)
  const [courses, setCourses] = useState<GenericDataType[] | undefined>(
    undefined
  )
  const types = [
    { name: 'Elementary school', value: 'ELEMENTARY_SCHOOL' },
    { name: 'Hight school', value: 'HIGH_SCHOOL' },
  ]

  /**
   * handle get cities by selected province
   */
  const getCitiesByProvince = () =>
    cities?.filter((city) => city.province === data.province)

  /**
   * handle get countries, provinces
   * cities and academic courses from backend
   */
  useEffect(() => {
    ;(async () => {
      const { data } = await GenericsService.getAllByModelnames(
        session?.token as string,
        ['country', 'province', 'city', 'academicCourse']
      )
      setCourses(data.academicCourse)
      setProvinces(data.province)
      setCountries(data.country)
      setCities(data.city)
    })()
  }, [session])

  /**
   * handle clear city on
   * province selection change
   */
  // useEffect(
  //   () => handleChange({ target: { name: 'city', value: null } }),
  //   [data.province, handleChange]
  // )

  return (
    <Row>
      <Col className={classes.col} xs={6}>
        <InputText
          required
          name='name'
          value={data.name}
          onChange={handleChange}
          className={classes.input}
          placeholder="Generic's name"
        />
      </Col>
      <Col className={classes.col} xs={6}>
        <Dropdown
          name='type'
          options={types}
          value={data.type}
          optionLabel='name'
          optionValue='value'
          onChange={handleChange}
          placeholder='School type'
          className={classes.input}
        />
      </Col>
      <Col className={classes.col} xs={6}>
        {courses === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <MultiSelect
            showClear
            display='chip'
            name='courses'
            optionValue='_id'
            options={courses}
            optionLabel='name'
            value={data.courses}
            placeholder='Courses'
            onChange={handleChange}
            className={classes.input}
          />
        )}
      </Col>
      <Col className={classes.col} xs={6}>
        {countries === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            name='country'
            optionValue='_id'
            optionLabel='name'
            options={countries}
            value={data.country}
            placeholder='Country'
            onChange={handleChange}
            className={classes.input}
          />
        )}
      </Col>
      <Col className={classes.col} xs={6}>
        {provinces === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            name='province'
            optionValue='_id'
            optionLabel='name'
            options={provinces}
            value={data.province}
            placeholder='Province'
            onChange={handleChange}
            className={classes.input}
          />
        )}
      </Col>
      <Col className={classes.col} xs={6}>
        {cities === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            name='city'
            optionValue='_id'
            value={data.city}
            optionLabel='name'
            placeholder='City'
            onChange={handleChange}
            disabled={!data.province}
            className={classes.input}
            options={getCitiesByProvince()}
          />
        )}
      </Col>
      <Col className={classes.col} xs={6}>
        <InputNumber
          mode='decimal'
          name='latitude'
          className='w-100'
          minFractionDigits={2}
          value={data.latitude}
          placeholder='Latitude'
          maxFractionDigits={20}
          onValueChange={handleChange}
          inputClassName={classes.input}
        />
      </Col>
      <Col className={classes.col} xs={6}>
        <InputNumber
          mode='decimal'
          name='longitude'
          className='w-100'
          minFractionDigits={2}
          value={data.longitude}
          maxFractionDigits={20}
          placeholder='Longitude'
          onValueChange={handleChange}
          inputClassName={classes.input}
        />
      </Col>
      <Col className={classes.col} xs={12}>
        <SchoolsMap school={data} handleChangeLocation={handleChangeLocation} />
      </Col>
    </Row>
  )
}
