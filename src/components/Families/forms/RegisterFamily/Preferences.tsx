import { useContext, useEffect, useState } from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import FormGroup from 'components/UI/Molecules/FormGroup'
import { useSession } from 'next-auth/client'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { RadioButton } from 'primereact/radiobutton'
import { RegisterFamilyContext } from 'context/RegisterFamilyContext'
import GenericsService from 'services/Generics'

const PET_INITIAL_VALUES = {
  type: '',
  name: '',
  race: '',
  age: 0,
  remarks: '',
  isHipoalergenic: false,
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
      pets,
    },
    setFamily,
    setPets,
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
      const {
        interests,
        culturalActivities,
        familyRules,
        genders,
        diets,
        petTypes,
      } = await GenericsService.getAll(session?.token, [
        'interests',
        'culturalActivities',
        'familyRules',
        'genders',
        'diets',
        'petTypes',
      ])
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
      <FormGroup title='Activities'>
        <div className='two-columns'>
          <InputContainer label='Activities Hobbies'>
            <MultiSelect
              options={interestsData}
              value={interests}
              optionLabel='name'
              name='interests'
              onChange={({ value }) => setFamily({ interests: value })}
              placeholder='Select activities hobbies'
            />
          </InputContainer>
          <InputContainer label='Cultural Activities'>
            <MultiSelect
              options={culturalActivitiesData}
              value={culturalActivities}
              optionLabel='name'
              name='culturalActivities'
              onChange={({ value }) => setFamily({ culturalActivities: value })}
              placeholder='Select cultural activities'
            />
          </InputContainer>
          <InputContainer label='Family Rules'>
            <MultiSelect
              options={familyRules}
              value={rulesForStudents}
              optionLabel='name'
              name='rulesForStudents'
              onChange={({ value }) => setFamily({ rulesForStudents: value })}
              placeholder='Select rules'
            />
          </InputContainer>
          <InputContainer label='Our Family Welcomes'>
            <MultiSelect
              options={genders}
              value={welcomeStudentGenders}
              optionLabel='name'
              name='welcomeStudentGenders'
              onChange={({ value }) =>
                setFamily({ welcomeStudentGenders: value })
              }
              placeholder='Select genders'
            />
          </InputContainer>
          <InputContainer label='Diets'>
            <MultiSelect
              options={diets}
              value={acceptableDiets}
              optionLabel='name'
              name='acceptableDiets'
              onChange={({ value }) => setFamily({ acceptableDiets: value })}
              placeholder='Select diets'
            />
          </InputContainer>
        </div>
      </FormGroup>
      <div style={{ margin: '1rem 0' }}>
        <p>How many pets you have?</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type='button'
            icon='pi pi-minus-circle'
            className='p-button-rounded p-button-info p-button-text'
            onClick={handleDecrement}
          />
          <span style={{ margin: 'auto 0.5rem' }}>{count}</span>
          <Button
            type='button'
            icon='pi pi-plus-circle'
            className='p-button-rounded p-button-info p-button-text'
            onClick={handleIncrement}
          />
        </div>
      </div>
      {pets.map((pet, index) => (
        <>
          <FormGroup title={`Pet ${index + 1}`}>
            <div className='two-columns'>
              <InputContainer label='Type'>
                <Dropdown
                  options={petTypes}
                  value={pet.type}
                  optionLabel='name'
                  name='type'
                  onChange={({ value }) =>
                    handlePetChange(index, 'type', value)
                  }
                  placeholder='Select type'
                />
              </InputContainer>
              <InputContainer label='Name'>
                <InputText
                  name='name'
                  placeholder='Name'
                  value={pet.name}
                  onChange={({ target: { value } }) =>
                    handlePetChange(index, 'name', value)
                  }
                />
              </InputContainer>
              <InputContainer label='Breed'>
                <InputText
                  name='breed'
                  placeholder='Breed'
                  value={pet.race}
                  onChange={({ target: { value } }) =>
                    handlePetChange(index, 'race', value)
                  }
                />
              </InputContainer>
              <InputContainer label='Age'>
                <InputText
                  name='age'
                  placeholder='age'
                  value={pet.age}
                  onChange={({ target: { value } }) =>
                    handlePetChange(index, 'age', value)
                  }
                />
              </InputContainer>
              {pet.type?.name === 'Can' && (
                <div>
                  <InputContainer label='Is Hipoalergenic'>
                    <div className='radio_container'>
                      <RadioButton
                        value='Yes'
                        name='isHipoalergenic'
                        onChange={({ target: { value } }) =>
                          handlePetChange(index, 'isHipoalergenic', true)
                        }
                        checked={pet.isHipoalergenic === true}
                      />
                      <label htmlFor='yes'>Yes</label>
                    </div>
                    <div className='radio_container'>
                      <RadioButton
                        value='No'
                        name='isHipoalergenic'
                        onChange={({ target: { value } }) =>
                          handlePetChange(index, 'isHipoalergenic', false)
                        }
                        checked={pet.isHipoalergenic === false}
                      />
                      <label htmlFor='no'>No</label>
                    </div>
                  </InputContainer>
                </div>
              )}
              <InputContainer label='Note'>
                <InputText
                  name='remarks'
                  placeholder='Remarks'
                  value={pet.remarks}
                  onChange={({ target: { value } }) =>
                    handlePetChange(index, 'remarks', value)
                  }
                />
              </InputContainer>
            </div>
          </FormGroup>
        </>
      ))}
    </>
  )
}

export default Preferences
