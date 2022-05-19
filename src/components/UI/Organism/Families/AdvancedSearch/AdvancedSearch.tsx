// main tools
import { useState } from 'react'
import dayjs from 'dayjs'

// components
import { LocationFilter } from './locationFilter'

// bootstrap components
import { Container, Modal, Row, Col, Spinner, Button } from 'react-bootstrap'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'

// prime components
import { Accordion, AccordionTab } from 'primereact/accordion'
import { RadioButton } from 'primereact/radiobutton'
import { MultiSelect } from 'primereact/multiselect'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { AutoCompleteChangeParams } from 'primereact/autocomplete'
import { RadioButtonChangeParams } from 'primereact/radiobutton'
import { CalendarChangeParams } from 'primereact/calendar'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FilterFamilyDataType } from 'types/models/Family'
import { ChangeType, SetStateType } from 'types'
import { FC } from 'react'

type AdvancedSearchProps = {
  setShowSearcher: SetStateType<boolean>
  handleSearch: (filter: any) => void
  showSearcher: boolean
}

export const AdvancedSearch: FC<AdvancedSearchProps> = ({
  setShowSearcher,
  showSearcher,
  handleSearch,
}) => {
  const [filter, setFilter] = useState<FilterFamilyDataType>({
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
  const { loading, homeType, interest, service, roomPrivacity } = useGenerics([
    'service',
    'homeType',
    'interest',
    'roomPrivacity',
  ])

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
    { name: 'No children', val: { childrensAmount: '0' } },
    { name: 'One child', val: { childrensAmount: '1' } },
    { name: 'Two or more children', val: { familyMemberAmount: '>2' } },
  ]

  /**
   * handle close searcher modal
   */
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

  /**
   * handle add quantity of student rooms
   */
  const handleAddStudentRoom = () =>
    setFilter({
      ...filter,
      studentRooms: ((filter.studentRooms || 0) + 1) as number,
    })

  /**
   * handle remove quantity of student rooms
   */
  const handleRemoveStudentRoom = () =>
    setFilter({
      ...filter,
      studentRooms:
        filter.studentRooms - 1 >= 0 ? (filter.studentRooms || 0) - 1 : 0,
    })

  /**
   * handle familyMembers filter change
   */
  const handleFamilyMembersChange = (ev: DropdownChangeParams) => {
    const { familyMemberAmount, childrensAmount } = ev.value

    setFilter({
      ...filter,
      ...(familyMemberAmount
        ? { familyMemberAmount, childrensAmount: null }
        : { familyMemberAmount: null, childrensAmount }),
    })
  }

  const handleEmitSearchFilter = () => {
    const formatFilter = {
      ...filter,
      arrival: filter.arrival ? (filter.arrival as Date).toISOString() : null,
      departure: filter.departure
        ? (filter.departure as Date).toISOString()
        : null,
      ...(filter.location?.isProvince
        ? { province: filter.location.name }
        : { city: filter.location?.name }),
      location: undefined,
    }

    window.localStorage.setItem('lastFilter', JSON.stringify(formatFilter))

    handleSearch(formatFilter)
    setShowSearcher(false)
  }

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
                  <LocationFilter
                    location={filter.location}
                    handleChange={handleChange}
                  />
                </Col>
                <Col className={classes.col} xs={12} md={6}>
                  <p>Home type</p>
                  {loading ? (
                    <Spinner animation='grow' />
                  ) : (
                    <Dropdown
                      appendTo='self'
                      name='homeType'
                      optionLabel='name'
                      optionValue='name'
                      options={homeType}
                      placeholder='Home type'
                      value={filter.homeType}
                      onChange={handleChange}
                      className={classes.input}
                    />
                  )}
                </Col>
                <Col className={classes.col} xs={12} md={6}>
                  <p>Hobbies</p>
                  {loading ? (
                    <Spinner animation='grow' />
                  ) : (
                    <Dropdown
                      filter
                      appendTo='self'
                      name='interests'
                      optionLabel='name'
                      optionValue='name'
                      options={interest}
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
                      {loading ? (
                        <Spinner animation='grow' />
                      ) : (
                        roomPrivacity.map((privacity) => (
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
                    onChange={handleChange}
                    minDate={dayjs().toDate()}
                    value={filter.arrival as Date}
                    inputClassName={classes.input}
                  />
                  <p>Departure</p>
                  <Calendar
                    appendTo='self'
                    name='departure'
                    className='w-100'
                    onChange={handleChange}
                    disabled={!filter.arrival}
                    inputClassName={classes.input}
                    value={filter.departure as Date}
                    minDate={dayjs(filter.arrival).toDate()}
                  />
                </AccordionTab>
                <AccordionTab header='Services'>
                  {loading ? (
                    <Spinner animation='grow' />
                  ) : (
                    <MultiSelect
                      filter
                      showClear
                      display='chip'
                      name='services'
                      appendTo='self'
                      options={service}
                      optionLabel='name'
                      optionValue='name'
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
            <Button className={classes.input} onClick={handleEmitSearchFilter}>
              Search
            </Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}
