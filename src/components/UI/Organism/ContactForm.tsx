import React, { useState, useContext, useRef } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import {Button }from 'primereact/button'
import Icon from 'components/UI/Atoms/Icon'
import { Panel } from 'primereact/panel'
import { Toast } from 'primereact/toast'
import { InputText } from "primereact/inputtext"
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils';
//styles
import styles from "styles/UI/Atoms/Icon.module.scss"
import classes from "styles/Families/Forms.module.scss"
//Context
import { FamilyContext } from 'context/FamilyContext'
//utils
import {validateEmail} from 'utils/validations'
//services
import FamiliesService from 'services/Families'
import { useSession } from 'next-auth/client'

type contactData = {
    email:string
    zoom: string
    facebook: string
    whatsapp: string
    line: string
    teams: string
    googleMeet:string
    skype:string
}
export default function ContactForm() {
    const { family, setFamily } = useContext(FamilyContext)
    const { contactAccounts } = family
    const [session,] = useSession()
    const toast = useRef(null)
    //state
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            whatsapp: contactAccounts?.whatsapp || '',
            googleMeet: contactAccounts?.googleMeet || '',
            teams: contactAccounts?.teams || '',
            zoom: contactAccounts?.zoom || '',
            email: contactAccounts?.email || '',
            skype: contactAccounts?.skype || '',
            facebookMessenger: contactAccounts?.facebookMessenger || '',
            line: contactAccounts?.line || ''
        },
        validate: data => {
            let errors: Partial<contactData> = {}

            if(data.email === ''){
                errors.email = 'Email is required'
            }
            if(validateEmail(data.email)){
                errors.email = 'Your email is not valid'
            }
        },
        onSubmit: data=> {
            handleSubmit(data)
            formik.resetForm()
        }
    })
    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:'Contact accounts successfully updateds', life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:'An error has ocurred', life: 3000});
    }

    const handleSubmit = (data) => {
        setLoading(true)
        FamiliesService.updatefamily(session?.token, family._id, data)
        .then(()=> {
            setLoading(false)
            showSuccess()
            setFamily({...family, data})
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
            showError()
        })

    }

    return (
        <Panel header="The Best Way For The Student To Contact The Family" toggleable style={{ marginTop: '3rem' }}>
            <form onSubmit={formik.handleSubmit}>
            <div className={classes.form_container_multiple}>
                <InputContainer label="Skype">
                    <span className="p-input-icon-right">
                        <Icon svg="skype" classes={styles.small} />
                        <InputText
                            id="skype"
                            placeholder="Skype account"
                            value={formik.values.skype}
                            onChange={formik.handleChange}
                        />
                    </span>
                </InputContainer>
                <InputContainer label="Whatsapp">
                    <span className="p-input-icon-right">
                        <Icon svg="whatsapp" classes={styles.small} />
                        <InputText
                            id="whatsapp"
                            placeholder="Whatsapp account"
                            value={formik.values.whatsapp}
                            type='email'
                            required
                            onChange={formik.values.whatsapp}
                        />
                    </span>
                </InputContainer>
                <InputContainer label="Facebook Messenger">
                    <span className="p-input-icon-right">
                        <Icon svg="messenger" classes={styles.small} />
                        <InputText
                            id="facebookMessenger"
                            placeholder="Facebook account"
                            value={formik.values.facebookMessenger}
                            onChange={formik.handleChange} />
                    </span>
                </InputContainer>
                <InputContainer label="Line">
                    <span className="p-input-icon-right">
                        <Icon svg="line" classes={styles.small} />
                        <InputText
                            id='line'
                            placeholder="Line account"
                            value={formik.values.line}
                            onChange={formik.values.line} />
                    </span>
                </InputContainer>
                <InputContainer label="Email">
                    <span className="p-input-icon-right">
                        <Icon svg="gmail" classes={styles.small} />
                        <InputText
                            id="email"
                            placeholder="Email account"
                            value={formik.values.email}
                            onChange={formik.handleChange} />
                    </span>
                </InputContainer>
                <InputContainer label="Teams">
                    <span className="p-input-icon-right">
                        <Icon svg="teams" classes={styles.small} />
                        <InputText
                            id="teams"
                            placeholder="Teams account"
                            value={formik.values.teams}
                            onChange={formik.handleChange} />
                    </span>
                </InputContainer>
                <InputContainer label="Zoom">
                    <span className="p-input-icon-right">
                        <Icon svg="zoom" classes={styles.small} />
                        <InputText
                            id="zoom"
                            placeholder="Zoom account"
                            value={formik.values.zoom}
                            onChange={formik.handleChange} />
                    </span>
                </InputContainer>
                <InputContainer label="Google meet">
                    <span className="p-input-icon-right">
                        <Icon svg="meet" classes={styles.small} />
                        <InputText
                            id="googleMeet"
                            placeholder="Google meet account"
                            value={formik.values.googleMeet}
                            onChange={ formik.handleChange} />
                    </span>
                </InputContainer>
            </div>
            <div style={{width:'100%', display: 'flex', justifyContent: 'flex-end'}}>
                <Button label="Save" type='submit' loading={loading}  icon="pi pi-save" className="p-button-rounded"/>
            </div>
            <Toast ref={toast} />

            </form>
        </Panel>
    )
}
