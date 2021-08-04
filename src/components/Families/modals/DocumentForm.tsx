import React,{useEffect,useState, useContext } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import FileUploader from 'components/UI/Atoms/FileUploader'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown'
//services
//hooks 
import useMembers from 'hooks/useMembers'
type DocumentData = {
    _id: string 
    name: string
    remarks: string
    owner: {
        kind: string
        id: string
    }
}
interface Props {
    data?: DocumentData,
    onSubmit: (params:any, id?: string) => void
}
const formatedKindOfOwner = {
                hosts: 'Host',
                Host: 'hosts',
                familyMembers: 'FamilyMember',
                FamilyMember: 'familyMembers',
                tenants: 'Tenant',
                Tenant: 'tenants',
                externalStudents: 'ExternalStudent',
                ExternalStudent: 'externalStudents'

    }
const formatOwner = (owner) => {
    return {
        name: `${owner.firstName} ${owner.lastName}`,
        id: owner.id
    }
}


const DocumentsForm : React.FC<Props> = ({data, onSubmit}) => {
    const members = useMembers({})    
    const [name, setName] = useState(data?.name || '')
    const [description, setDescription] = useState(data?.remarks || '')
    const [owner, setOwner] = useState( data ? formatOwner(data?.owner) : {name:'', id:''})
    const [kindOfOwner, setKindOfOwner] = useState(formatedKindOfOwner[data?.owner.kind] || '')
    const kindOfOwnerInput = [
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
        const handleSubmit = (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            
            formData.set('owner[kind]', formatedKindOfOwner[kindOfOwner])
            formData.set('owner[id]', owner.id)
            if(data){
                onSubmit(formData, data._id)
            }else{
                onSubmit(formData)
            } 
        }
    return(
        <form onSubmit={handleSubmit}>
            <InputContainer label="Upload file">
                <FileUploader id="file" name="file" placeholder="Upload document" onChange={()=>{}}/>
            </InputContainer>
            <InputContainer label="Name">
                <InputText 
                    placeholder="Document name"
                    name="name"
                    value={name}
                    onChange={e => {setName(e.target.value)}}
                /> 
            </InputContainer>
            <InputContainer label='kind of owner'>
                <Dropdown
                    id='kindOfOwner'
                    options={kindOfOwnerInput}
                    optionLabel='label'
                    value={kindOfOwner}
                    onChange={e => {setKindOfOwner(e.target.value)}}
                    optionValue='name'
                    placeholder="Select kind of owner"
                />
            </InputContainer>
            <InputContainer label='Owner'>
                <Dropdown
                    optionLabel='name'
                    options= {members[kindOfOwner] || []}
                    placeholder="Select owner"
                    value={owner}
                    onChange={e => {setOwner(e.value);console.log(owner)}}
                />
            </InputContainer>
            <InputContainer label="Description">
                <InputTextarea 
                    name="remarks"
                    value={description}
                    onChange={e => {setDescription(e.target.value)}}
                    placeholder='Describe the documents...'
                    rows={5} 
                    cols={30}
                    autoResize 
                />
            </InputContainer>
            <Button type="submit">Save</Button>
        </form>
    )
}
export default DocumentsForm