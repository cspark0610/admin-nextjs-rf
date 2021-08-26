import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
//components
import Modal from 'components/UI/Molecules/Modal'
import FormGroup from "components/UI/Molecules/FormGroup";
import FormHeader from 'components/UI/Molecules/FormHeader'
import FileUploader from 'components/UI/Atoms/FileUploader'
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import TagInput from 'components/UI/Molecules/TagInput'
import Map from 'components/UI/Organism/Map'
import Table from 'components/UI/Organism/Table'
import { Toast } from 'primereact/toast'
import CreatableSelect from 'react-select/creatable';
//styles
import classes from "styles/Families/Forms.module.scss";
//services
import FamiliesService from 'services/Families'
import HomeService from 'services/Home'
import GenericsService from 'services/Generics'
//context
import { FamilyContext } from 'context/FamilyContext'
//Api
import { useSession } from 'next-auth/client';
import { confirmDialog } from 'primereact/confirmdialog';

const bedroomsColumns = [
    { field: 'type', header: 'Type of bedroom', filterPlaceholder: 'Search by type of room' },
    { field: 'bathType', header: 'Bathroom Type', filterPlaceholder: 'Search by bath Type' },
    { field: 'bathroomLocation', header: 'Bathroom location', filterPlaceholder: 'Search by Bathroom location' },
    { field: 'bedType', header: 'Type of Bed', filterPlaceholder: 'Search by bed Type' },
    { field: 'floor', header: 'Bedroom Level', filterPlaceholder: 'Search by bedroom level' }
]

export default function HomeDetailsForm() {
    const toast = useRef(null)
    const { family, getFamily } = useContext(FamilyContext)
    const [familyData, setFamilyData] = useState(family);
    const [session,] = useSession()
    const [showBedroomsModal, setShowBedroomsModal] = useState(false)
    const bedRooms = useMemo(() => family.home.studentRooms, family)
    const [newVideoURL, setNewVideoURl] = useState<string>('')
    const [loading, setLoading] = useState(false)
    //inputs data
    const [countriesInput, setCountriesInput] = useState([])
    const [provincesInput, setProvincesInput] = useState([])
    const [citiesInput, setCitiesInput] = useState([])
    const [homeTypesInput, setHomeTypesInput] = useState([])
    const [servicesInput, setServicesInput] = useState([])
    // const [roomTyoeInput, setRoomTypeInput] = useState([])

    const [services, setServices] = useState(family.home.services.map(service => ({
        value: service.isFreeComment ? service.freeComment : service.doc,
        isFreeComment: service.isFreeComment,
        label: service.isFreeComment
            ? service.freeComment
            : service.doc.name
    })))

    const mapOptions = {
        center: {
            lat: family.location?.cordinate.latitude || 56.130367,
            lng: family.location?.cordinate.longitude || -106.346771,
        },
        zoom: 16,
    }


    const [dataMarker, setDataMarker] = useState({});

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Home details successfully updated', life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'An error has ocurred', life: 3000 });
    }

    const [tags, setTags] = useState(['Hospital', 'Restaurants', 'Laundry'])

    useEffect(() => {
        (async () => {
            const { countries, provinces, cities, homeTypes, services } = await GenericsService.getAll(session?.token, ['countries', 'provinces', 'cities', 'homeTypes', 'services', 'roomTypes', ''])
            setCountriesInput(countries)
            setProvincesInput(provinces)
            setCitiesInput(cities)
            setHomeTypesInput(homeTypes)
            setServicesInput(services.map(service => ({
                value: service._id,
                label: service.name
            })))

        })()
    }, [session])



    const handleChange = (ev) => {
        setFamilyData({
            ...familyData,
            home: {
                ...familyData.home,
                [ev.target.name]: ev.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        setLoading(true)
        const servicesData = services.map(service => {
            return service && service.isFreeComment
                ? {
                    freeComment: service.value,
                    isFreeComment: true
                }
                : {
                    doc: service.value,
                    isFreeComment: false
                }
        })

        const home = {
            ...familyData.home,
            country: familyData.home.country._id,
            province: familyData.home.province._id,
            city: familyData.home.city._id,
            homeType: familyData.home.homeType._id,
            services: servicesData
        }

        const formData = new FormData(e.currentTarget)

        const data = new FormData()
        data.append('video', formData.get('video'))

        if (newVideoURL) {
            HomeService.updateHomeVideo(session?.token, family._id, data)
                .then(() => {
                    showSuccess()
                    setLoading(false)
                    getFamily()
                })
                .catch(err => {
                    showError()
                    setLoading(false)
                    console.log(err)
                })
        }

        FamiliesService.updateFamilyHome(session?.token, family._id, home)
            .then(() => {
                showSuccess()
                getFamily()
                setLoading(false)
            })
            .catch(err => {
                showError()
                setLoading(false)
                console.log(err)
            })
    }

    const handleServices = (_, actionMetadata) => {
        if (actionMetadata.action === "remove-value") {
            const data = services.filter(service => service.value !== actionMetadata.removedValue.value)
            setServices(data)
        } else if (actionMetadata.action === 'clear') {
            setServices([])
        } else {
            const newOption = actionMetadata.action === "create-option"
                ? { ...actionMetadata.option, isFreeComment: true }
                : { ...actionMetadata.option }
            setServices([...services, newOption])
        }
    };

    const handelDeleteBedRoom = data => {
        confirmDialog({
            message: `Are you sure you want to delete this bedroom?`,
            header: 'Confirm Delete bedroom',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const bedRoomsData = bedRooms.filter(bedroom => bedroom._id !== data._id)

                FamiliesService.updatefamily(
                    session?.token,
                    family._id,
                    {
                        ...family,
                        home: {
                            ...family.home,
                            studentRooms: bedRoomsData
                        }
                    }
                )
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        // showError()
                        console.log(err)
                    })
            },
            reject: () => { }
        });
    }
    const renderVideo = (event) => {
        const video = URL.createObjectURL(event.target.files[0])

        setNewVideoURl(video)
    }
    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    handleSubmit(e)
                }}
            >
                <FormHeader title="Home details" isLoading={loading} onClick={() => { }} />
                <FormGroup title="Home video">
                    <div className={classes.form_container_multiple}>
                        {newVideoURL && <video width="100%" height="auto" controls>
                            <source src={newVideoURL} />
                        </video>}
                        {family.home.video && newVideoURL === '' && <video width="100%" height="auto" controls>
                            <source src={family.home.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>}

                        {!family.home.video && !newVideoURL && <img style={{ borderRadius: '14px', width: '100%' }} src="/assets/img/notVideoFound.svg" alt='You have not uploaded a video yet' />}
                        <div>
                            <InputContainer label="Upload new video">
                                <FileUploader
                                    id="video"
                                    name="video"
                                    onChange={(event) => { renderVideo(event) }}
                                    placeholder="Upload home's video"
                                />
                            </InputContainer>

                        </div>
                    </div>
                </FormGroup>
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
                            onChange={handleChange}
                            name='province'
                            optionLabel='name'
                            placeholder="Select province"
                        />
                    </InputContainer>
                    <InputContainer label="City">
                        <Dropdown
                            options={citiesInput}
                            value={familyData.home.city}
                            onChange={handleChange}
                            name='city'
                            optionLabel='name'
                            placeholder="Select city"
                        />
                    </InputContainer>
                    <InputContainer label="Main Intersection">
                        <InputText
                            placeholder="Main intersection"
                            value={familyData.home.mainIntersection}
                            onChange={handleChange}
                            name='mainIntersection'
                        />
                    </InputContainer>
                    <InputContainer label='Address'>
                        <InputTextarea
                            rows={5}
                            cols={30}
                            value={familyData.home.address}
                            onChange={handleChange}
                            name='address'
                            autoResize
                            placeholder="Put a description about the Address..."
                        />
                    </InputContainer>

                    <InputContainer label="Postal Code">
                        <InputText
                            placeholder="Postal code"
                            value={familyData.home.postalCode}
                            onChange={handleChange}
                            name='postalCode'
                        />
                    </InputContainer>
                </div>
                <div style={{ margin: '3em 0' }}>
                    <Map
                        setDataMarker={setDataMarker}
                        position={{ lat: family.location?.cordinate.latitude, lng: family.location?.cordinate.longitude }}
                        options={mapOptions}
                    />
                </div>
                <div className={classes.form_container_multiple}>
                    <InputContainer label='Description'>
                        <InputTextarea
                            rows={5}
                            cols={30}
                            value={familyData.home.description}
                            onChange={handleChange}
                            name='description'
                            autoResize placeholder="Put a description about the location..."
                        />
                    </InputContainer>
                    <InputContainer label='Nearby services (Within 15 minutes walk)'>
                        <TagInput
                            placeholder="Add services"
                            value={tags}
                            setValue={setTags}
                        />
                    </InputContainer>
                </div>
            </FormGroup>
            <FormGroup title='Living place'>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Type of house">
                        <Dropdown
                            options={homeTypesInput}
                            value={familyData.home.homeType}
                            onChange={handleChange}
                            name='homeType'
                            optionLabel='name'
                            placeholder="Type of house"
                        />
                    </InputContainer>
                </div>
                <h4>Inside:</h4>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Room type">
                        <MultiSelect
                            options={[]}
                            placeholder="Select Room Type"
                            value={familyData.home.homeType}
                            onChange={handleChange}
                            name='homeType'
                            optionLabel='name'
                            selectedItemTemplate={item => item ? `${item?.name}, ` : ''}
                        />
                    </InputContainer>
                    <InputContainer label="Household Amenities">
                        <CreatableSelect
                            isClearable
                            isMulti
                            options={servicesInput}
                            value={services}
                            optionLabel='name'
                            placeholder="Select services"
                            onChange={handleServices}
                        />
                    </InputContainer>
                </div>
            </FormGroup>
            <FormGroup title='Bedrooms'>
                <Table name="Bedrooms"
                    columns={bedroomsColumns}
                    content={bedRooms}
                    create={() => { }}
                    edit={() => { }}
                    onDelete={() => { }}
                    deleteMany={() => { }}
                    defaultSortField='type'
                />
            </FormGroup>
            <Modal
                visible={showBedroomsModal}
                setVisible={setShowBedroomsModal}
                title='Create workshop'
                icon="workshop">
                <p>bed form</p>
            </Modal>
            <Toast ref={toast} />
        </div>
    )
}
