import React, { useState, useContext, useRef } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import {Button }from 'primereact/button'
import Icon from 'components/UI/Atoms/Icon'
import { Panel } from 'primereact/panel'
import { Toast } from 'primereact/toast'
import { InputText } from "primereact/inputtext"
//styles
import styles from "styles/UI/Atoms/Icon.module.scss"
import classes from "styles/Families/Forms.module.scss"
//Context
import { FamilyContext } from 'context/FamilyContext'
//services
import FamiliesService from 'services/Families'

export default function ContactForm() {
    const { family, setFamily } = useContext(FamilyContext)
    let { contactAccounts } = family
    contactAccounts = contactAccounts ? contactAccounts : {}
    const familyService = new FamiliesService()
    const toast = useRef(null)
    //state
    const [loading, setLoading] = useState(false)
    const [skype, setSkype] = useState(contactAccounts.skype || '')
    const [whatsapp, setWhatsapp] = useState(contactAccounts.whatsapp || '')
    const [googleMeet, setGoogleMeet] = useState(contactAccounts.googleMeet || '')
    const [line, setLine] = useState(contactAccounts.line || '')
    const [zoom, setZoom] = useState(contactAccounts.zoom || '')
    const [teams, setTeams] = useState(contactAccounts.teams || '')
    const [familyEmail, setFamilyEmail] = useState(contactAccounts.email || '')
    const [facebookMessenger, setFacebookMessenger] = useState(contactAccounts.facebookMessenger || '')

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:'Contact accounts successfully updateds', life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:'An error has ocurred', life: 3000});
    }

    const handleSubmit = () => {
        setLoading(true)
        const contactAccounts = {
            skype,
            whatsapp,
            line,
            zoom,
            teams,
            email:familyEmail,
            facebookMessenger
        }
        console.log(contactAccounts)
        familyService.updatefamily(family.id, contactAccounts)
        .then(()=> {
            setLoading(false)
            showSuccess()
            setFamily({...family, contactAccounts})
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
            showError()
        })

    }

    return (
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
            <div style={{width:'100%', display: 'flex', justifyContent: 'flex-end'}}>
                <Button label="Save" loading={loading}  icon="pi pi-save" className="p-button-rounded" onClick={() => {handleSubmit()}}/>
            </div>
            <Toast ref={toast} />
        </Panel>
    )
}
