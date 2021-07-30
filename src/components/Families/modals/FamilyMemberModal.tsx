import React,{useEffect, useState} from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { useFormik, Field } from 'formik'
import { classNames } from 'primereact/utils'
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
//services
import GenericsService from 'services/Generics';

enum liveInTheHouse {
    yes = 'Yes',
    no= 'No',
    partTime= 'Part-Time',
    other = 'Other'
}

type FamilyMemberData = {
    firstName: string
    lastName: string
    dateOfBirth: string
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
        dateOfBirth: string
        spokenLanguages: string[]
        liveInTheHouse: liveInTheHouse 
        gender: string
        relationship: string
        comments: string
    }
    onSubmit: (params: any) => void 
}

const FamilyMemberModal: React.FC<Props> = ({data, onSubmit}) => {
    const genericsService = new GenericsService()
    const [languagesInput, setLanguagesInput] = useState([])
    const [gendersInput, setGendersInput] = useState([])

    useEffect(() => {
        (async () => {
            const { genders, languages } = await genericsService.getAll(['genders', 'occupations', 'languages'])
            await setGendersInput(genders)
            await setLanguagesInput(languages)
            return (
                () => { }
            )
        })()
    }, [])
    const formik = useFormik({
        initialValues:{
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            dateOfBirth: data?.dateOfBirth || '',
            spokenLanguages: data?.spokenLanguages || [],
            liveInTheHouse: data?.liveInTheHouse || '',
            relationship: data?.relationship || '',
            gender: data?.gender || '',
            comments: data?.relationship || ''

        },
        validate: (data) => {
            let errors: Partial<FamilyMemberData> = {}
            if(data.firstName=== ''){
                errors.firstName= 'First Name is required'
            }
            if(data.dateOfBirth === ''){
                errors.dateOfBirth= 'Date is required'
            }
            return errors
        },
        onSubmit: (data) => {
            onSubmit(data)
            formik.resetForm()
        }
    })
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    return (
        <form onSubmit={formik.handleSubmit}>
            <InputContainer label= "First Name">
                <InputText
                    id="firstName"
                    placeholder="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                /> 
                {getFormErrorMessage('firstName')}
            </InputContainer>            
            <InputContainer label= "Last Name">
                <InputText
                    id="lastName"
                    value={formik.values.lastName}
                    placeholder="Last Name"
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                /> 
                {getFormErrorMessage('lastName')}
            </InputContainer>            
            <InputContainer label="Date of birth">
                <Calendar 
                    name='dateOfBirth' 
                    id="icon" 
                    showIcon 
                    placeholder="Date of birth"  
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                />
                {getFormErrorMessage('dateOfBirth')}
            </InputContainer>
            <InputContainer label= "Spoken languages">
                <MultiSelect 
                    name='languages' 
                    options={languagesInput} 
                    optionLabel="name" 
                    placeholder="Select languages" 
                    value={formik.values.spokenLanguages}
                    />
                    
            </InputContainer>            
            <InputContainer label="Live in the house">
                <label htmlFor="yes">Yes
                <RadioButton
                     value="Yes"
                     name="liveInTheHouse"
                     onChange={formik.handleChange}
                     checked={formik.values.liveInTheHouse === 'Yes'} 
                /></label>
                <label htmlFor="no">No
                <RadioButton
                     value="No"
                     name="liveInTheHouse"
                     onChange={formik.handleChange}
                     checked={formik.values.liveInTheHouse === 'No'} 
                /></label>
                <label htmlFor="no">Part Time
                <RadioButton
                     value="Part Time"
                     name="liveInTheHouse"
                     onChange={formik.handleChange}
                     checked={formik.values.liveInTheHouse === 'Part-Time'} 
                /></label>
                <label htmlFor="no">Other
                <RadioButton
                     value="Other"
                     name="liveInTheHouse"
                     onChange={formik.handleChange}
                     checked={formik.values.liveInTheHouse === 'Other'} 
                /></label>
            </InputContainer>
            <InputContainer label= "Last Name">
                <InputText
                    id="relationship"
                    value={formik.values.relationship}
                    placeholder="relationship"
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                /> 
                {getFormErrorMessage('relationship')}
            </InputContainer> 
            <InputContainer label="Gender">
                <Dropdown 
                    options={gendersInput}
                    optionLabel="name"
                    placeholder="select gender"
                    id="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                />
            </InputContainer>
            <InputContainer label="Comments">
                <InputTextarea 
                        id='remarks'
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