import React from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
//styles
import classes from "styles/Families/Forms.module.scss";
export default function MainMemberForm() {
    
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
        <FormGroup title= "Main member 1" customClass={classes.side_layout}>
                <div className={classes.photo_container}>
                    <img src="/assets/img/user-avatar.svg" alt="user" />
                    <FileUpload  mode="basic" name="demo[]"/>
                </div>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Firstname">
                        <InputText name="Firstname" placeholder="Firstname"/>
                    </InputContainer>

                    <InputContainer label="Lastname">
                        <InputText name="Lastname" placeholder="Lastname"/>
                    </InputContainer>
                    
                    <InputContainer label="Gender">
                        <Dropdown optionLabel="label" options={genders} placeholder="Select gender" />
                    </InputContainer>

                    <InputContainer label="Ocupation">
                        <Dropdown optionLabel="label" options={ocupations} placeholder="Select ocupation" />
                    </InputContainer>
                    
                    <InputContainer label="Cell Phone">
                        <InputText name="cell phone" type="tel"  placeholder="555-555-55"/>
                    </InputContainer>

                    <InputContainer label="Date of birth">
                        <Calendar id="icon" showIcon placeholder="Date of birth"/>
                    </InputContainer>
                    
                    <InputContainer label="Alternative phone type">
                        <InputText name="alternative phone type" type="tel"  placeholder="555-555-55"/>
                    </InputContainer>
                    
                    <InputContainer label="Alternative telephone">
                        <InputText name="Alternative telephone" type="tel"  placeholder="555-555-55"/>
                    </InputContainer>
                </div>            
            </FormGroup>
    )
}
