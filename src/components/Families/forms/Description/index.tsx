import React, { useState } from "react";
//components
import FormGroup from "components/UI/Molecules/FormGroup";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
//styles
import classes from "styles/Families/Forms.module.scss";
export default function DescriptionForm() {
    
  //state ------------------------------------------
  //meal plans
  const [diet, setDiet] = useState([]);
  const [specialDiet, setSpecialDiet] = useState([]);
  const [familyDiet, setFamilyDiet] = useState([]);
  //social media
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  //activities
  const [activities, setActivities] = useState([])
  const [hobbies,setHobbies] = useState([])

  const diets = [{ name: "vegan" }, { name: "meet" }];
  return (
    <div className={classes.form_containe_multiple}>
      <FormGroup title="Meal plan">
        <div className={classes.input_container}>
          <label htmlFor="diet">Diet</label>
          <MultiSelect
            name="diet"
            value={diet}
            options={diets}
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
            options={diets}
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
            options={diets}
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
          <InputText name="facebook" value={facebookUrl} placeholder="Facebook URL"  onChange={(e) => setFacebookUrl(e.target.value)} />
        </div>
        <div className={classes.input_container}>
          <label htmlFor="instagram">Instagram</label>
          <InputText name="instagram" value={instagramUrl} placeholder="Instagram URL" onChange={(e) => setInstagramUrl(e.target.value)}/>
        </div>
        <div className={classes.input_container}>
          <label htmlFor="twitter">twitter</label>
          <InputText name="twitter" value={twitterUrl} placeholder="Twitter URL" onChange={(e) => setTwitterUrl(e.target.value)}/>
        </div>
      </FormGroup>
      <FormGroup title="Cultural activities">
        <div className={classes.input_container}>
          <label htmlFor="activities">Activities</label>
          <MultiSelect
            name="activities"
            value={activities}
            options={diets}
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
            options={diets}
            onChange={(e) => setHobbies(e.value)}
            optionLabel="name"
            placeholder="Select a hobby"
            display="chip"
          />
        </div>
      </FormGroup>
    </div>
  );
}
