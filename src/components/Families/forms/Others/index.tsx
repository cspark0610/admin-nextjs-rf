import React, { useState } from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import FormGroup from 'components/UI/Molecules/FormGroup'
import TagInput from 'components/UI/Molecules/TagInput'

export default function OthersForm() {
    const [searchTags, setSearchtags] = useState(['Apple Client', 'Microsoft Summer Program', 'Barcelona University'])
    return (
        <div>
            <FormGroup title="Seatch tags">
                <InputContainer label='Tags'>
                    <TagInput placeholder="search tags" value={searchTags} setValue={setSearchtags} />
                </InputContainer>
            </FormGroup>
        </div>
    )
}
