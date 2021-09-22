import { useState, useMemo, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/client'
//components
import ImageUploader from 'components/UI/Molecules/ImageUploader'
import { Toast } from 'primereact/toast'
//context
import { FamilyContext } from 'context/FamilyContext'
const msFamily = 'ms-fands'

const HomePicturesForm = ({ setVisible, pictures, setPictures }) => {
  const toast = useRef(null)
  const formData = useMemo(() => new FormData(), [])
  const { family, getFamily } = useContext(FamilyContext)
  const [progress, setProgress] = useState(0)
  const [session] = useSession()
  const [isLoading, setIsloading] = useState(false)

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
    formData.append(`photoGroups[0][name]`, 'Inside')

    const pics = []
    family &&
      family.home &&
      family.home?.photoGroups &&
      family.home.photoGroups
        .find((category) => category.name === 'Inside')
        .photos.map((photo, idx) => {
          formData.append(`photoGroups[0][photos][${idx}][photo]`, photo.photo)

          pics.push({
            src: photo.photo || photo.src,
            alt: photo.caption || photo._id,
            id: `${idx}`,
          })
        })

    setPictures(pics)
  }, [family.home?.photoGroups])

  const submit = () => {
    setIsloading(true)
    if (pictures.length === 0) formData.append('photoGroups[0][photos]', '[]')

    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${family._id}/picture`,
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
        setTimeout(() => setVisible(false), 1500)
      })
      .catch((err) => {
        console.error(err)
        showError()
        setTimeout(() => setVisible(false), 1500)
      })
  }

  const onChangeHandler = (e) => {
    formData.append(
      `photoGroups[0][photos][${pictures?.length || 0}][photo]`,
      e.target.files[0]
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
    formData.delete(`photoGroups[0][photos][${data.id}][photo]`)
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
