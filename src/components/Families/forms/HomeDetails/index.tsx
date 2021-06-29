import React, { useState } from 'react'
//components
import FormGroup from "components/UI/Molecules/FormGroup";
import { InputText } from "primereact/inputtext";
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import TagInput from 'components/UI/Molecules/TagInput'
import Map from 'components/UI/Organism/Map'
//styles
import classes from "styles/Families/Forms.module.scss";

export default function HomeDetailsForm() {
    const dataCountries = ['Canada', "Spain"]
    const [tags, setTags] = useState(['Hospital', 'Restaurants', 'Laundry'])
    return (
        <div>
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

            </FormGroup>
        </div>
    )
}
