import React,{useContext, useEffect, useMemo, useState} from 'react'
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
import { FamilyContext } from 'context/FamilyContext';
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
    familyRelationship: any
    _id: string
}
interface Props {
    memberData?: {
        firstName: string
        lastName: string
        birthDate: string
        spokenLanguages: string[]
        liveInTheHouse: liveInTheHouse 
        gender: string
        relationship: string
        comments: string
        situation: string
        familyRelationship: any
        _id: string
    }
    closeDialog: () => void,
    familyData: any
    relationships: any
}

const FamilyMemberModal: React.FC<Props> = ({memberData, closeDialog, familyData, relationships}) => {
    const [languagesInput, setLanguagesInput] = useState([])
    const [gendersInput, setGendersInput] = useState([])
    const [session,] = useSession()
    const { getFamily } = useContext(FamilyContext)

    console.log('memberData', memberData)

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

    const initialValues = useMemo(() => ({
        firstName: memberData?.firstName || '',
        lastName: memberData?.lastName || '',
        birthDate: memberData?.birthDate || '',
        spokenLanguages: memberData?.spokenLanguages || null,
        familyRelationship: memberData.familyRelationship || null,
        gender: memberData?.gender || null,
        situation: memberData?.situation || ''
    }), [memberData, relationships])

    const formik = useFormik({
        initialValues,
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
                ]
            }

            if (!memberData || memberData.familyRelationship === undefined) {
                newMember.familyMembers.push(changeFormatDate)
            } else {
                const item = newMember.familyMembers.find(item => item._id === memberData?._id)
                newMember.familyMembers[newMember.familyMembers.indexOf(item)] = data
            }            

            FamiliesService.updatefamily(session?.token, familyData._id, newMember)
                .then(() => {
                    getFamily()
                    formik.resetForm()
                    closeDialog()
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
                    value={formik.values.birthDate !== '' ? new Date(formik.values.birthDate) : new Date()}
                    yearRange={general}
                />
                {getFormErrorMessage('birthDate')}
            </InputContainer>
            <InputContainer label= "Spoken languages">
                <MultiSelect 
                    name='spokenLanguages' 
                    options={languagesInput}
                    onChange={formik.handleChange}
                    optionLabel="name"
                    placeholder="Select languages" 
                    value={formik.values.spokenLanguages}
                    selectedItemTemplate={item => item ? `${item?.name}, ` : ''}
                />

            </InputContainer>            
            <InputContainer label="Live in the house">
                <div className="radio_container">
                    <RadioButton
                        value="Yes"
                        name="situation"
                        onChange={formik.handleChange}
                        checked={formik.values.situation === 'Yes'} 
                    />
                    <label htmlFor="yes">Yes</label>
                </div>
                <div className="radio_container">
                    <RadioButton
                        value="No"
                        name="situation"
                        onChange={formik.handleChange}
                        checked={formik.values.situation === 'No'} 
                    />
                    <label htmlFor="no">No</label>
                </div>
                <div className="radio_container">
                    <RadioButton
                        value="Part-Time"
                        name="situation"
                        onChange={formik.handleChange}
                        checked={formik.values.situation === 'Part-Time'} 
                    />
                    <label htmlFor="no"> Part Time</label>
                </div>
                <div className="radio_container">
                    <RadioButton
                        value="Other"
                        name="situation"
                        onChange={formik.handleChange}
                        checked={formik.values.situation === 'Other'} 
                    />
                    <label htmlFor="no">Other</label>
                </div>
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
                <Dropdown
                    id="relationship"
                    options={relationships}
                    value={formik.values.familyRelationship ? formik.values.familyRelationship : {}}
                    optionLabel='name'
                    name='relationship'
                    onChange={e => formik.setFieldValue('familyRelationship', e.value)}
                    placeholder="Select relationship"
                />
                {getFormErrorMessage('relationship')}
            </InputContainer>
            <Button type="submit">Save</Button>
        </form>
    )
}
export default FamilyMemberModal