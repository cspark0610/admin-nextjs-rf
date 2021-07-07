import React, {useState} from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
//styles
import classes from "styles/Families/Forms.module.scss";
export default function MainMemberForm({member, submit, id}) {
    
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
        {label: "Administration"},
    ]
    const [firstname, setFirstName] = useState(member.firstName)
    const [lastName, setLastName] = useState(member.lastName)
    const [gender, setGender] = useState(member.gender)
    const [occupation, setOcupation] = useState(member.occupation)
    const [mainPhone, setMainPhone] = useState(member.mainPhone)
    const [birthDate, setBirthDate] = useState(member.bithDate)
    const [alternativePhone, setAlternativePhone] = useState('')
    const [alternativePhoneType, setAlternativePhoneType] = useState('')
    const [motherTongue, setmotherTongue] = useState('')
    const [photo, setPhoto] = useState(member.photo || '/assets/img/user-avatar.svg')
    
    const handleChange = (e, callback) => {
        callback(e.target.value)
        const updatedMember = {
            firstname,
            lastName,
            gender,
            mainPhone,
            occupation,
            birthDate
        }
        submit(updatedMember,id)
    }
    return (
        <FormGroup title= {`Main member ${id+1}`} customClass={classes.side_layout}>
                <div className={classes.photo_container}>
                    <img src={photo} />
                    <FileUpload  mode="basic" name="demo[]"/>
                </div>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Firstname">
                        <InputText name="Firstname" placeholder="Firstname" value={firstname} onChange={e => {handleChange(e, setFirstName)}}/>
                    </InputContainer>

                    <InputContainer label="Lastname">
                        <InputText name="Lastname" placeholder="Lastname" value={lastName} onChange={e => {handleChange(e, setLastName)}}/>
                    </InputContainer>
                    
                    <InputContainer label="Gender">
                        <Dropdown optionLabel="label" options={genders} value={gender} onChange={e => {handleChange(e, setGender)}} placeholder="Select gender" />
                    </InputContainer>

                    <InputContainer label="Ocupation">
                        <Dropdown optionLabel="label" options={ocupations} placeholder="Select ocupation" value={occupation} onChange={e => {handleChange(e, setOcupation)}} />
                    </InputContainer>
                    
                    <InputContainer label="Cell Phone">
                        <InputText name="cell phone" type="tel"  placeholder="555-555-55" value={mainPhone} onChange={e => {handleChange(e, setMainPhone)}}/>
                    </InputContainer>

                    <InputContainer label="Date of birth">
                        <Calendar id="icon" showIcon placeholder="Date of birth" value={birthDate} onChange={e => {handleChange(e, setBirthDate)}}/>
                    </InputContainer>
                    
                    <InputContainer label="Alternative phone type">
                        <InputText name="alternative phone type" type="tel"  placeholder="555-555-55"/>
                    </InputContainer>
                    
                    <InputContainer label="Alternative telephone">
                        <InputText name="Alternative telephone" type="tel" value={alternativePhone} onChange={e => {handleChange(e, setAlternativePhone)}} placeholder="555-555-55"/>
                    </InputContainer>

                    <InputContainer label="Mother Tongue">
                        <InputText name="Mother Tongue" value={motherTongue} onChange={e => {handleChange(e, setmotherTongue)}} placeholder="Native language"/>
                    </InputContainer>
                </div>            
            </FormGroup>
    )
}
