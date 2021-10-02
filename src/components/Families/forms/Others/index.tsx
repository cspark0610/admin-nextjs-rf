import React, { useState, useContext, useEffect, useRef } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import FormGroup from 'components/UI/Molecules/FormGroup'
import { MultiSelect } from 'primereact/multiselect'
import {Toast} from 'primereact/toast'
import FormHeader from 'components/UI/Molecules/FormHeader'
import CreatableSelect from 'react-select/creatable';
//context 
import { FamilyContext } from 'context/FamilyContext'
import { useSession } from "next-auth/client";
//services
import FamiliesService from 'services/Families'
import GenericsService from 'services/Generics'

const msFamily = 'ms-fands'

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
        GenericsService.getGeneric(session?.token, 'labels')
            .then(response => setTagsInput(response))
            .catch(error => console.error(error))
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


    const [selectedTags, setselectedTags] = useState([])

    useEffect(() => {
        const tagsFormated = []
        if(searchTags.length > 0) {
          searchTags.forEach((diet) => tagsFormated.push(diet.value))
          setselectedTags(tagsFormated)
        }
    }, [tagsInput.length])


    const handleTagsSelect = (value) => {
        setselectedTags(value)
        if (value.length > 0) {
            let newDataTags = []
            value.forEach(val => {
              let toPush = {
                ...tagsInput
                    .map(item => ({...item, label: item.name, value: item.name}))
                    .filter(svc => svc.value === val)[0],
                isFreeComment: false,
              }
                newDataTags.push(toPush)
                console.log(newDataTags, 'new formatted data')
            })
            setSearchTags(newDataTags)
          } else {
            setSearchTags([])
          }
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
                    <MultiSelect
                        name='tags'
                        value={selectedTags}
                        options={tagsInput.map(item => ({...item, label: item.name, value: item.name}))}
                        onChange={(e) => handleTagsSelect(e.value)}
                        optionLabel='name'
                        placeholder='Select an activity'
                    />
                </InputContainer>
            </FormGroup>
        </>
    )
}
