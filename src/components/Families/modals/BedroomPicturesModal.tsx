// main tools
import { useState, useMemo, useContext, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/client'
import axios from 'axios'

//components
import ImageUploader from 'components/UI/Molecules/ImageUploader'

// prime components
import { Toast } from 'primereact/toast'

//context
import { FamilyContext } from 'context/FamilyContext'

export const BedroomsPicturesModal = ({
  setVisible,
  pictures,
  setPictures,
  editingBedroom,
}) => {
  const idx = editingBedroom._id?.replace('studentRoom', '') || 'new'

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
    const pics = []

    Object.entries(editingBedroom).map((aux) => {
      if (typeof aux[1] === 'object') {
        Object.entries(aux[1]).map((aux2) => {
          if (aux[0] !== 'photos')
            formData.append(
              `studentRooms[${idx}][${aux[0]}][${aux2[0]}]`,
              aux2[1]
            )
        })
      } else if (typeof aux[1] === 'string' || typeof aux[1] === 'number') {
        formData.append(`studentRooms[${idx}][${aux[0]}]`, `${aux[1]}`)
      }
    })

    family.home &&
      family.home.studentRooms
        .filter((_, index) => index == idx)
        .map((room, index) =>
          room.photos
            .filter((pic) => pic !== null)
            .map((pic, i) => {
              formData.append(
                `studentRooms[${idx}][photos][${index}${i}][picture]`,
                pic.picture
              )
              formData.append(
                `studentRooms[${idx}][photos][${index}${i}][caption]`,
                pic.caption
              )
              pics.push({
                src: pic.picture,
                alt: pic.caption,
                id: `${index}${i}`,
              })
            })
        )

    setPictures(pics)
  }, [editingBedroom])

  const submit = () => {
    setIsloading(true)
    if (!pictures || pictures.length === 0)
      formData.append(`studentRooms[${idx}][photos]`, '[]')

    formData.delete(`studentRooms[${idx}][_id]`)
    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/ms-fands/admin/families/${family._id}/home`,
      method: 'PUT',
      data: formData,
      onUploadProgress: (p) => setProgress((p.loaded / p.total) * 100),
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${session?.token}`,
      },
    })
      .then((res) => {
        showSuccess('Bedroom pictures successfully updated')
        getFamily()
        setTimeout(() => setVisible(false), 1500)
      })
      .catch((err) => {
        showError()
        setTimeout(() => setVisible(false), 1500)
      })
  }

  const onChangeHandler = (e) => {
    formData.append(
      `studentRooms[${idx}][photos][${pictures?.length || 0}][picture]`,
      e.target.files[0]
    )
    formData.append(
      `studentRooms[${idx}][photos][${pictures?.length || 0}][caption]`,
      e.target.files[0]?.name
    )

    const updatePictures =
      pictures?.filter((item) => item.id !== pictures?.length) || []

    updatePictures.push({
      src: URL.createObjectURL(e.target.files[0]),
      caption: e.target.files[0]?.name,
      id: pictures?.length || 0,
    })

    setPictures([...updatePictures.filter((item) => item !== undefined)])
  }

  const handleDelete = (data) => {
    const updatedData = [
      ...pictures.filter((picture) => picture.id !== data.id),
    ]
    formData.delete(`studentRooms[${idx}][photos][${data.id}][picture]`)
    formData.delete(`studentRooms[${idx}][photos][${data.id}][caption]`)
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
