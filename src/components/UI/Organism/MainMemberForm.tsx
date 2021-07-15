import React, { useState, useEffect, useContext } from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import ContactForm from 'components/UI/Organism/ContactForm'
import InputContainer from 'components/UI/Molecules/InputContainer'
import AppCheckbox from 'components/UI/Atoms/AppCheckbox'
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { MultiSelect } from 'primereact/multiselect';
import GenericsService from 'services/Generics';
//styles
import classes from "styles/Families/Forms.module.scss";
//Context

export default function MainMemberForm({ member, submit, id }) {

    const genericsService = new GenericsService()

    const [gendersInput, setGendersInput] = useState([])
    const [occupationsInput, setOccupationsInput] = useState([])
    const [languagesInput, setLanguagesInput] = useState([])

    useEffect(() => {
        (async () => {
            const { genders, occupations, languages } = await genericsService.getAll(['genders', 'occupations', 'languages'])
            await setGendersInput(genders)
            await setOccupationsInput(occupations)
            await setLanguagesInput(languages)

            return (
                () => { }
            )
        })()
    }, [])

    const [firstname, setFirstName] = useState(member.firstName)
    const [lastName, setLastName] = useState(member.lastName)
    const [gender, setGender] = useState(member.gender)
    const [occupation, setOcupation] = useState(member.occupation)
    const [mainPhone, setMainPhone] = useState(member.mainPhone)
    const [birthDate, setBirthDate] = useState(member.bithDate)
    const [email, setEmail] = useState('')
    const [photo, setPhoto] = useState(member.photo || '/assets/img/user-avatar.svg')

    const [isCellPhoneVerified, setIsCellPhoneVerified] = useState(member.isCellPhoneVerified || false)
    const [isWorkPhoneVerified, setIsWorkHomeVerified] = useState(member.isWorkPhoneVerified || false)
    const [isHomePhoneVerified, setIsHomePhoneVerified] = useState(member.isHomePhoneVerified || false)

    const title = ['Primary', 'Secondary']

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
        submit(updatedMember, id)
    }
    return (
        <FormGroup title={`${title[id]} Host`} customClass={classes.side_layout}>
            <div className={classes.photo_container}>
                <img src={photo} />
                <FileUpload mode="basic" name="demo[]" />
            </div>
            <div className={classes.form_container_multiple}>
                <InputContainer label="First Name">
                    <InputText name="Firstname" placeholder="Firstname" value={firstname} onChange={e => { handleChange(e, setFirstName) }} />
                </InputContainer>

                <InputContainer label="Last Name">
                    <InputText name="Lastname" placeholder="Lastname" value={lastName} onChange={e => { handleChange(e, setLastName) }} />
                </InputContainer>

                <InputContainer label="Sex">
                    <Dropdown optionLabel="name" options={gendersInput} value={gender} onChange={e => { handleChange(e, setGender) }} placeholder="Select gender" />
                </InputContainer>

                <InputContainer label="Occupation">
                    <Dropdown optionLabel="name" options={occupationsInput} filter filterBy="name" placeholder="Select ocupation" value={occupation} onChange={e => { handleChange(e, setOcupation) }} />
                </InputContainer>
               
                <InputContainer label="Email">
                    <InputText placeholder="Email" type="email" value={email} onChange={e => handleChange(e, setEmail)} />
                </InputContainer> 

                <InputContainer label="Date of birth">
                    <Calendar id="icon" showIcon placeholder="Date of birth" value={birthDate} onChange={e => { handleChange(e, setBirthDate) }} />
                </InputContainer>
                {
                    id == 0 &&
                    <InputContainer label="Main Languages Spoken at Home">
                        <MultiSelect options={languagesInput} optionLabel="name" placeholder="Select languages" />
                    </InputContainer>
                }
                <InputContainer label="What languages Do You Speak?">
                    <MultiSelect options={languagesInput} optionLabel="name" placeholder="Select languages" />
                </InputContainer>

                <InputContainer label="Cell Phone">
                    <InputText name="cell phone" type="tel" placeholder="555-555-55" value={mainPhone} onChange={e => { handleChange(e, setMainPhone) }} />
                    <AppCheckbox htmlId={`cellphone${id}`} checkedLabel="verified" uncheckedLabel="Not Verified" value={isCellPhoneVerified} setValue={setIsCellPhoneVerified}/>
                </InputContainer>
                <div className={classes.full_width}>
                    <FormGroup title="The Best Way For The Student To Contact The Family">
                        <div className={classes.form_container_multiple}>
                                <InputContainer label="Home Phone Number">
                                    <InputText placeholder="Home Phone Number" />
                                    <AppCheckbox htmlId={`homephone${id}`} checkedLabel="verified" uncheckedLabel="Not Verified" value={isHomePhoneVerified} setValue={setIsHomePhoneVerified}/>
                                </InputContainer>
                            
                               <InputContainer label="Work Phone Number">
                                    <InputText placeholder="Work Phone Number" />
                                    <AppCheckbox htmlId={`workphone${id}`} checkedLabel="verified" uncheckedLabel="Not Verified" value={isWorkPhoneVerified} setValue={setIsWorkHomeVerified}/>
                                </InputContainer>
                        </div>
                    </FormGroup>
                    {id == 0 && <ContactForm/>}
                </div>
            </div>
        </FormGroup>
    )
}
