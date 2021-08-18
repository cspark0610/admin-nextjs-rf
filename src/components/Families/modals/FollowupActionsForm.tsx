import React from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils'
//utils
import {unformatDate} from 'utils/formatDate'
import {general} from 'utils/calendarRange'

type FollowUpActionsData = {
    actionType: string,
    date: string | Date
    comments: string
}

interface Props {
    data?: {
        actionType: string,
        date: Date | string, 
        comments: string
    } 
    onSubmit: (e:any) => void
}

const FollowupActionsForm : React.FC<Props>= ({data, onSubmit}) => {
    
    const formik = useFormik({
        initialValues: {
            actionType: data?.actionType || '',
            comments: data?.comments || '',
            date:  data ?  unformatDate(data?.date) : '',
        },
        validate: (data)=> {
            let errors: Partial<FollowUpActionsData> = {}
            if(data.actionType === ''){
                errors.actionType = 'Action Type is required'
            }
            if(data.comments === ''){
                errors.comments = 'Comments are required'
            }
            if(data.date == ''){
            errors.date= 'Date is required'
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
    }
    return(
        <form onSubmit={formik.handleSubmit}>
            <InputContainer label='Action Type' labelClass={classNames({ 'p-error': isFormFieldValid('actionType') })}>
                <InputText 
                    id="actionType"
                    placeholder='Action type'
                    value={formik.values.actionType}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('actionType') })}   
                />
                {getFormErrorMessage('actionType')}
            </InputContainer>
             <InputContainer label="Date of verification" labelClass={classNames({ 'p-error': isFormFieldValid('date') })}>
                <Calendar 
                    id='date'
                    monthNavigator
                    yearNavigator
                    yearRange={general}
                    placeholder='Date of verification'
                    value={new Date (formik.values.date)}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('date') })}
                    showIcon
                />
                {getFormErrorMessage('date')}
            </InputContainer>
            <InputContainer label='Comments' labelClass={classNames({ 'p-error': isFormFieldValid('comments') })}>
                <InputTextarea 
                    placeholder="Put your comments"
                    id="comments"
                    value={formik.values.comments}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('comments') })} 
                    rows={5} 
                    cols={30}
                    autoResize 
                />
                {getFormErrorMessage('comments')}
            </InputContainer>
            <Button type="submit">
                Save
            </Button>
        </form>
    )
}

export default FollowupActionsForm