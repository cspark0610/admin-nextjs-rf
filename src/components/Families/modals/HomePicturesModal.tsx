import { useState, useMemo, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/client'
//components
import ImageUploader from 'components/UI/Molecules/ImageUploader'
import { Toast } from 'primereact/toast'
//context
import { FamilyContext } from 'context/FamilyContext'
const msFamily = 'ms-fands'

const HomePicturesForm = ({
  setVisible,
  pictures,
  homeCategory,
  setPictures,
}) => {
  const toast = useRef(null)
  const formData = useMemo(() => new FormData(), [])
  const { family, getFamily } = useContext(FamilyContext)
  const [progress, setProgress] = useState(0)
  const [actualIndex, setActualIndex] = useState(0)
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

  const groupBy = (group, key: string) => {
    return group.reduce((acum: object, filter: object) => {
        ;(acum[filter[key]] = acum[filter[key]] || []).push(filter)
        return acum
    }, {})
  }

  useEffect(() => {
    
    const pictures = groupBy(family.home?.photoGroups.filter(g=>g!==null), 'name')
    let find = false
    let actualIdx = 0
    const pics = []

    Object.entries(pictures).forEach((obj: any, idx: number) => {
      if (obj[0] === homeCategory) {
        find = true
        actualIdx = idx
      } else {
        if (!find) {
          actualIdx = family.home?.photoGroups.length
          formData.append(
            `photoGroups[${family.home?.photoGroups.length}][name]`,
            homeCategory
          )
          find = true
        }
      }
      formData.append(`photoGroups[${idx}][name]`, obj[0])
      obj[1][0].photos.forEach((pic, index) => {
        formData.append(
          `photoGroups[${idx}][photos][${index}][photo]`,
          pic.src || pic.photo
        )
        if (obj[0] === homeCategory)
          pics.push({
            src: pic.photo || pic.src,
            alt: pic.caption || pic._id,
            id: `${index}`,
          })
      })
    })

    family.home?.photoGroups.length === 0 &&
      formData.append('photoGroups[0][name]', homeCategory)

    setActualIndex(actualIdx)
    setPictures(pics)
  }, [family.home?.photoGroups])

  const submit = () => {
    setIsloading(true)
    if (pictures.length === 0)
      formData.append(`photoGroups[${actualIndex}][photos]`, '[]')

    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${family._id}/home`,
      method: 'PUT',
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
      `photoGroups[${actualIndex}][photos][${pictures?.length || 0}][photo]`,
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
      ...pictures
        .filter((picture) => picture.id !== data.id)
        .map((picture, index) => ({ ...picture, id: index })),
    ]

    pictures.forEach((_, index) => {
      formData.delete(`photoGroups[${actualIndex}][photos][${index}][photo]`)
      formData.delete(`photoGroups[${actualIndex}][photos][${index}][caption]`)
    })

    updatedData.forEach((picture) => {
      formData.append(
        `photoGroups[${actualIndex}][photos][${picture.id}][photo]`,
        picture.src
      )
      formData.append(
        `photoGroups[${actualIndex}][photos][${picture.id}][caption]`,
        picture.alt
      )
    })

    setPictures(updatedData)
  }

  return (
    <>
      <ImageUploader
        id='file'
        name='file'
        pictures={pictures}
        category={homeCategory}
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
