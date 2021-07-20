import React, { useState, useEffect, useContext } from 'react'
//components
import Modal from 'components/UI/Molecules/Modal'
import FormGroup from "components/UI/Molecules/FormGroup";
import FormHeader from 'components/UI/Molecules/FormHeader'
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import TagInput from 'components/UI/Molecules/TagInput'
import Map from 'components/UI/Organism/Map'
import Table from 'components/UI/Organism/Table'
//styles
import classes from "styles/Families/Forms.module.scss";
//services
import GenericsService from 'services/Generics'
//context
import { FamilyContext } from 'context/FamilyContext'

export default function HomeDetailsForm() {
    const { family } = useContext(FamilyContext)
    const [familyData, setFamilyData] = useState(family);
    const genericsService = new GenericsService()
    const dataCountries = []
    const [showBedroomsModal, setShowBedroomsModal] = useState(false)
    //inputs data
    const [countriesInput, setCountriesInput] = useState([])
    const [provincesInput, setProvincesInput] = useState([])
    const [citiesInput, setCitiesInput] = useState([])
    const [homeTypesInput, setHomeTypesInput] = useState([])
    const [servicesInput, setServicesInput] = useState([])
    //maps data
    const centerMap = {
        lat: family.location?.cordinate.latitude,
        lng: family.location?.cordinate.longitude,
    }

    const [dataMarker, setdataMarker] = useState({});

    const [tags, setTags] = useState(['Hospital', 'Restaurants', 'Laundry'])
    const bedroomsColumns = [
        { field: 'typeOfRoom', header: 'Type of bedroom', filterPlaceholder: 'Search by type of room' },
        { field: 'bathType', header: 'Bathroom Type', filterPlaceholder: 'Search by bath Type' },
        { field: 'insideBathroom', header: 'Bathroom inside the room', filterPlaceholder: 'Search by Bathroom inside the room' },
        { field: 'bedType', header: 'Type of Bed', filterPlaceholder: 'Search by bed Type' },
        { field: 'bedRoomLevel', header: 'Bedroom Level', filterPlaceholder:'Search by bedroom level'}
    ]
    const bedroomsData = [{ typeOfRoom: 'lorem', bathType: 'impsu', insideBathroom: 'another', bedType: 'King', bedRoomLevel:'1' }, { typeOfRoom: 'lorem', bathType: 'impsu', insideBathroom: 'another', bedType: 'King', bedRoomLevel:'1' }, { typeOfRoom: 'lorem', bathType: 'impsu', insideBathroom: 'another', bedType: 'King' , bedRoomLevel:'1' }]

    useEffect(() => {
        (async () => {
            const { countries, provinces, cities, homeTypes, services } = await genericsService.getAll(['countries', 'provinces', 'cities', 'homeTypes', 'services'])
            await setCountriesInput(countries)
            await setProvincesInput(provinces)
            await setCitiesInput(cities)
            await setHomeTypesInput(homeTypes)
            await setServicesInput(services)

        })()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault(e)
        console.log(dataMarker)
    }

    const data = family.home.services.map(service => {
        if (!service.isFreeComment) {
            return service.doc
        }
    })

    const handleChange = (ev) => {
        setFamilyData({
            ...familyData,
            home: {
                ...familyData.home,
                [ev.target.name]: ev.target.value
            }
        })
    }

    return (
        <div>
            <form onSubmit={e => { handleSubmit(e) }}>
                <FormHeader title="Home details" />
            </form>
            <FormGroup title="Location">
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Country">
                        <Dropdown
                            options={countriesInput}
                            value={familyData.home.country}
                            optionLabel='name'
                            name='country'
                            onChange={handleChange}
                            placeholder="Select country"
                        />
                    </InputContainer>

                    <InputContainer label='Province'>
                        <Dropdown
                            options={provincesInput}
                            value={familyData.home.province}
                            optionLabel='province'
                            placeholder="Select province"
                        />
                    </InputContainer>
                    <InputContainer label="City">
                        <Dropdown options={citiesInput} value={familyData.home.city} optionLabel='name' placeholder="Select city" />
                    </InputContainer>
                    <InputContainer label="Main Intersection">
                        <InputText placeholder="Main intersection"/>
                    </InputContainer>
                    <InputContainer label='Address'>
                        <InputTextarea rows={5} cols={30} value={familyData.home.address} autoResize placeholder="Put a description about the Address..." />
                    </InputContainer>

                    <InputContainer label="Postal Code">
                        <InputText placeholder="Postal code" value={familyData.home.postalCode} />
                    </InputContainer>
                </div>
                <div style={{ margin: '3em 0' }}>
                    {/* <Map familyCenter={centerMap} marker={marker} setMarker={setMarker} changeMark /> */}
                    <Map
                        setDataMarker={setdataMarker}
                        position={{ lat: family.location.cordinate.latitude, lng: family.location.cordinate.longitude }}
                    />
                </div>
                <div className={classes.form_container_multiple}>
                    <InputContainer label='Description'>
                        <InputTextarea rows={5} cols={30} value={familyData.home.description} autoResize placeholder="Put a description about the location..." />
                    </InputContainer>
                    <InputContainer label='Nearby services (Within 15 minutes walk)'>
                        <TagInput placeholder="Add services" value={tags} setValue={setTags} />
                    </InputContainer>
                </div>
            </FormGroup>
            <FormGroup title='Living place'>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Type of house">
                        <Dropdown options={homeTypesInput} value={familyData.home.homeType} optionLabel='name' placeholder="Type of house" />
                    </InputContainer>
                </div>
                <h4>Inside:</h4>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Room type">
                        <Dropdown options={dataCountries} placeholder="Select province" />
                    </InputContainer>
                    <InputContainer label="Household Amenities">
                        <MultiSelect
                            options={servicesInput}
                            value={data}
                            optionLabel='name'
                            placeholder="Select services"
                        />
                    </InputContainer>
                </div>
            </FormGroup>
            <FormGroup title='Bedrooms'>
                <Table name="Bedrooms" columns={bedroomsColumns} content={bedroomsData} create={() => { setShowBedroomsModal(true) }} />
            </FormGroup>
            <Modal
                visible={showBedroomsModal}
                setVisible={setShowBedroomsModal}
                title='Create workshop'
                icon="workshop">
                <p>bed form</p>
            </Modal>
        </div>
    )
}
