import React, { useState, useEffect } from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext';
import FormGroup from 'components/UI/Molecules/FormGroup'
import FileUploader from 'components/UI/Atoms/FileUploader'
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Rating } from 'primereact/rating';
//hooks
import useGenerics from 'hooks/useGenerics'

type Score = {
    treatment: number
    activities: number
    communication: number
    meals: number
    room: number
}

export default function ReviewForm({onSubmit}) {
    const [photoURL, setPhotoURL] = useState('')
    const [videoURL, setVideoURL] = useState('')
    const [scores, setScores] = useState<Score>({
        activities: 0,
        communication: 0,
        treatment: 0,
        meals: 0,
        room: 0
    })
    const [overallScore, setOverallScore] = useState(0)
    const [genericInputs, isLoadingGeneric] = useGenerics(['nationalities', 'program', 'schools'])
    const [school, setSchool] = useState(null)
    const [program, setProgram] = useState(null)
    const [nationality, setNationality] = useState(null)

    useEffect(() => {
        (() => {
            const sum = Object.values(scores).reduce(((acum, nextValue) => acum + nextValue), 0)
            setOverallScore(Math.round(sum / Object.values(scores).length))
        })()
        return () => { }
    }, [scores])
    console.log(genericInputs)

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
        for (const key of Object.keys(scores)) {
            formData.append(key, scores[key].toString())
        }

        // onSubmit(formData)
        // console.log(formData)
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className='two-columns'>
                <InputContainer label="Student name">
                    <InputText
                        name="name"
                        required
                        placeholder="Student name"
                    />
                </InputContainer>
                <InputContainer label="Nationality">
                    <Dropdown
                        options={genericInputs['nationalities']}
                        required
                        optionLabel='name'
                        value={nationality}
                        onChange={e => {setNationality(e.value)}}
                        placeholder="Select nationality"
                        name="nationality"
                    />
                </InputContainer>
                <InputContainer label="Course or program">
                    <Dropdown
                        options={genericInputs['program']}
                        optionLabel='name'
                        required
                        value={program}
                        onChange={e => {setProgram(e.value)}}
                        placeholder="Select program"
                        name="program"
                    />
                </InputContainer>
                <InputContainer label="School">
                    <Dropdown
                        options={genericInputs['schools']}
                        optionLabel='name'
                        required
                        value={school}
                        onChange={e => {setSchool(e.value)}}
                        placeholder="Select school"
                        name="school"
                    />
                </InputContainer>
            <InputContainer label="Date of birth">
                <Calendar
                    placeholder='Date of birth'
                    showIcon
                    required
                    name='DateOfBirth'
                />
            </InputContainer>
            </div>

            <InputContainer label="Comments">
                <InputTextarea
                    placeholder="Put some comments..."
                    required
                    name='feedback'
                    rows={5}
                    cols={30}
                    autoResize
                />
            </InputContainer>
            <div className="two-columns">
                <InputContainer label="Student Video">
                    {videoURL ? <video width="100%" height="auto" controls>
                        <source src={videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video> : <img style={{borderRadius:'14px', width:'100%'}} src="/assets/img/notVideoFound.svg" alt='You have not uploaded a video yet'/>}
                    <FileUploader
                        id="studentVideo"
                        style ={{marginTop: '1em'}}
                        name='video'
                        onChange={renderVideo}
                        placeholder="Upload student's video"
                    />
                </InputContainer>
                <InputContainer label="Student Photo" style={{paddingLeft: photoURL ? '4rem' : '0'}}>
                    {photoURL ? 
                        <img src={photoURL} style={{maxWidth:'240px',width:'100%', aspectRatio: '1/1',objectFit:'cover', borderRadius:'50%'}} alt='photo of the student' />
                        : <img style={{borderRadius:'14px', width:'100%'}} src="/assets/img/photoNotFound.svg" alt='You have not uploaded a video yet'/>
                    }
                    <FileUploader
                        style ={{marginTop: '1em'}}
                        id="studentPhoto"
                        name='photo'
                        onChange={renderPhoto}
                        placeholder="Upload student's photo"
                    />
                </InputContainer>
            </div>
            <FormGroup title="Scores" customClass="three-columns">
                <InputContainer label="Family Treatment">
                    <Rating cancel={false} value={scores.treatment} onChange={(e) => setScores({ ...scores, treatment: e.value })} />
                </InputContainer>
                <InputContainer label="Communication">
                    <Rating cancel={false} value={scores.communication} onChange={(e) => setScores({ ...scores, communication: e.value })} />
                </InputContainer>
                <InputContainer label="Activities">
                    <Rating cancel={false} value={scores.activities} onChange={(e) => setScores({ ...scores, activities: e.value })} />
                </InputContainer>
                <InputContainer label="Meals">
                    <Rating cancel={false} value={scores.meals} onChange={(e) => setScores({ ...scores, meals: e.value })} />
                </InputContainer>
                <InputContainer label="Room">
                    <Rating cancel={false} value={scores.room} onChange={(e) => setScores({ ...scores, room: e.value })} />
                </InputContainer>
                <InputContainer label="Overall Score">
                    <Rating cancel={false} value={overallScore} />
                </InputContainer>
            </FormGroup>
            <div className="align_right">
                <Button type='submit'>Save</Button>
            </div>
        </form>
    )
}
