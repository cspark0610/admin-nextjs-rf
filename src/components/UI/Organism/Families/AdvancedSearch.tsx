// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

// bootstrap components
import { Container, Modal, Row, Col, Spinner } from 'react-bootstrap'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'

// prime components
import { Accordion, AccordionTab } from 'primereact/accordion'
import { AutoComplete } from 'primereact/autocomplete'
import { RadioButton } from 'primereact/radiobutton'
import { MultiSelect } from 'primereact/multiselect'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'

// services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  AutoCompleteChangeParams,
  AutoCompleteCompleteMethodParams,
} from 'primereact/autocomplete'
import { GenericDataType } from 'types/models/Generic'
import { FamilyDataType } from 'types/models/Family'
import { ChangeType, SetStateType } from 'types'
import { FC } from 'react'

type AdvancedSearchProps = {
  setFamilies: SetStateType<FamilyDataType[]>
  setShowSearcher: SetStateType<boolean>
  showSearcher: boolean
}

export const AdvancedSearch: FC<AdvancedSearchProps> = ({
  setShowSearcher,
  showSearcher,
  setFamilies,
}) => {
  const [selectedLocation, setSelectedLocation] = useState('')
  const [interests, setInterests] = useState(undefined)
  const [homeTypes, setHomeTypes] = useState(undefined)
  const [programs, setPrograms] = useState(undefined)
  const [services, setServices] = useState(undefined)
  const { data: session, status } = useSession()
  const [roomPrivacities, setRoomPrivacities] = useState<
    GenericDataType[] | undefined
  >(undefined)
  const [locations, setLocations] = useState<
    (GenericDataType & { cities: GenericDataType })[] | undefined
  >(undefined)
  const [filteredLocations, setFilteredLocations] = useState<
    (GenericDataType & { cities: GenericDataType })[]
  >([])
  const [filter, setFilter] = useState({})

  const schoolTypes = [
    { name: 'Elementary school', val: 'ELEMENTARY_SCHOOL' },
    { name: 'Hight school', val: 'HIGH_SCHOOL' },
  ]
  const booleaNOptions = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ]
  const familyMembersOptions = [
    { name: 'More than one member', val: { familyMemberAmount: '>1' } },
    { name: 'No children', val: { childrensAmount: 0 } },
    { name: 'One child', val: { childrensAmount: 1 } },
    { name: 'Two or more children', val: { familyMemberAmount: '>2' } },
  ]

  const handleCloseSearcher = () => setShowSearcher(false)

  /**
   * handle change location
   */
  const handleLocationChange = (e: AutoCompleteChangeParams) =>
    setSelectedLocation(e.value)

  /**
   * handle filter change
   */
  const handleChange = (ev: ChangeType) => console.log(ev.target)

  /**
   * handle searcher locations change for
   * filter the locations array on every type
   *
   * @param {string} query
   */
  const handleSearchLocation = ({
    query,
  }: AutoCompleteCompleteMethodParams) => {
    const updateFilteredLocations: any[] = []

    locations?.forEach(
      (province: GenericDataType & { cities: GenericDataType[] }) => {
        const filteredItems = province.cities.filter(
          (item) =>
            item.name
              ?.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .indexOf(
                query
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
              ) !== -1
        )
        if (filteredItems && filteredItems.length)
          updateFilteredLocations.push({ ...province, cities: filteredItems })
      }
    )

    setFilteredLocations([...updateFilteredLocations])
  }

  /**
   * template for location item
   */
  const locationTemplate = (item: any) => (
    <span>
      <i
        className={`pi ${item.isProvince ? 'pi-globe' : 'pi-map-marker'} ${
          classes.inputs_items
        }`}
      />{' '}
      {item.name}
    </span>
  )

  useEffect(() => {
    if (session?.token) {
      ;(async () => {
        const {
          data: {
            city,
            program,
            service,
            province,
            homeType,
            interest,
            roomPrivacity,
          },
        } = await GenericsService.getAllByModelnames(session.token, [
          'city',
          'service',
          'program',
          'homeType',
          'interest',
          'province',
          'roomPrivacity',
        ])

        province?.forEach((prov: GenericDataType) => {
          prov['cities'] = [
            { ...prov, isProvince: true },
            ...city
              .filter((cit: GenericDataType) => cit.province === prov._id)
              .map((cit: GenericDataType) => ({ ...cit, isProvince: false })),
          ]
        })

        setPrograms(program)
        setServices(service)
        setInterests(interest)
        setHomeTypes(homeType)
        setLocations(province)
        setRoomPrivacities(roomPrivacity)
      })()
    }
  }, [session?.token, status])

  return (
    <Modal
      centered
      size='xl'
      show={showSearcher}
      onHide={handleCloseSearcher}
      contentClassName={classes.modal}>
      <Modal.Header closeButton className={classes.modal_close} />
      <Modal.Body>
        <Container className={classes.container}>
          <h2 className={classes.subtitle}>Search</h2>
          <Row>
            <Col xs={12} md={6}>
              <Row>
                <Col className={classes.col} xs={12} md={6}>
                  <p>Location</p>
                  {locations === undefined ? (
                    <Spinner animation='grow' />
                  ) : (
                    <AutoComplete
                      dropdown
                      field='name'
                      id='location'
                      appendTo='self'
                      className='w-100'
                      optionGroupLabel='name'
                      value={selectedLocation}
                      optionGroupChildren='cities'
                      placeholder='Select location'
                      inputClassName={classes.input}
                      itemTemplate={locationTemplate}
                      onChange={handleLocationChange}
                      suggestions={filteredLocations}
                      completeMethod={handleSearchLocation}
                      onClick={(ev) =>
                        (
                          (ev.target as HTMLElement).nextSibling as HTMLElement
                        ).click()
                      }
                    />
                  )}
                </Col>
                <Col className={classes.col} xs={12} md={6}>
                  <p>Home type</p>
                  {homeTypes === undefined ? (
                    <Spinner animation='grow' />
                  ) : (
                    <Dropdown
                      filter
                      appendTo='self'
                      optionLabel='name'
                      optionValue='name'
                      options={homeTypes}
                      placeholder='Home type'
                      className={classes.input}
                    />
                  )}
                </Col>
                <Col className={classes.col} xs={12} md={6}>
                  <p>Hobbies</p>
                  {interests === undefined ? (
                    <Spinner animation='grow' />
                  ) : (
                    <Dropdown
                      filter
                      appendTo='self'
                      optionLabel='name'
                      optionValue='name'
                      options={interests}
                      placeholder='Hobbies'
                      className={classes.input}
                    />
                  )}
                </Col>
                <Col className={classes.col} xs={12} md={6}>
                  <p>School type</p>
                  <Dropdown
                    filter
                    appendTo='self'
                    optionValue='val'
                    optionLabel='name'
                    options={schoolTypes}
                    placeholder='School type'
                    className={classes.input}
                  />
                </Col>
                <Col xs={12}>
                  <Row>
                    <Col className={classes.col} xs={12} md={6} lg={3}>
                      <p>Type of rooms</p>
                      {roomPrivacities === undefined ? (
                        <Spinner animation='grow' />
                      ) : (
                        roomPrivacities.map((privacity) => (
                          <div className='mb-2' key={privacity._id}>
                            <RadioButton
                              value={privacity.name}
                              inputId={privacity._id}
                            />{' '}
                            <label htmlFor={privacity._id}>
                              {privacity.name}
                            </label>
                          </div>
                        ))
                      )}
                    </Col>
                    <Col className={classes.col} xs={12} md={6} lg={4}>
                      <p>External students</p>
                      {booleaNOptions.map((item) => (
                        <div className='mb-2' key={item.name}>
                          <RadioButton value={item.value} inputId={item.name} />{' '}
                          <label htmlFor={item.name}>{item.name}</label>
                        </div>
                      ))}
                    </Col>
                    <Col className={classes.col} xs={12} md={6} lg={3}>
                      <p>Tenants</p>
                      {booleaNOptions.map((item) => (
                        <div className='mb-2' key={item.name}>
                          <RadioButton value={item.value} inputId={item.name} />{' '}
                          <label htmlFor={item.name}>{item.name}</label>
                        </div>
                      ))}
                    </Col>
                    <Col className={classes.col} xs={12} md={6} lg={2}>
                      <p>Pets</p>
                      {booleaNOptions.map((item) => (
                        <div className='mb-2' key={item.name}>
                          <RadioButton value={item.value} inputId={item.name} />{' '}
                          <label htmlFor={item.name}>{item.name}</label>
                        </div>
                      ))}
                    </Col>
                    <Col className={classes.col} xs={12} md={5}>
                      <p>Rooms for students</p>
                      <div className={classes.counter}>
                        <DashCircle role='button' />
                        <p>0</p>
                        <PlusCircle role='button' />
                      </div>
                    </Col>
                    <Col className={classes.col} xs={12} md={7}>
                      <p>Family members</p>
                      <Dropdown
                        filter
                        appendTo='self'
                        optionValue='val'
                        optionLabel='name'
                        className={classes.input}
                        placeholder='FamilyMembers'
                        options={familyMembersOptions}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6}>
              <Accordion multiple activeIndex={[0]}>
                <AccordionTab header='Bedroom availability'>
                  <p>Arribal</p>
                  <Calendar
                    yearNavigator
                    appendTo='self'
                    className='w-100 mb-4'
                    maxDate={dayjs().toDate()}
                    inputClassName={classes.input}
                    yearRange={`${dayjs()
                      .subtract(100, 'years')
                      .year()}:${dayjs().year()}`}
                  />
                  <p>Departure</p>
                  <Calendar
                    yearNavigator
                    appendTo='self'
                    className='w-100'
                    maxDate={dayjs().toDate()}
                    inputClassName={classes.input}
                    yearRange={`${dayjs()
                      .subtract(100, 'years')
                      .year()}:${dayjs().year()}`}
                  />
                </AccordionTab>
                <AccordionTab header='Services'>
                  {services === undefined ? (
                    <Spinner animation='grow' />
                  ) : (
                    <Dropdown
                      filter
                      appendTo='self'
                      optionLabel='name'
                      optionValue='name'
                      options={services}
                      placeholder='Services'
                      className={classes.input}
                    />
                  )}
                </AccordionTab>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}
