import React, {useState,useMemo, useContext, useEffect} from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/client';
//components
import ImageUploader from 'components/UI/Molecules/ImageUploader'
//context   
import {FamilyContext} from 'context/FamilyContext'
const msFamily = 'ms-fands'

const FamilyPicturesForm = ({setVisible}) => {
    const [pictures, setPictures] = useState([])
    const [progress, setProgress] = useState(0)
    const {family, getFamily} = useContext(FamilyContext)
    const formData = useMemo(() => new FormData(), [])
    const [session] = useSession()
    const [isLoading, setIsloading] = useState(false)

    useEffect(() => {
        setPictures(family.familyPictures.filter(picture => picture !== null).map((picture, index) => {
            formData.append(`familyPictures[${index}][picture]`, picture.picture)

            return {
                src: picture.picture,
                caption: picture.caption,
                id: index
            }
        }))
    }, [family.familyPictures])

    const submit = () => {
        setIsloading(true)
            axios({
            url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${family._id}`,
            method: 'PUT',
            data: formData,
            onUploadProgress: (p) => {
                setProgress((p.loaded / p.total)*100)
            },
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${session?.token}`
            },
        })
        .then((res)=>{
            console.log(res)
            setVisible(false)
            getFamily()
        })
        .catch(err=> {
            console.log(err)
            setVisible(false)
        })
    }
    const onChangeHandler = (e) => {
       formData.append(`familyPictures[${pictures.length}][picture]`, e.target.files[0])
       formData.append(`familyPictures[${pictures.length}][caption]`, e.target.files[0].name)
       setPictures([
            ...pictures,
            {
                src: URL.createObjectURL(e.target.files[0]), 
                caption: e.target.files[0].name, 
                id: pictures.length
            }
        ])
    }
    const handleDelete = data => {
        console.log('data', data)
        const updatedData = [...pictures.filter(picture => picture.id !== data.id)]
        formData.delete(`familyPictures[${data.id}][picture]`)
        formData.delete(`familyPictures[${data.id}][caption]`)
        setPictures(updatedData)
    }
    return(
            <ImageUploader 
                id="file" 
                name="file" 
                pictures={pictures}
                setPictures={setPictures}
                loading={isLoading}
                onSubmit={submit}
                onChange={onChangeHandler}
                onDelete={handleDelete}
                progress={progress}
            />
    )
}
export default FamilyPicturesForm