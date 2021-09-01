import React from 'react'
//components
import InputContainer from 'components/UI/Molecules/InputContainer'
import ImageUploader from 'components/UI/Molecules/ImageUploader'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'


const FamilyPicturesForm = () => {
    return(
            <ImageUploader 
                id="file" 
                name="file" 
                onChange={() => {}}
            />
    )
}
export default FamilyPicturesForm