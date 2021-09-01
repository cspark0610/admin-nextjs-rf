import { useContext, useEffect, useState } from "react"
import InputContainer from "components/UI/Molecules/InputContainer"
import { useSession } from "next-auth/client"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { MultiSelect } from "primereact/multiselect"
import { RadioButton } from "primereact/radiobutton"
import { RegisterFamilyContext } from "context/RegisterFamilyContext"
import GenericsService from "services/Generics"

const PET_INITIAL_VALUES = {
  type: '',
  name: '',
  race: '',
  age: 0,
  remarks: '',
  isHipoalergenic: false
}

const Preferences = () => {
  const [session] = useSession()

  const {
    family: {
      interests,
      culturalActivities,
      rulesForStudents,
      welcomeStudentGenders,
      acceptableDiets,
      pets
    },
    setFamily,
    setPets
  } = useContext(RegisterFamilyContext)

  const [count, setCount] = useState(0)
  const [interestsData, setInterestsData] = useState([])
  const [culturalActivitiesData, setCulturalActivitiesData] = useState([])
  const [familyRules, setFamilyRules] = useState([])
  const [genders, setGenders] = useState([])
  const [diets, setDiets] = useState([])
  const [petTypes, setPetTypes] = useState([])

  const handleIncrement = () => {
    setCount(count + 1)
    let auxPets = [...pets]
    auxPets.push(PET_INITIAL_VALUES)
    setPets(auxPets)
  }

  const handleDecrement = () => {
    if (count - 1 >= 0) {
      setCount(count - 1)
      let auxPets = [...pets]
      setPets(auxPets.slice(0, count - 1))
    }
  }

  const handlePetChange = (index, field, value) => {
    let auxPets = [...pets]
    auxPets[index] = { ...auxPets[index], [field]: value }
    setPets(auxPets) 
  }

  useEffect(() => {
    ;(async () => {
      const { interests, culturalActivities, familyRules, genders, diets, petTypes } = await GenericsService.getAll(
        session?.token,
        ['interests', 'culturalActivities', 'familyRules', 'genders', 'diets', 'petTypes']
      )
      setInterestsData(interests)
      setCulturalActivitiesData(culturalActivities)
      setFamilyRules(familyRules)
      setGenders(genders)
      setDiets(diets)
      setPetTypes(petTypes)
    })()
  }, [session])

  return (
    <>
      <div> <h2>Activities</h2> </div>
      <div className='row-dir'>
        <InputContainer label='Activities Hobbies'>
          <MultiSelect
              options={interestsData}
              value={interests}
              optionLabel='name'
              name='interests'
              onChange={({ value }) => setFamily({ interests: value })}
              placeholder="Select gender"
          />
        </InputContainer>
        <InputContainer label='Cultural Activities'>
          <MultiSelect
              options={culturalActivitiesData}
              value={culturalActivities}
              optionLabel='name'
              name='culturalActivities'
              onChange={({ value }) => setFamily({ culturalActivities: value })}
              placeholder="Select cultural activities"
          />
        </InputContainer>
      </div>
      <div className='row-dir'>
        <InputContainer label='Family Rules'>
          <MultiSelect
              options={familyRules}
              value={rulesForStudents}
              optionLabel='name'
              name='rulesForStudents'
              onChange={({ value }) => setFamily({ rulesForStudents: value })}
              placeholder="Select cul"
          />
        </InputContainer>
        <InputContainer label='Our Family Welcomes'>
          <MultiSelect
              options={genders}
              value={welcomeStudentGenders}
              optionLabel='name'
              name='welcomeStudentGenders'
              onChange={({ value }) => setFamily({ welcomeStudentGenders: value })}
              placeholder="Select family rules"
          />
        </InputContainer>
      </div>
      <div className='row-dir'>
        <InputContainer label='Meal Plan'>
          {/* <MultiSelect
              options={genders}
              value={welcomeStudentGenders}
              optionLabel='name'
              name='welcomeStudentGenders'
              onChange={({ value }) => handleChange(index, 'welcomeStudentGenders', value)}
              placeholder="Select cul"
          /> */}
        </InputContainer>
        <InputContainer label="Diets">
          <MultiSelect
              options={diets}
              value={acceptableDiets}
              optionLabel='name'
              name='acceptableDiets'
              onChange={({ value }) => setFamily({ acceptableDiets: value })}
              placeholder="Select diets"
          />
        </InputContainer>
      </div>
      <div>
        <button type="button" onClick={handleDecrement}> - </button>
        <span>{ count }</span>
        <button type="button" onClick={handleIncrement}> + </button>
      </div>
      {
        pets.map((pet, index) => (
          <>
            <div className='row-dir'>
              <InputContainer label='Type'>
                <Dropdown
                    options={petTypes}
                    value={pet.type}
                    optionLabel='name'
                    name='type'
                    onChange={({ value }) => handlePetChange(index, 'type', value)}
                    placeholder="Select type"
                />
              </InputContainer>
              <InputContainer label='Name'>
                <InputText
                  name='name'
                  placeholder='name'
                  value={pet.name}
                  onChange={({ target: { value } }) => handlePetChange(index, 'name', value)}
                />
              </InputContainer>
            </div>
            <div className='row-dir'>
              <InputContainer label='Breed'>
                <InputText
                  name='breed'
                  placeholder='breed'
                  value={pet.race}
                  onChange={({ target: { value } }) => handlePetChange(index, 'race', value)}
                />
              </InputContainer>
              <InputContainer label='Age'>
                <InputText
                  name='age'
                  placeholder='age'
                  value={pet.age}
                  onChange={({ target: { value } }) => handlePetChange(index, 'age', value)}
                />
              </InputContainer>
              {
                pet.type?.name === 'Can' && (
                  <div>
                    <InputContainer label="Is Hipoalergenic">
                      <div className="radio_container">
                          <RadioButton
                              value="Yes"
                              name="isHipoalergenic"
                              onChange={({ target: { value } }) => handlePetChange(index, 'isHipoalergenic', value === 'Yes' ? true : false)}
                              checked={pet.isHipoalergenic} 
                          />
                          <label htmlFor="yes">Yes</label>
                      </div>
                      <div className="radio_container">
                          <RadioButton
                              value="No"
                              name="isHipoalergenic"
                              onChange={({ target: { value } }) => handlePetChange(index, 'isHipoalergenic', value === 'Yes' ? true : false)}
                              checked={pet.isHipoalergenic} 
                          />
                          <label htmlFor="no">No</label>
                      </div>
                      </InputContainer>
                  </div>
                )
              }
              <InputContainer label="Note">
                <InputText
                  name='remarks'
                  placeholder='remarks'
                  value={pet.remarks}
                  onChange={({ target: { value } }) => handlePetChange(index, 'remarks', value)}
                />
              </InputContainer>
            </div>
          </>
        ))
      }
    </>
  )
}

export default Preferences