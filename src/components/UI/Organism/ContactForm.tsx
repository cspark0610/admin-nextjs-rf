import React, { useState, useContext, useRef } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Button } from 'primereact/button'
import Icon from 'components/UI/Atoms/Icon'
import { Panel } from 'primereact/panel'
import { Toast } from 'primereact/toast'
import { InputText } from "primereact/inputtext"
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils';
import { InputMask } from 'primereact/inputmask';
//styles
import styles from "styles/UI/Atoms/Icon.module.scss"
import classes from "styles/Families/Forms.module.scss"
//Context
import { FamilyContext } from 'context/FamilyContext'
//utils
import { validateEmail , validatePhoneNumber, validateURL} from 'utils/validations'
//services
import FamiliesService from 'services/Families'
import { useSession } from 'next-auth/client'

type contactData = {
    email: string
    zoom: string
    facebookMessenger: string
    whatsApp: string
    line: string
    teams: string
    googleMeet: string
    skype: string
}
export default function ContactForm() {
    const { family, getFamily } = useContext(FamilyContext)
    const { contactAccounts } = family
    const [session,] = useSession()
    const toast = useRef(null)
    //state
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            whatsApp: contactAccounts?.whatsApp || '',
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
            if (!validateEmail(data.email)) {
                errors.email = 'Your email is not valid'
            }
            // if(!validatePhoneNumber(data.skype)){
            //     errors.skype = 'Your Skype number is not valid'
            // }
            // if(!validatePhoneNumber(data.whatsApp)){
            //     errors.whatsApp = "Your Whatsapp number is not valid"
            // }
            if(!validateURL(data.facebookMessenger)){
                errors.facebookMessenger = "Your Facebook url its not valid"
            }
            // if(!validatePhoneNumber(data.line)){
            //     errors.line = "Your Line number is not valid"
            // }
            if(!validateEmail(data.email)){
                errors.email = "Your email address is not valid"
            }
            if(!validateEmail(data.teams)){
                errors.teams = "Your Teams email is not valid"
            }
            if(!validateURL(data.zoom)){
                errors.zoom = "Your Zoom url is not valid"
            }
            if(!validateURL(data.googleMeet)){
                errors.googleMeet = "Your Google Meet url is not valid"
            }
            return errors
        },
        onSubmit: data => {
            handleSubmit(data)
        }
    })
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Contact accounts successfully updated', life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'An error has ocurred', life: 3000 });
    }

    const handleSubmit = (data) => {
        setLoading(true)
        FamiliesService.updatefamily(session?.token, family._id, {contactAccounts: data})
            .then(() => {
                setLoading(false)
                showSuccess()
                getFamily()
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                showError()
            })

    }
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <Panel header="The Best Way For The Student To Contact The Family" toggleable style={{ marginTop: '3rem' }}>
            <form onSubmit={formik.handleSubmit}>
                <div className={classes.form_container_multiple}>
                    <InputContainer label="Skype" 
                        labelClass={classNames({ 'p-error': isFormFieldValid('skype') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="skype" classes={styles.small} />
                            <InputText
                                id="skype"
                                placeholder="Skype account"
                                value={formik.values.skype}
                                onChange={formik.handleChange}
                                className={classNames({ 'p-invalid': isFormFieldValid('skype') })}
                            />
                        </span>
                        {getFormErrorMessage('skype')}
                    </InputContainer>
                    <InputContainer label="Whatsapp" labelClass={classNames({ 'p-error': isFormFieldValid('whatsApp') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="whatsapp" classes={styles.small} />
                            <InputMask
                                id="whatsApp"
                                mask="+99 (999) 999-9999"
                                placeholder="Whatsapp account"
                                value={formik.values.whatsApp}
                                className={classNames({ 'p-invalid': isFormFieldValid('whatApp') })}
                                onChange={formik.handleChange}
                            />
                        </span>
                        {getFormErrorMessage('whatsApp')}
                    </InputContainer>
                    <InputContainer label="Facebook Messenger" labelClass={classNames({ 'p-error': isFormFieldValid('facebookMessenger') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="messenger" classes={styles.small} />
                            <InputText
                                id="facebookMessenger"
                                placeholder="Facebook account"
                                value={formik.values.facebookMessenger}
                                className={classNames({ 'p-invalid': isFormFieldValid('facebookMessenger') })}
                                onChange={formik.handleChange} />
                        </span>
                        {getFormErrorMessage('facebookMessenger')}
                    </InputContainer>
                    <InputContainer label="Line" labelClass={classNames({ 'p-error': isFormFieldValid('line') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="line" classes={styles.small} />
                            <InputMask
                                id='line'
                                placeholder="Line account"
                                mask="+99 (999) 999-9999"
                                className={classNames({ 'p-invalid': isFormFieldValid('line') })}
                                value={formik.values.line}
                                onChange={formik.handleChange} />
                        </span>
                        {getFormErrorMessage('line')}
                    </InputContainer>
                    <InputContainer label="Email" labelClass={classNames({ 'p-error': isFormFieldValid('email') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="gmail" classes={styles.small} />
                            <InputText
                                id="email"
                                className={classNames({ 'p-invalid': isFormFieldValid('email') })}
                                placeholder="Email account"
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                        </span>
                        {getFormErrorMessage('email')}
                    </InputContainer>
                    <InputContainer label="Teams" labelClass={classNames({ 'p-error': isFormFieldValid('teams') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="teams" classes={styles.small} />
                            <InputText
                                id="teams"
                                placeholder="Teams account"
                                className={classNames({ 'p-invalid': isFormFieldValid('teams') })}
                                value={formik.values.teams}
                                onChange={formik.handleChange} />
                        </span>
                        {getFormErrorMessage('teams')}
                    </InputContainer>
                    <InputContainer label="Zoom" labelClass={classNames({ 'p-error': isFormFieldValid('zoom') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="zoom" classes={styles.small} />
                            <InputText
                                id="zoom"
                                placeholder="Zoom account"
                                className={classNames({ 'p-invalid': isFormFieldValid('zoom') })}
                                value={formik.values.zoom}
                                onChange={formik.handleChange} />
                        </span>
                        {getFormErrorMessage('zoom')}
                    </InputContainer>
                    <InputContainer label="Google meet" labelClass={classNames({ 'p-error': isFormFieldValid('googleMeet') })}>
                        <span className="p-input-icon-right">
                            <Icon svg="meet" classes={styles.small} />
                            <InputText
                                id="googleMeet"
                                placeholder="Google meet account"
                                className={classNames({ 'p-invalid': isFormFieldValid('googleMeet') })}
                                value={formik.values.googleMeet}
                                onChange={formik.handleChange} />
                        </span>
                        {getFormErrorMessage('googleMeet')}
                    </InputContainer>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button label="Save" type='submit' loading={loading} icon="pi pi-save" className="p-button-rounded" />
                </div>
                <Toast ref={toast} />

            </form>
        </Panel>
    )
}
