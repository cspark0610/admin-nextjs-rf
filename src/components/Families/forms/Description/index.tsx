import React, { useState, useEffect, useContext, useRef } from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import { Toast } from 'primereact/toast'
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import FormHeader from 'components/UI/Molecules/FormHeader'
import CreatableSelect from 'react-select/creatable'
//styles
import classes from 'styles/Families/Forms.module.scss'
//services
import GenericsService from 'services/Generics'
import FamiliesService from 'services/Families'
//context
import { FamilyContext } from 'context/FamilyContext'
import { useSession } from 'next-auth/client'

export default function DescriptionForm() {
  const { family, getFamily } = useContext(FamilyContext)
  const [session] = useSession()
  //state ------------------------------------------
  const [loading, setLoading] = useState(false)
  const toast = useRef(null)
  //social media
  const [facebookUrl, setFacebookUrl] = useState(family.facebook || '')
  const [instagramUrl, setInstagramUrl] = useState(family.instagram || '')
  const [twitterUrl, setTwitterUrl] = useState(family.twitter || '')
  //activities}
  const [activities, setActivities] = useState(family.culturalActivities)
  const [hobbies, setHobbies] = useState(family.interests || [])
  //inputs
  const [activitiesInput, setActivitiesInput] = useState([])
  const [hobbiesInput, setHobbiesInput] = useState([])
  const [dietsInput, setDietsInput] = useState([])
  //meal plans
  const [diet, setDiet] = useState({
    value: family.mealPlan || '',
    label: family.mealPlan || '',
  })
  const [specialDiet, setSpecialDiet] = useState(null)
  const [familyDiet, setFamilyDiet] = useState([])

  useEffect(() => {
    ;(async () => {
      const { culturalActivities, interests, diets } =
        await GenericsService.getAll(session?.token, [
          'culturalActivities',
          'interests',
          'diets',
        ])

      setActivitiesInput(culturalActivities)

      setHobbiesInput(interests)

      setSpecialDiet({
        value: family.specialDiet?.isFreeComment
          ? family.specialDiet?.freeComment
          : family.specialDiet?.doc,
        isFreeComment: family.specialDiet?.isFreeComment,
        label: family.specialDiet?.isFreeComment
          ? family.specialDiet?.freeComment
          : diets.find((diet) => diet._id === family.specialDiet?.doc)?.name,
      })

      setDiet({
        value: family.mealPlan,
        label: family.mealPlan,
      })

      setFamilyDiet(
        family.acceptableDiets.map((diet) => {
          return {
            value: diet?.isFreeComment ? diet.freeComment : diet.doc,
            isFreeComment: diet?.isFreeComment,
            label: diet?.isFreeComment
              ? diet.freeComment
              : diets.find((aux) => aux._id === diet.doc).name,
          }
        })
      )

      setDietsInput(
        diets.map((diet) => ({
          label: diet.name,
          value: diet._id,
          isFreeComment: false,
        }))
      )
    })()
    return () => {}
  }, [session])

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Description successfully updated',
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
  const handleSubmit = () => {
    setLoading(true)

    const acceptableDiets = familyDiet.map((diet) => {
      return diet && diet?.isFreeComment
        ? {
            freeComment: diet.value,
            isFreeComment: true,
          }
        : {
            doc: diet.value,
            isFreeComment: false,
          }
    })

    const specialDietData =
      specialDiet && specialDiet?.isFreeComment
        ? {
            freeComment: specialDiet.value,
            isFreeComment: true,
          }
        : {
            doc: specialDiet.value,
            isFreeComment: false,
          }

    const data = {
      twitter: twitterUrl,
      facebook: facebookUrl,
      instagram: instagramUrl,
      culturalActivities: activities,
      interests: hobbies,
      mealPlan: diet.value,
      specialDiet: specialDietData,
      acceptableDiets,
    }

    FamiliesService.updatefamily(session?.token, family._id, data)
      .then(() => {
        setLoading(false)
        getFamily()
        showSuccess()
      })
      .catch((err) => {
        setLoading(false)
        showError()
      })
  }

const [selectedFamilyDiet, setSelectedFamilyDiet] = useState([])

useEffect(() => {
  const dietsFormated = []
  if(familyDiet.length > 0) {
    familyDiet.forEach((diet) => dietsFormated.push(diet.value))
    setSelectedFamilyDiet(dietsFormated)
  }
}, [dietsInput.length])

  const handleAcceptableDietsChange = (value) => {
    setSelectedFamilyDiet(value)
    if (value.length > 0) {
      let newDataDiet = []
      value.forEach(val => {
        let toPush = {
          ...dietsInput.filter(svc => svc.value === val)[0],
          isFreeComment: false,
        }
          newDataDiet.push(toPush)
          console.log(newDataDiet, 'new formatted data')
      })
      setFamilyDiet(newDataDiet)
    } else {
      setFamilyDiet([])
    }
  }

  const handleSpecialDietChange = (newValue, actionMetadata) => {
    const newOption =
      actionMetadata.action === 'create-option'
        ? { ...newValue, isFreeComment: true }
        : { ...newValue }
    setSpecialDiet(newOption)
  }

  return (
    <>
      <Toast ref={toast} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <FormHeader
          title='Description'
          onClick={handleSubmit}
          isLoading={loading}
        />
        <div className={classes.form_container_multiple}>
          <FormGroup title='Meal plan'>
            <div className={classes.input_container}>
              <label htmlFor='diet'>Diets / Special diet in the family</label>
              <CreatableSelect
                isClearable
                placeholder='Select a Diet'
                value={specialDiet}
                options={dietsInput}
                onChange={handleSpecialDietChange}
              />
            </div>
            <div className={classes.input_container}>
              <label htmlFor='diet'>What diet a family can accommodate?</label>
              <MultiSelect
                name='diet'
                value={selectedFamilyDiet}
                options={dietsInput}
                onChange={(e) => handleAcceptableDietsChange(e.value)}

                optionLabel='label'
                placeholder='Select an activity'
              />
            </div>
          </FormGroup>
          <FormGroup title='Social media'>
            <div className={classes.input_container}>
              <label htmlFor='facebook'>Facebook</label>
              <InputText
                name='facebook'
                value={facebookUrl}
                placeholder='Facebook URL'
                onChange={(e) => setFacebookUrl(e.target.value)}
              />
            </div>
            <div className={classes.input_container}>
              <label htmlFor='instagram'>Instagram</label>
              <InputText
                name='instagram'
                value={instagramUrl}
                placeholder='Instagram URL'
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
            </div>
            <div className={classes.input_container}>
              <label htmlFor='twitter'>twitter</label>
              <InputText
                name='twitter'
                value={twitterUrl}
                placeholder='Twitter URL'
                onChange={(e) => setTwitterUrl(e.target.value)}
              />
            </div>
          </FormGroup>
          <FormGroup title='Cultural activities'>
            <div className={classes.input_container}>
              <label htmlFor='activities'>Activities</label>
              <MultiSelect
                name='activities'
                value={activities}
                options={activitiesInput}
                onChange={(e) => setActivities(e.value)}
                selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
                optionLabel='name'
                placeholder='Select an activity'
              />
            </div>
          </FormGroup>
          <FormGroup title='Hobbies'>
            <div className={classes.input_container}>
              <label htmlFor='hobbies'>Hobbies</label>
              <MultiSelect
                name='hobbies'
                value={hobbies}
                options={hobbiesInput}
                onChange={(e) => setHobbies(e.value)}
                optionLabel='name'
                selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
                placeholder='Select a hobby'
              />
            </div>
          </FormGroup>
        </div>
      </form>
    </>
  )
}
