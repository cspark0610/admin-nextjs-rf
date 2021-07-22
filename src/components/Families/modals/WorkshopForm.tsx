import React from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils'

type workshopData = {
    name: string
    date: string
    remarks: string
}
interface Props {
    data?: {
        name: string,
        date: Date,
        remarks: string
    }
    onSubmit: (e:any) => void
}


const WorkshopForm : React.FC<Props>= ({data, onSubmit}) => {
    const formik = useFormik({
        initialValues:{
            name: data?.name || '',
            date: data?.date || '',
            remarks: data?.remarks || '',
        },
        validate: (data) => {
            let errors: Partial<workshopData> = {}
            if(data.name === ''){
                errors.name= 'Name is required'
            }
            if(data.date == ''){
                errors.date= 'Date is required'
            }
            if(data.remarks === ''){
                errors.remarks= 'Remark is required'
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
           <InputContainer label="Workshop name" labelClass={classNames({ 'p-error': isFormFieldValid('name') })}>
                <InputText
                    id='name' 
                    placeholder="Workshop name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                />
                {getFormErrorMessage('name')}
            </InputContainer>
            <InputContainer label="Date of verification" labelClass={classNames({ 'p-error': isFormFieldValid('date') })}>
                <Calendar 
                    id='date'
                    placeholder='Date of verification'
                    value={new Date(formik.values.date)}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('date') })}
                    showIcon
                />
                {getFormErrorMessage('date')}
            </InputContainer>
            <InputContainer label="Remarks" labelClass={classNames({ 'p-error': isFormFieldValid('remarks') })}>
                <InputTextarea 
                    id='remarks'
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('remarks') })}
                    rows={5} 
                    cols={30}
                    autoResize 
                />
                {getFormErrorMessage('remarks')}
            </InputContainer>
            <Button type="submit">Save</Button>
        </form>
    )
}
export default WorkshopForm