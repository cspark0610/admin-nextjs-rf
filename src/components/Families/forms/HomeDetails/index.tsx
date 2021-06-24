import React, { useState } from 'react'
//components
import FormGroup from "components/UI/Molecules/FormGroup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import TagInput from 'components/UI/Molecules/TagInput'
import Map from 'components/UI/Organism/Map'
//styles
import classes from "styles/Families/Forms.module.scss";

export default function HomeDetailsForm() {
    const dataCountries = ['Canada', "Spain"]
    const [tags,setTags] = useState(['Hospital', 'Restaurants', 'Laundry'])
    return (
        <div>
            <FormGroup title="Location">
            <div className={classes.form_container_multiple}>
                <div className={classes.input_container}>
                    <label htmlFor="diet">Country</label>
                    <Dropdown options={dataCountries} placeholder="Select country"/>
                </div>
                <div className={classes.input_container}>
                    <label htmlFor="diet">Province</label>
                    <Dropdown options={dataCountries} placeholder="Select province"/>
                </div>
                <div className={classes.input_container}>
                    <label htmlFor="diet">Town</label>
                    <Dropdown options={dataCountries} placeholder="Select country"/>
                </div>
                <div className={classes.input_container}>
                    <label htmlFor="diet">Postal Code</label>
                    <Dropdown options={dataCountries} placeholder="Select province"/>
                </div>
            </div>
            <div style={{margin: '2em 0'}}>
                <Map/>
            </div>
            <div className={classes.form_container_multiple}>
                <div className={classes.input_container}>
                    <label htmlFor="">Description</label>
                    <InputTextarea rows={5} cols={30} autoResize placeholder="Put a description about the location..." />
                </div>
                <div className={classes.input_container}>
                    <label htmlFor="">Nearby services</label>
                    <TagInput placeholder="Add services" value={tags} setValue={setTags}/>  
                </div>
            </div>
            
            </FormGroup>
        </div>
    )
}
