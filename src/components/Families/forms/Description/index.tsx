import React, { useState, useEffect, useContext,useRef } from "react";
//components
import FormGroup from "components/UI/Molecules/FormGroup";
import {Toast} from 'primereact/toast'
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import FormHeader from 'components/UI/Molecules/FormHeader'
//styles
import classes from "styles/Families/Forms.module.scss";
//services
import GenericService from 'services/Generics'
import FamiliesService from 'services/Families'
//context 
import {FamilyContext} from 'context/FamilyContext'

export default function DescriptionForm() {
  const genericsService = new GenericService()
  const {family, setFamily} = useContext(FamilyContext)
  const familiesService = new FamiliesService()
  //state ------------------------------------------
  const [loading, setLoading] = useState(false)
  const toast = useRef(null)
  //meal plans
  const [diet, setDiet] = useState([]);
  const [specialDiet, setSpecialDiet] = useState([]);
  const [familyDiet, setFamilyDiet] = useState([]);
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
  
  useEffect(()=> {
    (async ()=>{
      const {culturalActivities, interests, diets} = await genericsService.getAll(['culturalActivities', 'interests', 'diets'])
      await setActivitiesInput(culturalActivities)
      await setHobbiesInput(interests)
      await setDietsInput(diets)
    })()
    return () => {}
  }, [])

  const showSuccess = () => {
    toast.current.show({severity:'success', summary: 'Success Message', detail:'Description successfully updated', life: 3000});
  }
  const showError = () => {
      toast.current.show({severity:'error', summary: 'Error Message', detail:'An error has ocurred', life: 3000});
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      twitter: twitterUrl,
      facebook: facebookUrl,
      instagram: instagramUrl,
      culturalActivities : activities,
      interests: hobbies
    }
    console.log(data)
    familiesService.updatefamily(family._id, data)
    .then(()=> {
      setLoading(false)
      setFamily({...family, data})
      showSuccess()
    })
    .catch(err => {
      setLoading(false)
      showError()
    })
  }
  return (
    <>
    <Toast ref={toast} />
    <form onSubmit={e => {handleSubmit(e)}}>
      <FormHeader title="Description" isLoading={loading}/>
      <div className={classes.form_container_multiple}>
        <FormGroup title="Meal plan">
          <div className={classes.input_container}>
            <label htmlFor="diet">Diet</label>
            <MultiSelect
              name="diet"
              value={diet}
              options={dietsInput}
              onChange={(e) => setDiet(e.value)}
              optionLabel="name"
              placeholder="Select a diet"
              display="chip"
            />
          </div>
          <div className={classes.input_container}>
            <label htmlFor="diet">Diets / Special diet in the family</label>
            <MultiSelect
              name="diet"
              value={specialDiet}
              options={dietsInput}
              onChange={(e) => setSpecialDiet(e.value)}
              optionLabel="name"
              placeholder="Select a diet"
              display="chip"
            />
          </div>
          <div className={classes.input_container}>
            <label htmlFor="diet">What diet a family can accommodate?</label>
            <MultiSelect
              name="diet"
              value={familyDiet}
              options={dietsInput}
              onChange={(e) => setFamilyDiet(e.value)}
              optionLabel="name"
              placeholder="Select a diet"
              display="chip"
            />
          </div>
        </FormGroup>
        <FormGroup title="Social media">
          <div className={classes.input_container}>
            <label htmlFor="facebook">Facebook</label>
            <InputText name="facebook" value={facebookUrl} placeholder="Facebook URL" onChange={(e) => setFacebookUrl(e.target.value)} />
          </div>
          <div className={classes.input_container}>
            <label htmlFor="instagram">Instagram</label>
            <InputText name="instagram" value={instagramUrl} placeholder="Instagram URL" onChange={(e) => setInstagramUrl(e.target.value)} />
          </div>
          <div className={classes.input_container}>
            <label htmlFor="twitter">twitter</label>
            <InputText name="twitter" value={twitterUrl} placeholder="Twitter URL" onChange={(e) => setTwitterUrl(e.target.value)} />
          </div>
        </FormGroup>
        <FormGroup title="Cultural activities">
          <div className={classes.input_container}>
            <label htmlFor="activities">Activities</label>
            <MultiSelect
              name="activities"
              value={activities}
              options={activitiesInput}
              onChange={(e) => setActivities(e.value)}
              optionLabel="name"
              placeholder="Select an activity"
              display="chip"
            />
          </div>
        </FormGroup>
        <FormGroup title="Hobbies">
          <div className={classes.input_container}>
            <label htmlFor="hobbies">Hobbies</label>
            <MultiSelect
              name="hobbies"
              value={hobbies}
              options={hobbiesInput}
              onChange={(e) => setHobbies(e.value)}
              optionLabel="name"
              placeholder="Select a hobby"
              display="chip"
            />
          </div>
        </FormGroup>
      </div>

    </form>
    </>
  );
}
