import React,{useState} from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown} from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils'
//hooks
import useGenerics from 'hooks/useGenerics'

export default function ReviewForm() {
    const [photoURL, setPhotoURL] = useState('')
    const [videoURL, setVideoURL] = useState('')
    // const [genericInputs, isLoadingGeneric] = useGenerics(['nationalities'])
    // console.log(genericInputs)
    const renderPhoto = (event) => {
        const image = URL.createObjectURL(event.target.files[0])
        setPhotoURL(image)
    }
    const renderVideo = (event) => {
        const video = URL.createObjectURL(event.target.files[0])
        setVideoURL(video)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        renderPhoto(formData)
        console.log(formData.get('name'))
    }
    return (
        <form onSubmit={handleSubmit}>
           <InputContainer label="Student name">
                <InputText
                    name="name"
                    placeholder="Student name"
                /> 
           </InputContainer> 
           <InputContainer label="Nationality">
               <Dropdown
                    placeholder="Select nationality"
                    name="nationality"

               />
           </InputContainer> 
           <InputContainer label="Date of birth">
                <Calendar 
                    placeholder='Date of birth'
                    showIcon
                    name='DateOfBirth'
                />
           </InputContainer> 
           <InputContainer label="Comments">
                <InputTextarea 
                    placeholder="Put some comments..."
                    name='comments'
                    rows={5} 
                    cols={30}
                    autoResize 
                />
           </InputContainer> 
           <InputContainer label="Student Photo">
                <input 
                    type="file"
                    name="photo"
                    id="studentPhoto"
                    onChange={e => {renderPhoto(e)}}
                /> 
                {photoURL && <img src={photoURL} alt='photo of the student' />}
           </InputContainer>
           <InputContainer label="Student Video">
               <input 
                    type="file"
                    name="video" 
                    id="studentVideo" 
                    onChange={e => {renderVideo(e)}}
                />
                {videoURL && <video src={photoURL} />}
           </InputContainer>
           <Button type='submit'>Save</Button>
        </form>
    )
}
