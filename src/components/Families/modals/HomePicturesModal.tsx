import React, { useState, useMemo, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/client'
//components
import ImageUploader from 'components/UI/Molecules/ImageUploader'
import { Toast } from 'primereact/toast'
//context
import { FamilyContext } from 'context/FamilyContext'
const msFamily = 'ms-fands'

const HomePicturesForm = ({ setVisible, pictures, setPictures }) => {
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
      family.home &&
        family.home.homePictures
          .filter((picture) => picture !== null)
          .map((picture, index) => {
            formData.append(
              `familyPictures[${index}][picture]`,
              picture.picture
            )

            return {
              src: picture.picture,
              caption: picture.caption,
              id: index,
            }
          })
    )
  }, [family.home?.homePictures])

  const submit = () => {
    setIsloading(true)
    axios({
      url: `http://localhost:5000/ms-fands/api/v1/admin/families/${family._id}/picture`,
      method: 'PATCH',
      data: formData,
      onUploadProgress: (p) => {
        setProgress((p.loaded / p.total) * 100)
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${session?.token}`,
      },
    })
      .then((res) => {
        showSuccess('Home pictures successfully updated')
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
      `home[homePictures][${pictures?.length || 0}][picture]`,
      e.target.files[0]
    )
    formData.append(
      `home[homePictures][${pictures?.length || 0}][caption]`,
      e.target.files[0]?.name
    )
    setPictures([
      ...(pictures || []),
      {
        src: URL.createObjectURL(e.target.files[0]),
        caption: e.target.files[0]?.name,
        id: pictures?.length || 0,
      },
    ])
  }
  const handleDelete = (data) => {
    const updatedData = [
      ...pictures.filter((picture) => picture.id !== data.id),
    ]
    formData.delete(`home[homePictures][${data.id}][picture]`)
    formData.delete(`home[homePictures][${data.id}][caption]`)
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
export default HomePicturesForm
