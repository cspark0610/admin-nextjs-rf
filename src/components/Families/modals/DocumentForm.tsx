import React from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils'

type DocumentData = {
    name: string
    description: string
}
interface Props {
    data?: DocumentData,
    onSubmit: (params:any) => void
}

const DocumentsForm : React.FC<Props> = ({data, onSubmit}) => {
    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            description: data?.description || ''
        },
        validate:(data)=> {
            let errors: Partial<DocumentData> = {}
            if(data.name === ''){
                errors.name= 'Name is required'
            }
            if(data.description === ''){
                errors.description= 'Description is required'
            }
            return errors
        },
        onSubmit: (data)=> {
            onSubmit(data)
            formik.resetForm()
        }
    })
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    return(
        <form>
            <InputContainer label="Name">
                <InputText placeholder="Document name"/> 
                {getFormErrorMessage('name')}
            </InputContainer>
            <InputContainer label="Description">
                <InputTextarea 
                    id='remarks'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('description') })}
                    rows={5} 
                    cols={30}
                    autoResize 
                />
                {getFormErrorMessage('description')}
            </InputContainer>
            <Button type="submit">Save</Button>
        </form>
    )
}
export default DocumentsForm