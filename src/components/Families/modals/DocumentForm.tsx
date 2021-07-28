import React,{useEffect,useState} from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload';
//hooks 
import useMembers from 'hooks/useMembers'
type DocumentData = {
    name: string
    description: string
    owner: {
        kind: string
        id: string
    }
}
interface Props {
    data?: DocumentData,
    onSubmit: (params:any) => void
}

const DocumentsForm : React.FC<Props> = ({data, onSubmit}) => {
    const members = useMembers({})    
    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            description: data?.description || '',
            kindOfOwner: data?.owner.kind || '',
            owner: data?.owner.id || ''
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
    const kindOfOwner = [
        {
            label: 'Host',
            name: 'hosts'
        },
        {
            label: 'Family Member',
            name: 'familyMembers'
        },
        {
            label: 'Tenant',
            name: 'tenants'
        },
        {
            label: 'External Student',
            name: 'externalStudents'
        },]
    const uploadFile = e => {
        const data = new FormData()
        console.log(e, data)
    }
    return(
        <form>
            <InputContainer label="Upload file">
                <FileUpload
                    customUpload
                    mode="basic"
                    name="familyPictures"
                    uploadHandler={uploadFile}
                />
            </InputContainer>
            <InputContainer label="Name">
                <InputText placeholder="Document name"/> 
                {getFormErrorMessage('name')}
            </InputContainer>
            <InputContainer label='kind of owner'>
                <Dropdown
                    id='kindOfOwner'
                    options={kindOfOwner}
                    optionLabel='label'
                    optionValue='name'
                    placeholder="Select kind of owner"
                    value={formik.values.kindOfOwner}
                    onChange={formik.handleChange}
                />
            </InputContainer>
            <InputContainer label='Owner'>
                <Dropdown
                    id='owner'
                    options={members[formik.values.kindOfOwner] || []}
                    optionLabel='name'
                    optionValue='_id'
                    placeholder="Select owner"
                    value={formik.values.owner}
                    onChange={formik.handleChange}
                />
            </InputContainer>
            <InputContainer label="Description">
                <InputTextarea 
                    id='description'
                    placeholder='Describe the documents...'
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