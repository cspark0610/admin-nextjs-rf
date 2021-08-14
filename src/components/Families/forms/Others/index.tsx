import React, { useState } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import FormGroup from 'components/UI/Molecules/FormGroup'
import TagInput from 'components/UI/Molecules/TagInput'
import FormHeader from 'components/UI/Molecules/FormHeader'

export default function OthersForm() {
    const [searchTags, setSearchtags] = useState(['Apple Client', 'Microsoft Summer Program', 'Barcelona University'])

    const handleSubmit = () => {
        console.log(searchTags)
    }
    return (
        <>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                <FormHeader title="Search" onClick={handleSubmit} />
            </form>
            <FormGroup title="Seatch tags">
                <InputContainer label='Tags'>
                    <TagInput placeholder="search tags" value={searchTags} setValue={setSearchtags} />
                </InputContainer>
            </FormGroup>
        </>
    )
}
