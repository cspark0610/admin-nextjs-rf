// main tools
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import axios from 'axios'

// components
import Modal from 'components/UI/Molecules/Modal'
import InputContainer from 'components/UI/Molecules/InputContainer'
import DropDown from 'components/UI/Atoms/DropDown'
import ServiceBox from 'components/UI/Atoms/ServiceBox'
import { RadioOption } from 'components/UI/Molecules/RadioOption'

// prime components
import { InputNumber } from 'primereact/inputnumber'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Calendar } from 'primereact/calendar'
import { AutoComplete } from 'primereact/autocomplete'
import { MultiSelect } from 'primereact/multiselect'
import { Button } from 'primereact/button'

// services
import GenericsService from 'services/Generics'

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
  havePets: boolean
  haveTenants: boolean
  haveNoRedLeafStudents: boolean
  roomTypes: boolean
  // numbers
  familyMemberAmount: number
  studentRooms: number
  // services
  services: generics[]
  // availability
  arrivalDate: Date
  deapertureDate: Date
}

const INITIAL_DATA = {
  //inputs
  location: null,
  province: null,
  schoolTypes: '',
  homeType: '',
  //radio
  havePets: false,
  haveTenants: false,
  haveNoRedLeafStudents: false,
  roomTypes: false,
  //numbers
  familyMemberAmount: 0,
  studentRooms: 0,
  //svc
  services: [],
  hobbies: undefined,
  //availability
  arrivalDate: null,
  deapertureDate: null,
}

const msFamily = 'ms-fands'

export default function FiltersModal({ visible, setVisible, setFamilies }) {
  const [session] = useSession()
  // modal data states
  const [services, setServices] = useState<generics[]>([])
  const [schools, setSchools] = useState<{ name: string }[]>([])
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
  const onSvcChange = (svcId) => {
    data.services.filter((svc) => svc === svcId).length === 1
      ? setData({
          ...data,
          services: data.services.filter((svc) => svc !== svcId),
        })
      : setData({ ...data, services: [...data.services, svcId] })
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
      const { services, ...body } = data // removing problematics attributes

      const formatedBody = {
        ...body,
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
        .catch((err) => console.log(err))

      const arr = [...hits.hits]
      console.log(arr)

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
      setVisible(false)
    })()
  }

  // requests on first render
  useEffect(() => {
    ;(async () => {
      const { services, schools, interests, homeTypes, provinces, cities } =
        await GenericsService.getAll(session?.token, [
          'services',
          'schools',
          'interests',
          'homeTypes',
          'cities',
          'provinces',
        ])

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
      ).map((item) => ({ name: item }))

      setLocations(locationsList)
      setServices(services)
      setSchools(schoolsList)
      setHobbies(interests)
      setHomeTypes([
        ...homeTypes.map((item: generics) => ({ name: item.name })),
      ])
    })()
  }, [])

  return (
    <Modal
      title='Filters'
      icon='misc'
      visible={visible}
      setVisible={setVisible}
      xbig={true}
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
                <DropDown
                  showClear
                  id='homeType'
                  placeholder='House Type'
                  className=''
                  options={homeTypes}
                  handleChange={(id: string, selected: string) => {
                    setData({ ...data, homeType: selected })
                  }}
                />
              </InputContainer>

              <InputContainer label='Hobbies'>
                <MultiSelect
                  optionLabel='name'
                  value={data.hobbies || []}
                  options={hobbies}
                  onChange={(e) => setData({ ...data, hobbies: e.value })}
                />
              </InputContainer>

              <InputContainer label='Type of school'>
                <DropDown
                  showClear
                  id='schoolTypes'
                  placeholder='Type of school'
                  className=''
                  options={schools}
                  handleChange={(id, selected) =>
                    setData({ ...data, schoolTypes: selected })
                  }
                />
              </InputContainer>
            </div>

            <div className='radioOptions'>
              <RadioOption
                label='Type of Room'
                name='typeOfRoom'
                options={['Private', 'Shared']}
                handleChage={(value) => {
                  setData({ ...data, havePets: value })
                }}
              />

              <RadioOption
                label='External Students'
                name='externalStudents'
                handleChage={(value) => {
                  setData({ ...data, haveNoRedLeafStudents: value })
                }}
              />

              <RadioOption
                label='Tenants'
                name='tenants'
                handleChage={(value) => {
                  setData({ ...data, haveTenants: value })
                }}
              />

              <RadioOption
                label='Pets'
                name='pets'
                handleChage={(value) => {
                  setData({ ...data, roomTypes: value })
                }}
              />
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

                <InputContainer label='Deaperture'>
                  <Calendar
                    value={data.deapertureDate}
                    onChange={(e) =>
                      setData({ ...data, deapertureDate: e.value as Date })
                    }
                  />
                </InputContainer>
              </AccordionTab>
              <AccordionTab header='Services'>
                <div className='svc-grid'>
                  {services.map((svc) => (
                    <ServiceBox
                      key={svc._id}
                      icon={svc.icon}
                      title={svc.name}
                      svcId={svc._id}
                      onChangeState={onSvcChange}
                      selector={data.services}
                    />
                  ))}
                </div>
              </AccordionTab>
            </Accordion>
          </div>
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
          icon='pi pi-times'
          className='p-button-danger p-button-rounded p-pl-2'
          onClick={() => setData(INITIAL_DATA)}
        />
      </form>
    </Modal>
  )
}
