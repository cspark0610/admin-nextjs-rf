// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

// bootstrap components
import { Container, Modal, Row, Col, Spinner, Button } from 'react-bootstrap'
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
import { RadioButtonChangeParams } from 'primereact/radiobutton'
import { CalendarChangeParams } from 'primereact/calendar'
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { ChangeType, SetStateType } from 'types'
import { FC } from 'react'

type AdvancedSearchProps = {
  setShowSearcher: SetStateType<boolean>
  handleSearch: (filter: any) => void
  showSearcher: boolean
}

export type FilterDataType = {
  services: string[]
  studentRooms: number
  homeType: string | null
  havePets: string | null
  interests: string | null
  roomTypes: string | null
  schoolTypes: string | null
  haveTenants: string | null
  arrival: string | undefined
  departure: string | undefined
  childrensAmount: string | null
  familyMemberAmount: string | null
  haveNoRedLeafStudents: string | null
  location?: { isProvince: boolean; name: string } | null
}

export const AdvancedSearch: FC<AdvancedSearchProps> = ({
  setShowSearcher,
  showSearcher,
  handleSearch,
}) => {
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
  const [filter, setFilter] = useState({
    services: null,
    location: null,
    homeType: null,
    havePets: null,
    interests: null,
    roomTypes: null,
    schoolTypes: null,
    haveTenants: null,
    studentRooms: NaN,
    arrival: undefined,
    departure: undefined,
    childrensAmount: null,
    familyMemberAmount: null,
    haveNoRedLeafStudents: null,
  })

  const schoolTypes = [
    { name: 'Elementary school', val: 'ELEMENTARY_SCHOOL' },
    { name: 'Hight school', val: 'HIGH_SCHOOL' },
  ]
  const booleaNOptions = [
    { name: 'Yes', value: 'true' },
    { name: 'No', value: 'false' },
  ]
  const familyMembersOptions = [
    { name: 'More than one member', val: { familyMemberAmount: '>1' } },
    { name: 'No children', val: { childrensAmount: '0' } },
    { name: 'One child', val: { childrensAmount: '1' } },
    { name: 'Two or more children', val: { familyMemberAmount: '>2' } },
  ]

  const handleCloseSearcher = () => setShowSearcher(false)

  /**
   * handle filter change
   */
  const handleChange = (
    ev:
      | ChangeType
      | CalendarChangeParams
      | DropdownChangeParams
      | RadioButtonChangeParams
      | AutoCompleteChangeParams
  ) => setFilter({ ...filter, [ev.target.name]: ev.target.value })

  const handleAddStudentRoom = () =>
    setFilter({
      ...filter,
      studentRooms: ((filter.studentRooms || 0) + 1) as number,
    })
  const handleRemoveStudentRoom = () =>
    setFilter({
      ...filter,
      studentRooms:
        filter.studentRooms - 1 >= 0 ? (filter.studentRooms || 0) - 1 : 0,
    })

  const handleFamilyMembersChange = (ev: DropdownChangeParams) => {
    const { familyMemberAmount, childrensAmount } = ev.value

    setFilter({
      ...filter,
      ...(familyMemberAmount
        ? { familyMemberAmount, childrensAmount: null }
        : { familyMemberAmount: null, childrensAmount }),
    })
  }

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

    locations?.forEach((province: any) => {
      const filteredItems = province.cities.filter(
        (item: any) =>
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
    })

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

        province?.forEach((prov: any) => {
          prov['cities'] = [
            { ...prov, isProvince: true },
            ...city
              .filter((cit: any) => cit.province === prov._id)
              .map((cit: any) => ({ ...cit, isProvince: false })),
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
                      name='location'
                      appendTo='self'
                      className='w-100'
                      optionGroupLabel='name'
                      onChange={handleChange}
                      value={filter.location}
                      optionGroupChildren='cities'
                      placeholder='Select location'
                      inputClassName={classes.input}
                      itemTemplate={locationTemplate}
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
                      appendTo='self'
                      name='homeType'
                      optionLabel='name'
                      optionValue='name'
                      options={homeTypes}
                      placeholder='Home type'
                      value={filter.homeType}
                      onChange={handleChange}
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
                      name='interests'
                      optionLabel='name'
                      optionValue='name'
                      options={interests}
                      placeholder='Hobbies'
                      onChange={handleChange}
                      value={filter.interests}
                      className={classes.input}
                    />
                  )}
                </Col>
                <Col className={classes.col} xs={12} md={6}>
                  <p>School type</p>
                  <Dropdown
                    appendTo='self'
                    optionValue='val'
                    optionLabel='name'
                    name='schoolTypes'
                    options={schoolTypes}
                    onChange={handleChange}
                    placeholder='School type'
                    className={classes.input}
                    value={filter.schoolTypes}
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
                              name='roomTypes'
                              value={privacity.name}
                              inputId={privacity._id}
                              onChange={handleChange}
                              checked={filter.roomTypes === privacity.name}
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
                          <RadioButton
                            value={item.value}
                            inputId={item.name}
                            onChange={handleChange}
                            name='haveNoRedLeafStudents'
                            checked={
                              filter.haveNoRedLeafStudents === item.value
                            }
                          />{' '}
                          <label htmlFor={item.name}>{item.name}</label>
                        </div>
                      ))}
                    </Col>
                    <Col className={classes.col} xs={12} md={6} lg={3}>
                      <p>Tenants</p>
                      {booleaNOptions.map((item) => (
                        <div className='mb-2' key={item.name}>
                          <RadioButton
                            name='haveTenants'
                            value={item.value}
                            inputId={item.name}
                            onChange={handleChange}
                            checked={filter.haveTenants === item.value}
                          />{' '}
                          <label htmlFor={item.name}>{item.name}</label>
                        </div>
                      ))}
                    </Col>
                    <Col className={classes.col} xs={12} md={6} lg={2}>
                      <p>Pets</p>
                      {booleaNOptions.map((item) => (
                        <div className='mb-2' key={item.name}>
                          <RadioButton
                            name='havePets'
                            value={item.value}
                            inputId={item.name}
                            onChange={handleChange}
                            checked={filter.havePets === item.value}
                          />{' '}
                          <label htmlFor={item.name}>{item.name}</label>
                        </div>
                      ))}
                    </Col>
                    <Col className={classes.col} xs={12} md={5}>
                      <p>Rooms for students</p>
                      <div className={classes.counter}>
                        <DashCircle
                          onClick={handleRemoveStudentRoom}
                          role='button'
                        />
                        <p>{filter.studentRooms || 0}</p>
                        <PlusCircle
                          onClick={handleAddStudentRoom}
                          role='button'
                        />
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
                        onChange={handleFamilyMembersChange}
                        value={
                          !!filter.childrensAmount
                            ? { childrensAmount: filter.childrensAmount }
                            : { familyMemberAmount: filter.familyMemberAmount }
                        }
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
                    name='arrival'
                    appendTo='self'
                    className='w-100 mb-4'
                    value={filter.arrival}
                    onChange={handleChange}
                    minDate={dayjs().toDate()}
                    inputClassName={classes.input}
                  />
                  <p>Departure</p>
                  <Calendar
                    appendTo='self'
                    name='departure'
                    className='w-100'
                    onChange={handleChange}
                    value={filter.departure}
                    disabled={!filter.arrival}
                    inputClassName={classes.input}
                    minDate={dayjs(filter.arrival).toDate()}
                  />
                </AccordionTab>
                <AccordionTab header='Services'>
                  {services === undefined ? (
                    <Spinner animation='grow' />
                  ) : (
                    <MultiSelect
                      filter
                      showClear
                      display='chip'
                      name='services'
                      appendTo='self'
                      optionLabel='name'
                      optionValue='name'
                      options={services}
                      placeholder='Services'
                      onChange={handleChange}
                      className={classes.input}
                      value={filter.services || []}
                    />
                  )}
                </AccordionTab>
              </Accordion>
            </Col>
          </Row>
          <Row>
            <Button
              className={classes.input}
              onClick={() => {
                handleSearch(filter)
                setShowSearcher(false)
              }}>
              Search
            </Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}
