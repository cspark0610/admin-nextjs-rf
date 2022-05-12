// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// bootstrap components
import { Container, Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { InputTextarea } from 'primereact/inputtextarea'
import { AutoComplete } from 'primereact/autocomplete'
import { InputText } from 'primereact/inputtext'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { FC, Dispatch, ChangeEvent } from 'react'
import { HomeDataType } from 'types/models/Home'
import { ChangeType, SetStateType } from 'types'

type CreateLodgingProps = {
  data: HomeDataType
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>
      idx?: number
    } | null
    type: string
  }>
}

export const CreateLodging: FC<CreateLodgingProps> = ({ data, dispatch }) => {
  const { data: session, status } = useSession()
  const [countries, setCountries] = useState(undefined)
  const [provinces, setProvinces] = useState(undefined)
  const [filteredCities, setFilteredCities] = useState<GenericDataType[]>([])
  const [cities, setCities] = useState<GenericDataType[] | undefined>(undefined)
  const [filteredCountries, setFilteredCountries] = useState<GenericDataType[]>(
    []
  )
  const [filteredProvinces, setFilteredProvinces] = useState<GenericDataType[]>(
    []
  )

  /**
   * handle change home and dispatch data
   */
  const handleChange = (
    ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>
  ) => dispatch({ type: 'handleLodgingChange', payload: { ev } })

  /**
   * disable google's autocomplete attribute
   */
  const disableAutocomplete = (ref: HTMLInputElement) => {
    if (ref) ref.autocomplete = 'disabled'
  }

  /**
   * handle return cities by selected province
   */
  const handleCitiesByProvince = () =>
    cities?.filter(
      (singleCity) => singleCity.province === data.province?._id
    ) || []

  /**
   * handle search locations filter
   */
  const handleSearch = (
    ev: AutoCompleteCompleteMethodParams,
    locations: GenericDataType[],
    setter: SetStateType<GenericDataType[]>
  ) =>
    locations.length &&
    setter(
      locations?.filter((item) =>
        item.name?.toLowerCase().startsWith(ev.query.toLowerCase())
      ) || []
    )

  /**
   * handle get generics from backend
   */
  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          ['city', 'country', 'province']
        )
        setCities(data?.city)
        setCountries(data?.country)
        setProvinces(data?.province)
      })()
    }
  }, [status, session])

  return (
    <Container fluid className={classes.container}>
      <Row>
        <h2 className={classes.subtitle}>Location</h2>
        <Col className={classes.col} xs={12} md={4}>
          <p>Country</p>
          {countries === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <AutoComplete
              dropdown
              field='name'
              type='search'
              name='country'
              value={data.country}
              placeholder='Country'
              onChange={handleChange}
              inputClassName={classes.input}
              inputRef={disableAutocomplete}
              suggestions={filteredCountries}
              className={classes.autocomplete}
              completeMethod={(ev) =>
                handleSearch(ev, countries, setFilteredCountries)
              }
              onClick={(ev) =>
                (
                  (ev.target as HTMLElement).nextSibling as HTMLButtonElement
                )?.click()
              }
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={4}>
          <p>Province</p>
          {provinces === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <AutoComplete
              dropdown
              required
              field='name'
              type='search'
              name='province'
              value={data.province}
              placeholder='Province'
              onChange={handleChange}
              inputClassName={classes.input}
              inputRef={disableAutocomplete}
              suggestions={filteredProvinces}
              className={classes.autocomplete}
              completeMethod={(ev) =>
                handleSearch(ev, provinces, setFilteredProvinces)
              }
              onClick={(ev) =>
                (
                  (ev.target as HTMLElement).nextSibling as HTMLButtonElement
                )?.click()
              }
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={4}>
          <p>City</p>
          {cities === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <AutoComplete
              dropdown
              required
              name='city'
              field='name'
              type='search'
              value={data.city}
              placeholder='City'
              onChange={handleChange}
              disabled={!data.province}
              suggestions={filteredCities}
              inputClassName={classes.input}
              inputRef={disableAutocomplete}
              className={classes.autocomplete}
              completeMethod={(ev) =>
                handleSearch(ev, handleCitiesByProvince(), setFilteredCities)
              }
              onClick={(ev) =>
                (
                  (ev.target as HTMLElement).nextSibling as HTMLButtonElement
                )?.click()
              }
            />
          )}
        </Col>
        <Col className={classes.col} xs={12} md={7}>
          <Row>
            <Col className={classes.col} xs={12} sm={6}>
              <p>Address</p>
              <InputText
                required
                name='address'
                value={data.address}
                onChange={handleChange}
                className={classes.input}
                placeholder='Suit #, Unit #'
              />
            </Col>
            <Col className={classes.col} xs={12} sm={6}>
              <p>Postal code</p>
              <InputText
                required
                name='postalCode'
                placeholder='A0A A0A'
                onChange={handleChange}
                value={data.postalCode}
                className={classes.input}
              />
            </Col>
            <Col className={classes.col} xs={12}>
              <p>Main intersection</p>
              <InputText
                required
                onChange={handleChange}
                name='mainIntersection'
                className={classes.input}
                value={data.mainIntersection}
                placeholder='Main intersection'
              />
            </Col>
          </Row>
        </Col>
        <Col className={classes.col} xs={12} md={5}>
          <p>Describe your area or neighbourhood</p>
          <InputTextarea
            required
            rows={6}
            name='description'
            onChange={handleChange}
            value={data.description}
            className={classes.input}
            placeholder="it's a small community"
          />
        </Col>
      </Row>
    </Container>
  )
}
