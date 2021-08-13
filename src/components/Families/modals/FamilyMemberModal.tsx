import React,{useEffect, useState} from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils'
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
//services
import GenericsService from 'services/Generics';
import { useSession } from 'next-auth/client';
//Api
import FamiliesService from 'services/Families'
//utils
import {general} from 'utils/calendarRange'

enum liveInTheHouse {
    yes = 'Yes',
    no= 'No',
    partTime= 'Part-Time',
    other = 'Other'
}

type FamilyMemberData = {
    firstName: string
    lastName: string
    birthDate: string
    spokenLanguages: string[]
    liveinTheHouse: liveInTheHouse
    gender: string
    relationship: string
    comments: string
}
interface Props {
    data?: {
        firstName: string
        lastName: string
        birthDate: string
        spokenLanguages: string[]
        liveInTheHouse: liveInTheHouse 
        gender: string
        relationship: string
        comments: string
    }
    onSubmit: (params: any) => void,
    setFamilyData: (params: any) => void,
    familyData: any
}

const FamilyMemberModal: React.FC<Props> = ({data, onSubmit, setFamilyData, familyData}) => {
    const [languagesInput, setLanguagesInput] = useState([])
    const [gendersInput, setGendersInput] = useState([])
    const [session,] = useSession()
    
    useEffect(() => {
        (async () => {
            const { genders, languages } = await GenericsService.getAll(session?.token, ['genders', 'occupations', 'languages'])
            await setGendersInput(genders)
            await setLanguagesInput(languages)
            return (
                () => { }
            )
        })()
    }, [session])
    const formik = useFormik({
        initialValues:{
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            birthDate: data?.birthDate || '',
            spokenLanguages: data?.spokenLanguages || null,
            liveInTheHouse: data?.liveInTheHouse || '',
            relationship: data?.relationship || '',
            gender: data?.gender || null,
            comments: data?.relationship || ''

        },
        validate: (data) => {
            let errors: Partial<FamilyMemberData> = {}
            if(data.firstName=== ''){
                errors.firstName= 'First Name is required'
            }
            if(data.birthDate === ''){
                errors.birthDate= 'Date is required'
            }
            return errors
        },
        onSubmit: (data) => {
            
            const changeFormatDate = {
                ...data,
                birthDate: new Date(data.birthDate).toDateString()
            }

            const newMember = {
                ...familyData,
                familyMembers: [
                    ...familyData.familyMembers,
                    changeFormatDate
                ]
            }
            
            FamiliesService.updatefamily(session?.token, familyData._id, newMember)
                .then(() => {
                    setFamilyData(newMember)
                    formik.resetForm()
                    onSubmit(data)
                })
                .catch((e) => {
                    console.error(e)
                })
        }
    })
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    return (
        <form onSubmit={formik.handleSubmit}>
            <InputContainer label= "First Name" labelClass={classNames({ 'p-error': isFormFieldValid('firstName') })}>
                <InputText
                    id="firstName"
                    placeholder="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('firstName') })}
                /> 
                {getFormErrorMessage('firstName')}
            </InputContainer>            
            <InputContainer label= "Last Name" labelClass={classNames({ 'p-error': isFormFieldValid('lastName') })}>
                <InputText
                    id="lastName"
                    value={formik.values.lastName}
                    placeholder="Last Name"
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('lastName') })}
                /> 
                {getFormErrorMessage('lastName')}
            </InputContainer>            
            <InputContainer label="Date of birth" labelClass={classNames({ 'p-error': isFormFieldValid('birthDate') })}>
                <Calendar
                    dateFormat="dd/mm/yy"
                    name='birthDate' 
                    id="icon" 
                    showIcon 
                    placeholder="Date of birth"  
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('birthDate') })}
                    monthNavigator
                    yearNavigator
                    yearRange={general}
                />
                {getFormErrorMessage('birthDate')}
            </InputContainer>
            <InputContainer label= "Spoken languages">
                <MultiSelect 
                    name='languages' 
                    options={languagesInput}
                    onChange={formik.handleChange}
                    optionLabel="name" 
                    placeholder="Select languages" 
                    value={formik.values.spokenLanguages}
                />

            </InputContainer>            
            <InputContainer label="Live in the house">
                <label htmlFor="yes">
                    <RadioButton
                        value="Yes"
                        name="liveInTheHouse"
                        onChange={formik.handleChange}
                        checked={formik.values.liveInTheHouse === 'Yes'} 
                    />
                Yes</label>
                <label htmlFor="no">
                    <RadioButton
                        value="No"
                        name="liveInTheHouse"
                        onChange={formik.handleChange}
                        checked={formik.values.liveInTheHouse === 'No'} 
                    />
                No</label>
                <label htmlFor="no">
                    <RadioButton
                        value="Part-Time"
                        name="liveInTheHouse"
                        onChange={formik.handleChange}
                        checked={formik.values.liveInTheHouse === 'Part-Time'} 
                    />
                Part Time</label>
                <label htmlFor="no">
                    <RadioButton
                        value="Other"
                        name="liveInTheHouse"
                        onChange={formik.handleChange}
                        checked={formik.values.liveInTheHouse === 'Other'} 
                    />
                Other</label>
            </InputContainer>
            <InputContainer label="Gender">
                <Dropdown 
                    options={gendersInput}
                    optionLabel="name"
                    placeholder="Select gender"
                    id="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                />
            </InputContainer>
            <InputContainer label= "Relationship" labelClass={classNames({ 'p-error': isFormFieldValid('relationship') })}>
                <InputText
                    id="relationship"
                    value={formik.values.relationship}
                    placeholder="Relationship"
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('relationship') })}
                /> 
                {getFormErrorMessage('relationship')}
            </InputContainer> 
            <InputContainer label="Comments">
                <InputTextarea 
                        id='comments'
                        placeholder='put your comments...'
                        value={formik.values.comments}
                        onChange={formik.handleChange}
                        className={classNames({ 'p-invalid': isFormFieldValid('remarks') })}
                        rows={5} 
                        cols={30}
                        autoResize 
                    /> 
            </InputContainer>
            <Button type="submit">Save</Button>
        </form>
    )
}
export default FamilyMemberModal