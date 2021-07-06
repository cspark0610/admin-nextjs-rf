import React, { useState } from 'react'
//components
import Modal from 'components/UI/Molecules/Modal'
import FormGroup from "components/UI/Molecules/FormGroup";
import FormHeader from 'components/UI/Molecules/FormHeader'
import { InputText } from "primereact/inputtext";
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import TagInput from 'components/UI/Molecules/TagInput'
import Map from 'components/UI/Organism/Map'
import Table from 'components/UI/Organism/Table'
//styles
import classes from "styles/Families/Forms.module.scss";

export default function HomeDetailsForm() {
    const [showBedroomsModal, setShowBedroomsModal] = useState(false)
    const dataCountries = ['Canada', "Spain"]
    const [tags, setTags] = useState(['Hospital', 'Restaurants', 'Laundry'])
    const bedroomsColumns = [
        {field: 'typeOfRoom', header: 'Type of room', filterPlaceholder: 'Search by type of room'},
        {field: 'bathType', header: 'Bath Type', filterPlaceholder: 'Search by bath Type'},
        {field: 'insideBathroom', header: 'Bathroom inside the room', filterPlaceholder: 'Search by Bathroom inside the room'},
        {field: 'bedType', header: 'Type of bed', filterPlaceholder: 'Search by bed Type'},
    ]
    const bedroomsData = [{typeOfRoom: 'lorem', bathType: 'impsu', insideBathroom: 'another', bedType:'King'},{typeOfRoom: 'lorem', bathType: 'impsu', insideBathroom: 'another', bedType:'King'},{typeOfRoom: 'lorem', bathType: 'impsu', insideBathroom: 'another', bedType:'King'}]
    
    const handleSubmit = (e) => {
        e.preventDefault(e)
    }
    
    return (
        <div>
            <form onSubmit={e => {handleSubmit(e)}}> 
            <FormHeader title="Home details"/>
            </form>
            <FormGroup title="Location">
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Country">
                        <Dropdown options={dataCountries} placeholder="Select country" />
                    </InputContainer>
                    
                    <InputContainer label='Province'>
                        <Dropdown options={dataCountries} placeholder="Select province" />
                    </InputContainer>
                    
                    <InputContainer label="Town">
                        <Dropdown options={dataCountries} placeholder="Select country" />
                    </InputContainer>

                    <InputContainer label="Postal Code">
                        <Dropdown options={dataCountries} placeholder="Select province" />
                    </InputContainer>
                </div>
                <div style={{ margin: '3em 0' }}>
                    <Map />
                </div>
                <div className={classes.form_container_multiple}>
                    <InputContainer label='Description'>
                        <InputTextarea rows={5} cols={30} autoResize placeholder="Put a description about the location..." />
                    </InputContainer>
                    <InputContainer label='Nearby services'>
                        <TagInput placeholder="Add services" value={tags} setValue={setTags} />
                    </InputContainer>
                </div>
            </FormGroup>
            <FormGroup title='Living place'>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Type of house">
                        <Dropdown placeholder="Type of house" />
                    </InputContainer>
                </div>
                <h4>Room type:</h4>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Room type">
                        <Dropdown options={dataCountries} placeholder="Select province" />
                    </InputContainer>
                    <InputContainer label="Services">
                        <Dropdown options={dataCountries} placeholder="Select province" />
                    </InputContainer>
                </div>
            </FormGroup>
            <FormGroup title='Bedrooms'>
                <Table name="Bedrooms" columns={bedroomsColumns} content={bedroomsData} create={()=> {setShowBedroomsModal(true)}}/>
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
