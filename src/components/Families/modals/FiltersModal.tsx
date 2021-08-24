import React, { useState, useEffect } from 'react'
import Modal from 'components/UI/Molecules/Modal'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils'
import { useFormik } from 'formik'
import DropDown from 'components/UI/Atoms/DropDown'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { RadioButton } from 'primereact/radiobutton';
import ServiceBox from 'components/UI/Atoms/ServiceBox'
import GenericsService from 'services/Generics'
import { useSession } from 'next-auth/client';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { MultiSelect } from 'primereact/multiselect';
import RadioOption from 'components/UI/Molecules/RadioOption';

type FiltersData = {
    location: string
    houseTypes: string
    hobbies: string
    typeOfSchool: string
}


export default function FiltersModal() {
    const [session, ] = useSession()
    //modal state
    const [visible, setVisible] = useState<boolean>(true)
    //modal data states
    const [data, setData] = useState({
        location: 'Holis',
        houseTypes: 'typees',
        hobbies: 'hobbie',
        typeOfSchool: 'School',

    })
    const [radioOptions, setRadioOptions] = useState({
        tenants: '',
        externalStudents: '',
        pets: '',
        typeOfRoom: ''
    })

    const [numberValues, setNumberValues] = useState({
        rooms: 0,
        familyMembers: 0
    })
    //services state
    const [selectedServices, setSelectedServices] = useState([])

    const onSvcChange = (svcId) => {
        (selectedServices.filter(svc => svc === svcId).length === 1) ? 
        setSelectedServices([...selectedServices.filter(svc => svc !== svcId)]) :
        setSelectedServices([...selectedServices, svcId])
    }
    //services arr
    const [servicesArr, setservicesArr] = useState([{name: 'Airecito', icon: 'misc', _id: 'accAir'}])
    //schools state
    const [schoolsTypes, setschoolsTypes] = useState([])
    const [selectedSchoolType, setselectedSchoolType] = useState('')
    //hobbies
    const [hobbies, setHobbies] = useState([])
    const [selectedHobbies, setselectedHobbies] = useState([])
    
    const getSvcs = async()=>{
        const {services} = await GenericsService.getAll(session?.token, ['services', 'schools', 'interests'])
        setservicesArr([...services])
    }

    const getSchools = async () => {
        const {schools} = await GenericsService.getAll(session?.token, ['schools'])
        let schoolTypesArr = []
        schools.forEach(sc => {
            schoolTypesArr.push({name: sc.type})
        });
        setschoolsTypes(schoolTypesArr)
    }

    const getHobbies = async()=>{
        const {interests} = await GenericsService.getAll(session?.token, ['interests'])
        let _hobbies = []
        interests.forEach(hob => {
            _hobbies.push({name: hob.name})
        });
        setHobbies(_hobbies)
    }


    //request on load
    useEffect(() => {
     getSvcs()
     getSchools()
     getHobbies()
    }, [])

    const [arrivalDate, setArrivalDate] = useState<any>('')
    const [deapertureDate, setDeapertureDate] = useState<any>('')

    useEffect(() => {
        if(deapertureDate === '') setDeapertureDate(arrivalDate)
    }, [arrivalDate])

    //location
    const [selectedLocation, setSelectedLocation] = useState('')
    const [filteredLocation, setFilteredLocation] = useState([])
    const searchLocation = async (e)=> {
        const { provinces } = await GenericsService.getAll(session?.token, ['provinces'])
        let query = provinces
        
        let _filteredLocations = []
        let filtered = provinces.filter(prov=> prov.name.toLowerCase().includes(e.query) )
        
        filtered.forEach(fl => {
            _filteredLocations.push(fl.name)
        });
        setFilteredLocation(_filteredLocations)

    }




    //formik

    const formik = useFormik({
        initialValues:{
            location: data?.location || '',
            houseTypes: data?.houseTypes || '',
            hobbies: data?.hobbies || '',
            typeOfSchool: data?.hobbies || '',
        },
        validate: (data) => {
            let errors: Partial<FiltersData> = {}
            if(data.location === ''){
                errors.location = 'location is required'
            }
            if(data.houseTypes == ''){
                errors.houseTypes = 'houseTypes is required'
            }
            if(data.hobbies === ''){
                errors.hobbies = 'hobbies is required'
            }
            if(data.typeOfSchool === ''){
                errors.typeOfSchool = 'typeOfSchool is required'
            }
            return errors
        },
        onSubmit: (data) => {
            //onSubmit(data)
            //formik.resetForm()
        }
    })
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    }

    //end formik
    return (
        <Modal title="Filters" icon='misc' visible={visible} setVisible={setVisible} xbig={true}>
            <form className="filtersModal">
                <div className="left">
                <InputContainer label="Location" labelClass={classNames({ 'p-error': isFormFieldValid('location') })}>
                    
                    <AutoComplete value={selectedLocation} suggestions={filteredLocation} completeMethod={searchLocation} onChange={(e) => setSelectedLocation(e.value)} />

                    {getFormErrorMessage('location')}
                </InputContainer>
                <InputContainer label="House Type" labelClass={classNames({ 'p-error': isFormFieldValid('name') })}>
                    <DropDown 
                    id='houseTypes' 
                    placeholder="House Type"
                    className={classNames({ 'p-invalid': isFormFieldValid('houseTypes') })}
                    options={[
                        { name: 'Attached'},
                        { name: 'Dettached'},
                        { name: 'Apartment'},
                        { name: 'Penthouse'},
                        
                    ]}
                    handleChange={formik.setFieldValue}
                    />
                {getFormErrorMessage('houseTypes')}
            </InputContainer>
            <InputContainer label="Hobbies" labelClass={classNames({ 'p-error': isFormFieldValid('name') })}>
                    <MultiSelect optionLabel="name" value={selectedHobbies} options={hobbies} onChange={(e) => setselectedHobbies(e.value)} />
                {getFormErrorMessage('hobbies')}
            </InputContainer>
            <InputContainer label="Type of school" labelClass={classNames({ 'p-error': isFormFieldValid('name') })}>
                    <DropDown 
                     id='typeOfSchool' 
                     placeholder="Type of school"
                    className={classNames({ 'p-invalid': isFormFieldValid('typeOfSchool') })}
                    options={schoolsTypes}
                    handleChange={formik.setFieldValue}
                    />
                {getFormErrorMessage('typeOfSchool')}
            </InputContainer>

            <div className="radioOptions">

                <RadioOption
                label='Type of Room' 
                name='typeOfRoom'
                options={['Private', 'Shared']}
                handleChage={(value)=>{setRadioOptions({...radioOptions, typeOfRoom: value })}}
                />




                <InputContainer label="External Students">
                    <div className="p-field-radiobutton" style={{marginBottom:'8px'}}>
                        <RadioButton inputId="externalStudents" name="externalStudents" value="Yes" 
                        onChange={(e)=>{setRadioOptions({...radioOptions, externalStudents: e.value })}} 
                        checked={radioOptions.externalStudents === 'Yes'} 
                        />
                        <label style={{marginLeft:'8px', textTransform:'capitalize'}} htmlFor="externalStudents">Yes</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="externalStudents" name="externalStudents" value="No" 
                        onChange={(e)=>{setRadioOptions({...radioOptions, externalStudents: e.value })}} 
                        checked={radioOptions.externalStudents === 'No'} />
                        <label style={{marginLeft:'8px', textTransform:'capitalize'}} htmlFor="externalStudents">No</label>
                    </div>
                </InputContainer>



                <InputContainer label="Tenants">
                    <div className="p-field-radiobutton" style={{marginBottom:'8px'}}>
                        <RadioButton inputId="tenants" name="tenants" value="Yes" 
                        onChange={(e)=>{setRadioOptions({...radioOptions, tenants: e.value })}} 
                        checked={radioOptions.tenants === 'Yes'} 
                        />
                        <label style={{marginLeft:'8px', textTransform:'capitalize'}} htmlFor="tenants">Yes</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="tenants" name="tenants" value="No" 
                        onChange={(e)=>{setRadioOptions({...radioOptions, tenants: e.value })}} 
                        checked={radioOptions.tenants === 'No'} />
                        <label style={{marginLeft:'8px', textTransform:'capitalize'}} htmlFor="tenants">No</label>
                    </div>
                </InputContainer>





                <InputContainer label="Pets">
                    <div className="p-field-radiobutton" style={{marginBottom:'8px'}}>
                        <RadioButton inputId="pets" name="pets" value="Yes" 
                        onChange={(e)=>{setRadioOptions({...radioOptions, pets: e.value })}} 
                        checked={radioOptions.pets === 'Yes'} 
                        />
                        <label style={{marginLeft:'8px', textTransform:'capitalize'}} htmlFor="pets">Yes</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="pets" name="pets" value="No" 
                        onChange={(e)=>{setRadioOptions({...radioOptions, pets: e.value })}} 
                        checked={radioOptions.pets === 'No'} />
                        <label style={{marginLeft:'8px', textTransform:'capitalize'}} htmlFor="pets">No</label>
                    </div>
                </InputContainer>

            </div>
            <div className="numbers">
            <InputContainer label="Rooms for students">
                <InputNumber inputId="horizontal" value={numberValues.rooms}
                    onValueChange={(e) => setNumberValues({...numberValues, rooms: e.value})} showButtons 
                    buttonLayout="horizontal" step={1}
                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" 
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" min={0} max={20}/>

            </InputContainer>
            <InputContainer label="Family members">
                <InputNumber inputId="horizontal" value={numberValues.familyMembers}
                    onValueChange={(e) => setNumberValues({...numberValues, familyMembers: e.value})} showButtons 
                    buttonLayout="horizontal" step={1}
                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" 
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" min={0} max={20}/>

            </InputContainer>
            </div>
                </div>
                <div className="rightSide">
                    <Accordion>
                        <AccordionTab header='Bedroom Availability'>
                        <InputContainer label="Arrival">
                            <Calendar value={arrivalDate} onChange={(e) => setArrivalDate(e.value)}></Calendar>
                        </InputContainer>

                        <InputContainer label="Deaperture">
                            <Calendar value={deapertureDate} onChange={(e) => setDeapertureDate(e.value)}></Calendar>
                        </InputContainer>

                        </AccordionTab>
                        <AccordionTab header='Services' >
                            <div className="svc-grid">
                                {servicesArr.map(svc => (
                                    <ServiceBox icon={svc.icon} title={svc.name} svcId={svc._id} 
                                    onChangeState={onSvcChange} selector={selectedServices} />
                                ))}
                            </div>
                        </AccordionTab>
                    </Accordion>
                </div>
            </form>
        </Modal>
    )
}
