import React, { useState, useEffect } from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils'
import { AvailabilityPicker } from 'components/UI/Atoms/AvailabilityPicker'
//utils
import { general } from 'utils/calendarRange'
import FileUploader from 'components/UI/Atoms/FileUploader'
import GenericsService from 'services/Generics'
import { useSession } from 'next-auth/client'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
type bedroomData = any
interface Props {
  data?: any
  onSubmit: (e: any) => void
}

const Types = ['Private', 'Shared']
const BathroomLocationTypes = ['In the Room', 'Outside of the Room']
const BathTypes = ['Private', 'Shared']
const BedTypes = ['Single', 'Double/Full', 'Queen', 'King', 'Twin/Single']
const FloorTypes = ['Upper Level', 'Main Level', 'Lower Level']

const BedroomModal: React.FC<Props> = ({ data, onSubmit }) => {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [aditional, setAditional] = useState([])
  const [session] = useSession()

  const getDates = (dates: Date[] | string[]) => {
    const formatedDates = []
    dates?.map((date: Date | string) =>
      typeof date === 'string'
        ? formatedDates.push(new Date(date))
        : formatedDates.push(date)
    )

    return formatedDates
  }

  useEffect(() => {
    ;(async () => {
      const { additionalRoomFeatures } = await GenericsService.getAll(
        session?.token,
        ['additionalRoomFeatures']
      )
      setAditional(additionalRoomFeatures)
    })()
  }, [session])

  const formik = useFormik({
    initialValues: {
      availability: data?.availability || [],
      type: data?.type || '',
      bathroomLocation: data?.bathroomLocation || '',
      bathType: data?.bathType || '',
      bedType: data?.bedType || '',
      floor: data?.floor || '',
      aditionalFeatures: data?.aditionalFeatures || [],
    },
    validate: (data) => {
      let errors: Partial<bedroomData> = {}
      if (data.availability === '') {
        errors.availability = 'Availability is required'
      }
      if (data.type === '') {
        errors.type = 'Type is required'
      }
      if (data.bathroomLocation === '') {
        errors.bathroomLocation = 'Bathroom Location is required'
      }
      if (data.bathType === '') {
        errors.bathType = 'Bath Type is required'
      }
      if (data.floor === '') {
        errors.floor = 'Floor is required'
      }
      return errors
    },
    onSubmit: (data) => {
      onSubmit({
        ...data,
        availability: [...data.availability],
        photos: photo ? [photo] : [],
      })
      // formik.resetForm()
    },
  })
  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className='p-error'>{formik.errors[name]}</small>
      )
    )
  }

  const renderPhoto = (event) => {
    const image = URL.createObjectURL(event.target.files[0])
    setPhoto(event.target.files[0])
    setPhotoUrl(image)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <InputContainer
        label='Photo'
        style={{ paddingLeft: photoUrl ? '4rem' : '0' }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            style={{
              maxWidth: '240px',
              width: '100%',
              aspectRatio: '1/1',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
            alt='photo of the student'
          />
        ) : (
          <img
            style={{ borderRadius: '14px', width: '100%' }}
            src='/assets/img/photoNotFound.svg'
            alt='You have not uploaded an image yet'
          />
        )}
        <FileUploader
          style={{ marginTop: '1em' }}
          id='studentPhoto'
          name='studentPhoto'
          onChange={renderPhoto}
          placeholder="Upload student's photo"
        />
      </InputContainer>
      <InputContainer
        label='Availability'
        labelClass={classNames({ 'p-error': isFormFieldValid('availability') })}
      >
        <AvailabilityPicker
          dates={formik.values.availability}
          setDates={formik.handleChange}
        />
        {getFormErrorMessage('availability')}
      </InputContainer>
      <InputContainer
        label='Type'
        labelClass={classNames({ 'p-error': isFormFieldValid('type') })}
      >
        <Dropdown
          id='type'
          options={Types}
          placeholder='Type'
          value={formik.values.type}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('type') })}
        />
        {getFormErrorMessage('bathroomLocation')}
      </InputContainer>
      <InputContainer
        label='Bathroom Location'
        labelClass={classNames({
          'p-error': isFormFieldValid('bathroomLocation'),
        })}
      >
        <Dropdown
          id='bathroomLocation'
          options={BathroomLocationTypes}
          placeholder='Bathroom Location'
          value={formik.values.bathroomLocation}
          onChange={formik.handleChange}
          className={classNames({
            'p-invalid': isFormFieldValid('bathroomLocation'),
          })}
        />
        {getFormErrorMessage('bathroomLocation')}
      </InputContainer>
      <InputContainer
        label='Bath Type'
        labelClass={classNames({ 'p-error': isFormFieldValid('bathType') })}
      >
        <Dropdown
          id='bathType'
          options={BathTypes}
          placeholder='Bath Type'
          value={formik.values.bathType}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('bathType') })}
        />
        {getFormErrorMessage('bathType')}
      </InputContainer>
      <InputContainer
        label='Bed Type'
        labelClass={classNames({ 'p-error': isFormFieldValid('bedType') })}
      >
        <Dropdown
          id='bedType'
          options={BedTypes}
          placeholder='Bed Type'
          value={formik.values.bedType}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('bedType') })}
        />
        {getFormErrorMessage('bedType')}
      </InputContainer>
      <InputContainer
        label='Floor'
        labelClass={classNames({ 'p-error': isFormFieldValid('floor') })}
      >
        <Dropdown
          id='floor'
          options={FloorTypes}
          placeholder='Bed Type'
          value={formik.values.floor}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('floor') })}
        />
        {getFormErrorMessage('floor')}
      </InputContainer>
      <InputContainer
        label='Aditional Features'
        labelClass={classNames({
          'p-error': isFormFieldValid('aditionalFeatures'),
        })}
      >
        <MultiSelect
          id='aditionalFeatures'
          name='aditionalFeatures'
          options={aditional}
          optionLabel='name'
          value={formik.values.aditionalFeatures}
          selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
          onChange={formik.handleChange}
          placeholder='Select aditional features'
        />
        {getFormErrorMessage('aditionalFeatures')}
      </InputContainer>
      <Button type='submit'>Save</Button>
    </form>
  )
}
export default BedroomModal
