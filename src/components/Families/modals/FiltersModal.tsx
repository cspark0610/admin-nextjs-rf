// main tools
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import axios from 'axios'
import Image from 'next/image'

// components
import Modal from 'components/UI/Molecules/Modal'
import InputContainer from 'components/UI/Molecules/InputContainer'

// prime components
import { InputNumber } from 'primereact/inputnumber'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Calendar } from 'primereact/calendar'
import { AutoComplete } from 'primereact/autocomplete'
import { MultiSelect } from 'primereact/multiselect'
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'
import { Dropdown } from 'primereact/dropdown'
import PrimeReact from 'primereact/api'
import { Ripple } from 'primereact/ripple'

// services
import GenericsService from 'services/Generics'
import FamiliesService from 'services/Families'

// utils
import formatName from 'utils/formatName'

// types
import { FormEvent } from 'react'

type generics = {
  name: string
  createdAt: string
  updatedAt: string
  _id: string
  __v: number

  // optionals
  courses?: generics[]
  province?: string
  cities?: generics[]
  isProvince?: boolean
  latitude?: number
  longitude?: number
  icon?: string
  type?: string
  location?: { _id: string; latitude: number; longitude: number }
}

type isData = {
  // inputs
  location: generics
  province: string
  hobbies: generics[]
  schoolTypes: string
  homeType: string
  // radio
  havePets: boolean | null
  haveTenants: boolean | null
  haveNoRedLeafStudents: boolean | null
  roomTypes: string
  // numbers
  familyMemberAmount: number
  studentRooms: number
  // services
  services: string
  // availability
  arrivalDate: Date
  departureDate: Date
}

const INITIAL_DATA = {
  //inputs
  location: null,
  province: null,
  schoolTypes: null,
  homeType: null,
  //radio
  havePets: null,
  haveTenants: null,
  haveNoRedLeafStudents: null,
  roomTypes: null,
  //numbers
  familyMemberAmount: null,
  studentRooms: null,
  //svc
  services: null,
  hobbies: undefined,
  //availability
  arrivalDate: null,
  departureDate: null,
}

const msFamily = 'ms-fands/api/v1'

export default function FiltersModal({ visible, setVisible, setFamilies }) {
  PrimeReact.ripple = true
  const [session] = useSession()
  // modal data states
  const [services, setServices] = useState<generics[]>([])
  const [schools, setSchools] = useState<string[]>([])
  const [hobbies, setHobbies] = useState<generics[]>([])
  const [homeTypes, setHomeTypes] = useState<string[]>([])
  const [locations, setLocations] = useState<generics[]>([])
  const [filteredLocation, setFilteredLocation] = useState<generics[]>([])
  const [data, setData] = useState<isData>(INITIAL_DATA)

  const Templ = (item: generics) => (
    <span>
      <i className={`pi ${item.isProvince ? 'pi-globe' : 'pi-map-marker'}`} />{' '}
      {item.name}
    </span>
  )

  //svc handler
  const handleSelectService = (svc: generics) => {
    if (data.services) {
      const servicesList = data.services.split(',')

      let updateServices = []
      if (servicesList.find((item) => item === svc.name))
        updateServices = servicesList.filter((item) => item !== svc.name)
      else updateServices = [...servicesList, svc.name]

      if (updateServices.length > 0)
        setData((prev) => ({ ...prev, services: updateServices.join(',') }))
      else setData((prev) => ({ ...prev, services: null }))
    } else {
      setData((prev) => ({ ...prev, services: svc.name }))
    }
  }

  const handleSearchLocation = (ev: { query: string }) => {
    const query = ev.query
    const updateFilteredLocations = []

    for (let province of locations) {
      let filteredItems = province.cities.filter(
        (item) =>
          item.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .indexOf(
              query
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            ) !== -1
      )
      if (filteredItems && filteredItems.length) {
        updateFilteredLocations.push({
          ...province,
          ...{ cities: filteredItems },
        })
      }
    }

    setFilteredLocation(updateFilteredLocations)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    ;(async () => {
      if (data === INITIAL_DATA) {
        try {
          const data = await FamiliesService.getFamilies(session?.token)
          setFamilies(
            data.map((family) => {
              return {
                ...family,
                name: formatName(family.mainMembers),
                location: family.location
                  ? `${family.location.province}, ${family.location.city}`
                  : 'No assigned',
                localManager: family.localManager
                  ? family.localManager.name
                  : 'No assigned',
                status: family.status ? family.status : 'no status',
              }
            })
          )
        } catch (error) {
          console.error(error)
        }
      } else {
        const formatedBody = {
          ...data,
          location: data.location?.isProvince ? null : data.location?.name,
          province: data.location?.isProvince ? data.location?.name : null,
        }

        const { hits } = await axios({
          url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/search`,
          method: 'POST',
          data: formatedBody,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
          },
        })
          .then((res) => res.data)
          .catch((err) => console.error(err))

        const arr = hits ? [...hits?.hits] : []

        const updateFamilies = arr.map(({ _id, _source }) => ({
          familyMembers: _source.familyMemberAmount,
          id: _id,
          name: _source.name,
          location: `${_source.province}, ${_source.city}`,
          localManager: _source.localManager
            ? _source.localManager.name
            : 'No assigned',
          mainMembers: [],
          score: _source.score,
          status: _source.status ? _source.status : 'no status',
          type: _source.type,
        }))

        setFamilies(updateFamilies)
      }
      setVisible(false)
    })()

    return () => {}
  }

  // requests on first render
  useEffect(() => {
    ;(async () => {
      if(session?.token) {
        const res = await GenericsService.getAll(session?.token, [
          'services',
          'schools',
          'interests',
          'homeTypes',
          'cities',
          'provinces',
        ])
  
        if (res) {
          const { services, schools, interests, homeTypes, provinces, cities } =
            res
          const locationsList = [...provinces]
          locationsList.map((province: generics) => {
            province.cities = [
              { ...province, isProvince: true },
              ...cities
                .filter((city: generics) => city.province === province._id)
                .map((city: generics) => ({ ...city, isProvince: false })),
            ]
          })
          const schoolsList = Array.from(
            new Set<string>(schools.map((school: generics) => school.type))
          )
  
          setLocations(locationsList)
          setServices(services)
          setSchools(schoolsList)
          setHobbies(interests)
          setHomeTypes([...homeTypes.map((item: generics) => item.name)])
        }
      }
    })()
    return () => {}
  }, [])

  return (
    <Modal
      title='Filters'
      icon='misc'
      visible={visible}
      setVisible={setVisible}
      big
    >
      <form onSubmit={handleSubmit}>
        <div className='filtersModal'>
          <div className='left'>
            <div className='inputs'>
              <InputContainer label='Location'>
                <AutoComplete
                  dropdown
                  type='search'
                  field='name'
                  optionGroupLabel='name'
                  optionGroupChildren='cities'
                  value={data.location}
                  suggestions={filteredLocation}
                  completeMethod={handleSearchLocation}
                  itemTemplate={Templ}
                  onChange={(e) => setData({ ...data, location: e.value })}
                  onClick={(ev) => {
                    const element = ev.currentTarget
                      .nextElementSibling as HTMLElement
                    element.click()
                  }}
                />
              </InputContainer>

              <InputContainer label='House Type'>
                <Dropdown
                  showClear={true}
                  id='homeType'
                  value={data.homeType}
                  options={homeTypes}
                  onChange={(ev) => setData({ ...data, homeType: ev.value })}
                  placeholder='House Type'
                />
              </InputContainer>

              <InputContainer label='Hobbies'>
                <MultiSelect
                  optionLabel='name'
                  optionValue='name'
                  value={data.hobbies || []}
                  options={hobbies}
                  onChange={(e) => setData({ ...data, hobbies: e.value })}
                />
              </InputContainer>

              <InputContainer label='Type of school'>
                <Dropdown
                  showClear
                  id='schoolTypes'
                  value={data.schoolTypes}
                  options={schools}
                  onChange={(ev) => setData({ ...data, schoolTypes: ev.value })}
                  placeholder='Type of school'
                />
              </InputContainer>
            </div>

            <div className='radioOptions'>
              <InputContainer label='Type of Room'>
                {['Private', 'Shared'].map((item, idx) => (
                  <div
                    key={idx}
                    className='p-field-radiobutton'
                    style={{ marginBottom: '8px' }}
                  >
                    <RadioButton
                      inputId={`typeOfRoom-${idx}`}
                      name='typeOfRoom'
                      value={item}
                      onChange={(e) => setData({ ...data, roomTypes: e.value })}
                      checked={data.roomTypes === item}
                    />
                    <label
                      style={{ marginLeft: '8px', textTransform: 'capitalize' }}
                      htmlFor={`typeOfRoom-${idx}`}
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </InputContainer>

              <InputContainer label='External Students'>
                {['Yes', 'No'].map((item, idx) => (
                  <div
                    key={idx}
                    className='p-field-radiobutton'
                    style={{ marginBottom: '8px' }}
                  >
                    <RadioButton
                      inputId={`haveNoRedLeafStudents-${idx}`}
                      name='haveNoRedLeafStudents'
                      value={item === 'Yes'}
                      onChange={(e) =>
                        setData({ ...data, haveNoRedLeafStudents: e.value })
                      }
                      checked={
                        (item === 'Yes' && data.haveNoRedLeafStudents) ||
                        (item === 'No' && data.haveNoRedLeafStudents === false)
                      }
                    />
                    <label
                      style={{ marginLeft: '8px', textTransform: 'capitalize' }}
                      htmlFor={`haveNoRedLeafStudents-${idx}`}
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </InputContainer>

              <InputContainer label='Tenants'>
                {['Yes', 'No'].map((item, idx) => (
                  <div
                    key={idx}
                    className='p-field-radiobutton'
                    style={{ marginBottom: '8px' }}
                  >
                    <RadioButton
                      inputId={`tenants-${idx}`}
                      name='tenants'
                      value={item === 'Yes'}
                      onChange={(e) =>
                        setData({ ...data, haveTenants: e.value })
                      }
                      checked={
                        (item === 'Yes' && data.haveTenants) ||
                        (item === 'No' && data.haveTenants === false)
                      }
                    />
                    <label
                      style={{ marginLeft: '8px', textTransform: 'capitalize' }}
                      htmlFor={`tenants-${idx}`}
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </InputContainer>

              <InputContainer label='Pets'>
                {['Yes', 'No'].map((item, idx) => (
                  <div
                    key={idx}
                    className='p-field-radiobutton'
                    style={{ marginBottom: '8px' }}
                  >
                    <RadioButton
                      inputId={`pets-${idx}`}
                      name='pets'
                      value={item === 'Yes'}
                      onChange={(e) => setData({ ...data, havePets: e.value })}
                      checked={
                        (item === 'Yes' && data.havePets) ||
                        (item === 'No' && data.havePets === false)
                      }
                    />
                    <label
                      style={{ marginLeft: '8px', textTransform: 'capitalize' }}
                      htmlFor={`pets-${idx}`}
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </InputContainer>
            </div>

            <div className='numbers'>
              <InputContainer label='Rooms for students'>
                <InputNumber
                  inputId='horizontal'
                  value={data.studentRooms}
                  onValueChange={(e) =>
                    setData({ ...data, studentRooms: e.value })
                  }
                  showButtons
                  buttonLayout='horizontal'
                  step={1}
                  decrementButtonClassName='p-button-secondary'
                  incrementButtonClassName='p-button-secondary'
                  incrementButtonIcon='pi pi-plus'
                  decrementButtonIcon='pi pi-minus'
                  min={0}
                  max={20}
                />
              </InputContainer>
              <InputContainer label='Family members'>
                <InputNumber
                  inputId='horizontal'
                  value={data.familyMemberAmount}
                  onValueChange={(e) =>
                    setData({ ...data, familyMemberAmount: e.value })
                  }
                  showButtons
                  buttonLayout='horizontal'
                  step={1}
                  decrementButtonClassName='p-button-secondary'
                  incrementButtonClassName='p-button-secondary'
                  incrementButtonIcon='pi pi-plus'
                  decrementButtonIcon='pi pi-minus'
                  min={0}
                  max={20}
                />
              </InputContainer>
            </div>
            <Button
              label='Search'
              icon='pi pi-search'
              className='p-button-rounded'
              type='submit'
              style={{ marginRight: '1rem' }}
            />
            <Button
              label='Clear'
              type='button'
              icon='pi pi-times'
              className='p-button-danger p-button-rounded p-pl-2'
              onClick={() => setData(INITIAL_DATA)}
            />
          </div>

          <div className='rightSide'>
            <Accordion activeIndex={0}>
              <AccordionTab header='Bedroom Availability'>
                <InputContainer label='Arrival'>
                  <Calendar
                    value={data.arrivalDate}
                    onChange={(e) =>
                      setData({ ...data, arrivalDate: e.value as Date })
                    }
                  />
                </InputContainer>

                <InputContainer label='Departure'>
                  <Calendar
                    value={data.departureDate}
                    onChange={(e) =>
                      setData({ ...data, departureDate: e.value as Date })
                    }
                  />
                </InputContainer>
              </AccordionTab>
              <AccordionTab header='Services'>
                <div className='svc-grid'>
                  {services.map((svc) => (
                    <div
                      key={svc._id}
                      className={`service-box ripple-box-lightgray p-ripple ${
                        data.services &&
                        data.services
                          .split(',')
                          .find((item) => item === svc.name)
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() => handleSelectService(svc)}
                    >
                      <Image
                        src={svc.icon}
                        width={40}
                        height={40}
                        className='svcicon'
                      />
                      <h5>{svc.name}</h5> <Ripple />
                    </div>
                  ))}
                </div>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      </form>
    </Modal>
  )
}
