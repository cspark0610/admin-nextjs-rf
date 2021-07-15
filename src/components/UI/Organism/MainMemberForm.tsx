import React, { useState, useEffect, useContext } from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import Icon from 'components/UI/Atoms/Icon'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { MultiSelect } from 'primereact/multiselect';
import { Panel } from 'primereact/panel';
import GenericsService from 'services/Generics';
//styles
import classes from "styles/Families/Forms.module.scss";
import styles from "styles/UI/Atoms/Icon.module.scss"
//Context
import { FamilyContext } from 'context/FamilyContext'

export default function MainMemberForm({ member, submit, id }) {

    const genericsService = new GenericsService()

    const [gendersInput, setGendersInput] = useState([])
    const [occupationsInput, setOccupationsInput] = useState([])
    const [languagesInput, setLanguagesInput] = useState([])

    const { family } = useContext(FamilyContext)
    const { contactAccounts } = family

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

    const [skype, setSkype] = useState(contactAccounts.skype || '')
    const [whatsapp, setWhatsapp] = useState(contactAccounts.whatsapp || '')
    const [googleMeet, setGoogleMeet] = useState(contactAccounts.googleMeet || '')
    const [line, setLine] = useState(contactAccounts.line || '')
    const [zoom, setZoom] = useState(contactAccounts.zoom || '')
    const [teams, setTeams] = useState(contactAccounts.teams || '')
    const [familyEmail, setFamilyEmail] = useState(contactAccounts.email || '')
    const [facebookMessenger, setFacebookMessenger] = useState(contactAccounts.facebookMessenger || '')

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

                <InputContainer label="Cell Phone">
                    <InputText name="cell phone" type="tel" placeholder="555-555-55" value={mainPhone} onChange={e => { handleChange(e, setMainPhone) }} />
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

                <InputContainer label="Email">
                    <InputText placeholder="Email" type="email" value={email} onChange={e => handleChange(e, setEmail)} />
                </InputContainer>
                <div className={classes.full_width}>
                    <FormGroup title="The Best Way For The Student To Contact The Family">
                        <div className={classes.form_container_multiple}>
                            <InputContainer label="Home Phone Number">
                                <InputText placeholder="Home Phone Number" />
                            </InputContainer>

                            <InputContainer label="Work Phone Number">
                                <InputText placeholder="Work Phone Number" />
                            </InputContainer>
                        </div>
                    </FormGroup>
                    {id == 0 &&
                        <Panel header="Contact accounts" toggleable style={{ marginTop: '3rem' }}>
                            <div className={classes.form_container_multiple}>

                                <InputContainer label="Skype">
                                    <span className="p-input-icon-right">
                                        <Icon svg="skype" classes={styles.small} />
                                        <InputText
                                            placeholder="Skype account"
                                            value={skype}
                                            onChange={e => { setSkype(e.target.value) }}
                                        />
                                    </span>
                                </InputContainer>
                                <InputContainer label="Whatsapp">
                                    <span className="p-input-icon-right">
                                        <Icon svg="whatsapp" classes={styles.small} />
                                        <InputText
                                            placeholder="Whatsapp account"
                                            value={whatsapp}
                                            onChange={e => { setWhatsapp(e.target.value) }}
                                        />
                                    </span>
                                </InputContainer>
                                <InputContainer label="Facebook Messenger">
                                    <span className="p-input-icon-right">
                                        <Icon svg="messenger" classes={styles.small} />
                                        <InputText
                                            placeholder="Facebook account"
                                            value={facebookMessenger}
                                            onChange={e => { setFacebookMessenger(e.target.value) }} />
                                    </span>
                                </InputContainer>
                                <InputContainer label="Line">
                                <span className="p-input-icon-right">
                                        <Icon svg="line" classes={styles.small} />
                                    <InputText
                                        placeholder="Line account"
                                        value={line}
                                        onChange={e => { setLine(e.target.value) }} />
                                        </span>
                                </InputContainer>
                                <InputContainer label="Email">
                                <span className="p-input-icon-right">
                                        <Icon svg="gmail" classes={styles.small} />
                                    <InputText
                                        placeholder="Email account"
                                        value={familyEmail}
                                        onChange={e => { setFamilyEmail(e.target.value) }} />
                                        </span>
                                </InputContainer>
                                <InputContainer label="Teams">
                                <span className="p-input-icon-right">
                                        <Icon svg="teams" classes={styles.small} />
                                    <InputText
                                        placeholder="Teams account"
                                        value={teams}
                                        onChange={e => { setTeams(e.target.value) }} />
                                        </span>
                                </InputContainer>
                                <InputContainer label="Zoom">
                                <span className="p-input-icon-right">
                                        <Icon svg="zoom" classes={styles.small} />
                                    <InputText
                                        placeholder="Zoom account"
                                        value={zoom}
                                        onChange={e => { setZoom(e.target.value) }} />
                                        </span>
                                </InputContainer>
                                <InputContainer label="Google meet">
                                <span className="p-input-icon-right">
                                        <Icon svg="meet" classes={styles.small} />
                                    <InputText
                                        placeholder="Google meet account"
                                        value={googleMeet}
                                        onChange={e => { setGoogleMeet(e.target.value) }} />
                                        </span>
                                </InputContainer>
                            </div>
                        </Panel>}
                </div>
            </div>
        </FormGroup>
    )
}
