import React, { useState, useContext, useEffect, useRef } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import FormGroup from 'components/UI/Molecules/FormGroup'
import TagInput from 'components/UI/Molecules/TagInput'
import {Toast} from 'primereact/toast'
import FormHeader from 'components/UI/Molecules/FormHeader'
import CreatableSelect from 'react-select/creatable';
//context 
import { FamilyContext } from 'context/FamilyContext'
import { useSession } from "next-auth/client";
//services
import FamiliesService from 'services/Families'


export default function OthersForm() {
    const toast = useRef(null)
    const { family, getFamily } = useContext(FamilyContext)
    const [session,] = useSession()
    const [searchTags, setSearchTags] = useState(family.labels.map(item => ({...item, label: item.name, value: item.name})) || [])
    //inputs
    const [tagsInput, setTagsInput] = useState([]);


    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:'Description successfully updated', life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:'An error has ocurred', life: 3000});
    }
    

    useEffect(() => {
        fetch(
            // `${process.env.NEXT_PUBLIC_API_URL}/labels`,
            `https://qafands.centriadev.com/api/v1/labels`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`
                }
            }
        )
        .then(response => response.json())
        .then(data => setTagsInput(data))
    }, []);

    const handleSubmit = () => {
        
        const data = searchTags.map(tag => tag._id)

        FamiliesService.updatefamily(session?.token, family._id, {labels: data})
            .then(()=> {
                // setLoading(false)
                getFamily()
                showSuccess()
            })
            .catch(err => {
                // setLoading(false)
                showError()
            })
    }
    
    return (
        <>
            <Toast ref={toast} />
            <form
                onSubmit={e => {
                    e.preventDefault()
                    // handleSubmit()
                }}
            >
                <FormHeader title="Search" onClick={handleSubmit} />
            </form>
            <FormGroup title="Search tags">
                <InputContainer label='Tags'>
                    {/* <TagInput placeholder="search tags" value={searchTags} setValue={setSearchtags} /> */}
                    <CreatableSelect
                        isMulti
                        placeholder='Search tags'
                        value={searchTags}
                        options={tagsInput.map(item => ({...item, label: item.name, value: item.name}))}
                        className="single_input" 
                        onChange={(e) => setSearchTags(e)}
                    />
                </InputContainer>
            </FormGroup>
        </>
    )
}
