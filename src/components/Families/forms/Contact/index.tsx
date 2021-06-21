import React from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
//styles
import classes from "styles/Families/Forms.module.scss";
export default function ContactForm() {
    const genders = [
        {label: 'Male'},
        {label: 'Female'},
        {label: 'No binary'},
        {label: 'Other'}
    ];
    const ocupations = [
        {label: "Engineer"},
        {label: "Doctor"},
        {label: "Lawyer"},
    ]
    return (
        <div>
            <FormGroup title= "Main member 1" customClass={classes.side_layout}>
                <div className={classes.photo_container}>
                    <img src="/assets/img/user-avatar.svg" alt="user" />
                    <FileUpload  mode="basic" name="demo[]"/>
                </div>
                <div className={classes.form_container_multiple}>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Firstname</label>
                        <InputText name="name" placeholder="Firstname"/>
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="lastname">Lastname</label>
                        <InputText name="lastname" placeholder="Lastname"/>
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="gender">Gender</label>
                        <Dropdown optionLabel="label" options={genders} placeholder="Select gender" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="ocupation">Ocupation</label>
                        <Dropdown optionLabel="label" options={ocupations} placeholder="Select ocupation" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="cell phone">Cell Phone</label>
                        <InputText name="cell phone" type="tel"  placeholder="555-555-55"/>
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="birth">Date of birth</label>
                        <Calendar id="icon" showIcon placeholder="Date of birth"/>
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="alternative phone type">Alternative phone type</label>
                        <InputText name="alternative phone type" type="tel"  placeholder="555-555-55"/>
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="Alternative telephone">Alternative telephone</label>
                        <InputText name="Alternative telephone" type="tel"  placeholder="555-555-55"/>
                    </div>
                </div>            
            </FormGroup>
            
        </div>
    )
}
