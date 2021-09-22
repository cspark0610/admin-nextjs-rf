import React, { useState, useMemo, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/client'
//components
import { Toast } from 'primereact/toast'
import ImageUploader from 'components/UI/Molecules/ImageUploader'
//context
import { FamilyContext } from 'context/FamilyContext'
const msFamily = 'ms-fands'

const FamilyPicturesForm = ({ setVisible }) => {
  const [pictures, setPictures] = useState([])
  const [progress, setProgress] = useState(0)
  const { family, getFamily } = useContext(FamilyContext)
  const formData = useMemo(() => new FormData(), [])
  const [session] = useSession()
  const [isLoading, setIsloading] = useState(false)
  const toast = useRef(null)

  const showSuccess = (msg) => {
    toast.current.show({
      severity: 'success',
      summary: 'Success Message',
      detail: msg,
      life: 3000,
    })
  }
  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error Message',
      detail: 'An error has ocurred',
      life: 3000,
    })
  }

  useEffect(() => {
    setPictures(
      family.familyPictures
        .filter((picture) => picture !== null)
        .map((picture, index) => {
          formData.append(`familyPictures[${index}][picture]`, picture.picture)
          formData.append(`familyPictures[${index}][caption]`, picture.caption)

          return {
            src: picture.picture,
            caption: picture.caption,
            id: index,
          }
        })
    )
  }, [family.familyPictures])

  const submit = () => {
    setIsloading(true)
    if (pictures.length === 0) formData.append('familyPictures', '[]')

    axios({
      url: `http://localhost:5000/ms-fands/api/v1/admin/families/${family._id}`,
      method: 'PUT',
      data: formData,
      onUploadProgress: (p) => setProgress((p.loaded / p.total) * 100),
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${session?.token}`,
      },
    })
      .then((res) => {
        showSuccess('Family pictures successfully updated')
        getFamily()
        setTimeout(() => {
          setVisible(false)
        }, 1500)
      })
      .catch((err) => {
        console.error(err)
        showError()
        setTimeout(() => {
          setVisible(false)
        }, 1500)
      })
  }

  const onChangeHandler = (e) => {
    formData.append(
      `familyPictures[${pictures.length}][picture]`,
      e.target.files[0]
    )
    formData.append(
      `familyPictures[${pictures.length}][caption]`,
      e.target.files[0]?.name
    )
    setPictures([
      ...pictures,
      {
        src: URL.createObjectURL(e.target.files[0]),
        caption: e.target.files[0]?.name,
        id: pictures.length,
      },
    ])
  }

  const handleDelete = (data) => {
    const updatedData = pictures.filter((picture) => picture.id !== data.id)

    formData.delete(`familyPictures[${data.id}][picture]`)
    formData.delete(`familyPictures[${data.id}][caption]`)

    setPictures(updatedData)
  }
  return (
    <>
      <ImageUploader
        id='file'
        name='file'
        pictures={pictures}
        setPictures={setPictures}
        loading={isLoading}
        onSubmit={submit}
        onChange={onChangeHandler}
        onDelete={handleDelete}
        progress={progress}
      />
      <Toast ref={toast} />
    </>
  )
}
export default FamilyPicturesForm
