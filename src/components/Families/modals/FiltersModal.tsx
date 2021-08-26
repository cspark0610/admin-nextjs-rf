import React, { useState, useEffect } from 'react'
import Modal from 'components/UI/Molecules/Modal'
import axios from 'axios'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputNumber } from 'primereact/inputnumber';
import DropDown from 'components/UI/Atoms/DropDown'
import { Accordion, AccordionTab } from 'primereact/accordion'
import ServiceBox from 'components/UI/Atoms/ServiceBox'
import GenericsService from 'services/Generics'
import { useSession } from 'next-auth/client';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { MultiSelect } from 'primereact/multiselect';
import {RadioOption} from 'components/UI/Molecules/RadioOption';

export interface isData {
        location: string,
        hobbies: Array<any>
        schoolTypes: string
        homeType : string
        //radio
        havePets : boolean
        haveTenants : boolean
        haveNoRedLeafStudents : boolean
        roomTypes : boolean
        //numbers
        familyMemberAmount : number
        studentRooms : number
        //svc
        services : Array<any>
        //availability
        arrivalDate: any
        deapertureDate: any
}

export default function FiltersModal() {
    const [session, ] = useSession()
    //modal state
    const [visible, setVisible] = useState<boolean>(true)
    //modal data states
    const [servicesArr, setservicesArr] = useState([])
    const [schoolsTypes, setschoolsTypes] = useState([])
    const [hobbies, setHobbies] = useState([])
    const [homeTypesArr, setHomeTypesArr] = useState([])
   
    const [data, setData] = useState<isData>({
        //inputs
        location: '',
        hobbies: [],
        schoolTypes: '',
        homeType : '',
        //radio
        havePets : false,
        haveTenants : false,
        haveNoRedLeafStudents : false,
        roomTypes : false,
        //numbers
        familyMemberAmount : 0,
        studentRooms : 0,
        //svc
        services : [],
        //availability
        arrivalDate: '',
        deapertureDate: '',
    })
    //svc handler
    const onSvcChange = (svcId) => {
        (data.services.filter(svc => svc === svcId).length === 1) ? 
        setData({...data, services: data.services.filter(svc => svc !== svcId)}) :
        setData({...data, services: [...data.services, svcId]})
    }

    
    //home svcs
    const getSvcs = (services)=>{ setservicesArr([...services]) }
    //nearby schools
    const getSchools = (schools) => {
        let schoolTypesArr = []
        schools.forEach(sc => { 
          let repeated = schoolTypesArr.filter(stype => stype.name === sc.type)
          if(repeated.length < 1) schoolTypesArr.push({name: sc.type})
        });
        setschoolsTypes(schoolTypesArr)
    }
    //family hobbies
    const getHobbies = (interests)=>{
        let _hobbies = []
        interests.forEach(hob => { _hobbies.push({name: hob.name}) });
        setHobbies(_hobbies)
    }
    //home type
    const getHomeTypes = (homeTypes)=> {
       setHomeTypesArr(homeTypes)
    }
    //request function
    const  genericRequests = async () => {
        const {services, schools, interests, homeTypes} = await GenericsService.getAll(session?.token, ['services', 'schools', 'interests', 'homeTypes'])
        getSvcs(services)
        getSchools(schools)
        getHobbies(interests)
        getHomeTypes(homeTypes)
    }
    //request on load the modal
    useEffect(() => { genericRequests() }, [])

    //dispatch when arrival date change
    useEffect(() => {
        if(data.deapertureDate == '') setData({...data, deapertureDate: data.arrivalDate})
    }, [data.arrivalDate])

    //location states
    const [filteredLocation, setFilteredLocation] = useState([])
    //search locations (provinces)
    const searchLocation = async (e)=> {
        const { provinces } = await GenericsService.getAll(session?.token, ['provinces'])
        let _filteredLocations = []
        let filtered = provinces.filter(prov=> prov.name.toLowerCase().includes(e.query) )
        filtered.forEach(fl => { _filteredLocations.push(fl.name) });
        setFilteredLocation(_filteredLocations)
    }


    /**--------------------
     * --------------------
     * --------------------
     * ON SUBMIT ----------
     * --------------------
     * --------------------
     * --------------------
    */
   const onSubmitFilterSearch = async () => {
     
     //verify types in the data
    let searchFiltered:any = {}

    //inputs
    if (data.location !== '') { searchFiltered.location = data.location }
    if (data.hobbies !== []) { searchFiltered.hobbies = data.hobbies }
    if (data.schoolTypes !== '') { searchFiltered.schoolTypes = data.schoolTypes }
    if (data.homeType  !== '') { searchFiltered.homeType  = data.homeType  }
    //radio don't need verify
    //numbers
    if (data.familyMemberAmount !== 0) { searchFiltered.familyMemberAmount = data.familyMemberAmount }
    if (data.studentRooms !== 0) { searchFiltered.studentRooms = data.studentRooms }
    //svc
    if (data.services !== []) { searchFiltered.services = data.services }
    //availability
    if (data.arrivalDate !== '') { searchFiltered.arrivalDate = data.arrivalDate }
    if (data.deapertureDate !== '') { searchFiltered.deapertureDate = data.deapertureDate }

    searchFiltered = {"location":"British Columbia","hobbies":[{"name":"Bowling"},{"name":"Cottage"},{"name":"Gardening"}],"schoolTypes":"High School","homeType":"Penthouse","familyMemberAmount":2,"studentRooms":1,"services":[]}
    let path ='admin/search'
    return axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/ms-fands/${path}`,
        method: 'POST',
        data: searchFiltered,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`,
          
        }
      }).then(res => res.data).catch(err => console.log(err))
   }
   
   const handleSubmit = (e) => {
    e.preventDefault()
    console.log(onSubmitFilterSearch())
   }

    return (
      <Modal
        title="Filters"
        icon="misc"
        visible={visible}
        setVisible={setVisible}
        xbig={true}
      >
        <form onSubmit={handleSubmit}>
          <div className="filtersModal">
            <div className="left">
              <div className="inputs">
                <InputContainer label="Location">
                  <AutoComplete
                    value={data.location}
                    suggestions={filteredLocation}
                    completeMethod={searchLocation}
                    onChange={(e) => setData({ ...data, location: e.value })}
                  />
                </InputContainer>

                <InputContainer label="House Type">
                  <DropDown
                    id="homeType"
                    placeholder="House Type"
                    className=""
                    options={homeTypesArr}
                    handleChange={(id, selected) => {
                      setData({ ...data, homeType: selected });
                    }}
                  />
                </InputContainer>

                <InputContainer label="Hobbies">
                  <MultiSelect
                    optionLabel="name"
                    value={data.hobbies}
                    options={hobbies}
                    onChange={(e) => setData({ ...data, hobbies:[...e.value] })}
                  />
                </InputContainer>

                <InputContainer label="Type of school">
                  <DropDown
                    id="schoolTypes"
                    placeholder="Type of school"
                    className=""
                    options={schoolsTypes}
                    handleChange={(id, selected) =>
                      setData({ ...data, schoolTypes: selected })
                      
                    }
                  />
                </InputContainer>
              </div>

              <div className="radioOptions">
                <RadioOption
                  label="Type of Room"
                  name="typeOfRoom"
                  options={["Private", "Shared"]}
                  handleChage={(value) => {
                    setData({ ...data, havePets: value });
                  }}
                />

                <RadioOption
                  label="External Students"
                  name="externalStudents"
                  handleChage={(value) => {
                    setData({ ...data, haveNoRedLeafStudents: value });
                  }}
                />

                <RadioOption
                  label="Tenants"
                  name="tenants"
                  handleChage={(value) => {
                    setData({ ...data, haveTenants: value });
                  }}
                />

                <RadioOption
                  label="Pets"
                  name="pets"
                  handleChage={(value) => {
                    setData({ ...data, roomTypes: value });
                  }}
                />
              </div>

              <div className="numbers">
                <InputContainer label="Rooms for students">
                  <InputNumber
                    inputId="horizontal"
                    value={data.studentRooms}
                    onValueChange={(e) =>
                      setData({ ...data, studentRooms: e.value })
                    }
                    showButtons
                    buttonLayout="horizontal"
                    step={1}
                    decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    min={0}
                    max={20}
                  />
                </InputContainer>
                <InputContainer label="Family members">
                  <InputNumber
                    inputId="horizontal"
                    value={data.familyMemberAmount}
                    onValueChange={(e) =>
                      setData({ ...data, familyMemberAmount: e.value })
                    }
                    showButtons
                    buttonLayout="horizontal"
                    step={1}
                    decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    min={0}
                    max={20}
                  />
                </InputContainer>
              </div>
            </div>
            <div className="rightSide">
            <Accordion>
              <AccordionTab header="Bedroom Availability">
                <InputContainer label="Arrival">
                  <Calendar
                    value={data.arrivalDate}
                    onChange={(e) => setData({...data, arrivalDate: e.value})}
                  ></Calendar>
                </InputContainer>

                <InputContainer label="Deaperture">
                  <Calendar
                    value={data.deapertureDate}
                    onChange={(e) => setData({...data, deapertureDate: e.value})}
                  ></Calendar>
                </InputContainer>
              </AccordionTab>
              <AccordionTab header="Services">
                <div className="svc-grid">
                  {servicesArr.map((svc) => (
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
          <button type="submit">Buscar</button>
        </form>
      </Modal>
    );
}
