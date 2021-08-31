import React, { useState, useEffect, useContext } from 'react'
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
//utils
import {general} from 'utils/calendarRange'
import { FamilyContext } from 'context/FamilyContext';

type Score = {
    treatment: number
    activities: number
    communication: number
    meals: number
    room: number
}

export default function ReviewForm({onSubmit, data, onUpdate}) {
    const { family } = useContext(FamilyContext)

    const [name, setName] = useState(data?.studentName || '')
    const [feedback, setFeedback] = useState(data?.feedback || '')
    const [date, setDate] = useState(data?.date || '')
    const [photoURL, setPhotoURL] = useState(data?.studentPhoto || '')
    const [videoURL, setVideoURL] = useState(data?.studentVideo || '')
    const [scores, setScores] = useState<Score>({
        activities: data?.activities || 0,
        communication: data?.communication || 0,
        treatment: data?.treatment || 0,
        meals: data?.meals || 0,
        room: data?.room || 0
    })
    const [overallScore, setOverallScore] = useState(data?.overallScore || 0)
    const [genericInputs, isLoadingGeneric] = useGenerics(['nationalities', 'program', 'schools'])
    const [school, setSchool] = useState(data?.studentSchool || null)
    const [program, setProgram] = useState(data?.program || null)
    const [nationality, setNationality] = useState(data?.studentNationality || null)

    useEffect(() => {
        (() => {
            const sum = Object.values(scores).reduce(((acum, nextValue) => acum + nextValue), 0)
            setOverallScore(Math.round(sum / Object.values(scores).length))
        })()
        return () => { }
    }, [scores])

    const renderPhoto = (event) => {
        const image = URL.createObjectURL(event.target.files[0])
        setPhotoURL(image)
    }
    const renderVideo = (event) => {
        const video = URL.createObjectURL(event.target.files[0])
        console.log(video)
        setVideoURL(video)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formData = new FormData()

        formData.append('family', family._id)
        formData.append('studentName', data.get('studentName'))
        formData.append('date', data.get('date'))
        formData.append('feedback', data.get('feedback'))
        formData.append('studentVideo', data.get('studentVideo'))
        formData.append('studentPhoto', data.get('studentPhoto'))
        formData.append('studentNationality', nationality._id)
        formData.append('program', program._id)
        formData.append('studentSchool', school._id)
        
        for (const key of Object.keys(scores)) {
            formData.append(key, scores[key].toString())
        }


        if (data) {
            onUpdate(formData)
        } else {
            onSubmit(formData)
        }
    }

    const sortGenericBy = (generic, sortField) => generic.sort((a, b) => {
        if(a[sortField] > b[sortField]) return 1
        if(a[sortField] < b[sortField]) return -1
        return 0
    })

    return (
        <form onSubmit={handleSubmit}>
            <div className='two-columns'>
                <InputContainer label="Student name">
                    <InputText
                        name="studentName"
                        required
                        placeholder="Student name"
                        value={name}
                        onChange={({target}) => setName(target.value)}
                    />
                </InputContainer>
                <InputContainer label="Nationality">
                    <Dropdown
                        options={sortGenericBy(genericInputs['nationalities'] || [], 'name')}
                        required
                        optionLabel='name'
                        value={nationality}
                        onChange={e => setNationality(e.value)}
                        placeholder="Select nationality"
                        name="studentNationality"
                    />
                </InputContainer>
                <InputContainer label="Course or program">
                    <Dropdown
                        options={sortGenericBy(genericInputs['program'] || [], 'name')}
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
                        options={sortGenericBy(genericInputs['schools'] || [], 'name')}
                        optionLabel='name'
                        required
                        value={school}
                        onChange={e => {setSchool(e.value)}}
                        placeholder="Select school"
                        name="studentSchool"
                    />
                </InputContainer>
            <InputContainer label="Date">
                <Calendar
                    placeholder='Date'
                    showIcon
                    required
                    monthNavigator
                    yearNavigator
                    yearRange={general}
                    name='date'
                    value={date}
                    onChange={(e) => setDate(e.value)}
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
                    value={feedback}
                    onChange={({target}) => setFeedback(target.value)}
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
                        name='studentVideo'
                        onChange={renderVideo}
                        placeholder="Upload student's video"
                    />
                </InputContainer>
                <InputContainer label="Student Photo" style={{paddingLeft: photoURL ? '4rem' : '0'}}>
                    {photoURL ? 
                        <img src={photoURL} style={{maxWidth:'240px',width:'100%', aspectRatio: '1/1',objectFit:'cover', borderRadius:'50%'}} alt='photo of the student' />
                        : <img style={{borderRadius:'14px', width:'100%'}} src="/assets/img/photoNotFound.svg" alt='You have not uploaded an image yet'/>
                    }
                    <FileUploader
                        style ={{marginTop: '1em'}}
                        id="studentPhoto"
                        name='studentPhoto'
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
