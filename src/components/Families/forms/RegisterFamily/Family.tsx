import InputContainer from 'components/UI/Molecules/InputContainer'
import FormGroup from 'components/UI/Molecules/FormGroup'
import { RegisterFamilyContext } from 'context/RegisterFamilyContext'
import { Button } from 'primereact/button'
import { useSession } from 'next-auth/client'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { RadioButton } from 'primereact/radiobutton'
import { useContext, useEffect, useState } from 'react'
import GenericsService from 'services/Generics'

const INITIAL_VALUES = {
  firstName: '',
  lastName: '',
  gender: '',
  familyRelationship: '',
  birthDate: '',
  spokenLanguages: '',
  situation: '',
}

const Family = () => {
  const [session] = useSession()
  const {
    family: { familyMembers, tenants, haveExternalStudents },
    setFamilyMembers,
    setFamily,
  } = useContext(RegisterFamilyContext)

  const [count, setCount] = useState(0)
  const [genders, setGenders] = useState([])
  const [languages, setLanguages] = useState([])
  const [relationships, setRelationships] = useState([])

  const handleIncrement = () => {
    setCount(count + 1)
    let auxMembers = [...familyMembers]
    auxMembers.push(INITIAL_VALUES)
    setFamilyMembers(auxMembers)
  }

  const handleDecrement = () => {
    if (count - 1 >= 0) {
      setCount(count - 1)
      let auxMembers = [...familyMembers]
      setFamilyMembers(auxMembers.slice(0, count - 1))
    }
  }

  const handleChange = (index, field, value) => {
    let auxMembers = [...familyMembers]
    auxMembers[index] = {
      ...auxMembers[index],
      [field]: value,
    }
    setFamilyMembers(auxMembers)
  }

  useEffect(() => {
    ;(async () => {
      const { genders, languages, familyRelationships } =
        await GenericsService.getAll(session?.token, [
          'genders',
          'languages',
          'familyRelationships',
        ])
      setGenders(genders)
      setLanguages(languages)
      setRelationships(familyRelationships)
    })()
  }, [session])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ margin: '1rem 0' }}>
          <p>Family members</p>
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
        <div style={{ margin: '1rem 0' }}>
          <div>
            <h2>Tenants</h2>
          </div>
          <div>
            <InputContainer label='Have Tenants?'>
              <div className='radio_container'>
                <RadioButton
                  value='Yes'
                  name='tenants'
                  onChange={() => setFamily({ tenants: true })}
                  checked={tenants === true}
                />
                <label htmlFor='yes'>Yes</label>
              </div>
              <div className='radio_container'>
                <RadioButton
                  value='No'
                  name='tenants'
                  onChange={() => setFamily({ tenants: false })}
                  checked={tenants === false}
                />
                <label htmlFor='no'>No</label>
              </div>
            </InputContainer>
          </div>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <div>
            <h2>External students</h2>
          </div>
          <div>
            <InputContainer label='Have external students?'>
              <div className='radio_container'>
                <RadioButton
                  value='true'
                  name='haveExternalStudents'
                  onChange={() => setFamily({ haveExternalStudents: true })}
                  checked={haveExternalStudents === true}
                />
                <label htmlFor='yes'>Yes</label>
              </div>
              <div className='radio_container'>
                <RadioButton
                  value='false'
                  name='haveExternalStudents'
                  onChange={() => setFamily({ haveExternalStudents: false })}
                  checked={haveExternalStudents === false}
                />
                <label htmlFor='no'>No</label>
              </div>
            </InputContainer>
          </div>
        </div>
      </div>
      {familyMembers.map((member, index) => (
        <>
          <FormGroup title={`Member ${index + 1}`}>
            <div className='two-columns'>
              <InputContainer label='First name'>
                <InputText
                  name='firstName'
                  placeholder='Your first name'
                  value={member.firstName}
                  onChange={({ target: { value } }) =>
                    handleChange(index, 'firstName', value)
                  }
                />
              </InputContainer>
              <InputContainer label='last name'>
                <InputText
                  name='lastName'
                  placeholder='Your last name'
                  value={member.lastName}
                  onChange={({ target: { value } }) =>
                    handleChange(index, 'lastName', value)
                  }
                />
              </InputContainer>
              <InputContainer label='Sex'>
                <Dropdown
                  options={genders}
                  value={member.gender}
                  optionLabel='name'
                  name='gender'
                  onChange={({ value }) => handleChange(index, 'gender', value)}
                  placeholder='Select gender'
                />
              </InputContainer>
              <InputContainer label='Relationship with primary host'>
                <Dropdown
                  options={relationships}
                  value={member.familyRelationship}
                  optionLabel='name'
                  name='familyRelationship'
                  onChange={({ value }) =>
                    handleChange(index, 'familyRelationship', value)
                  }
                  placeholder='Select relationship'
                />
              </InputContainer>
              <InputContainer label='Date of birth'>
                <Calendar
                  showButtonBar
                  showIcon
                  yearNavigator
                  placeholder='Date of birth'
                  value={new Date(member.birthDate)}
                  onChange={({ value }) =>
                    handleChange(index, 'birthDate', value)
                  }
                  yearRange={`${
                    new Date().getFullYear() - 100
                  }:${new Date().getFullYear()}`}
                />
              </InputContainer>
              <InputContainer label='What language(s) do you speak'>
                <MultiSelect
                  value={member.spokenLanguages}
                  options={languages}
                  placeholder='Spoken languages'
                  optionLabel='name'
                  onChange={({ value }) =>
                    handleChange(index, 'spokenLanguages', value)
                  }
                  selectedItemTemplate={(item) =>
                    item ? `${item?.name}, ` : ''
                  }
                />
              </InputContainer>
            </div>
            <div>
              <InputContainer label='Live in the house'>
                <div className='radio_container'>
                  <RadioButton
                    value='Yes'
                    name='situation'
                    onChange={({ target: { value } }) =>
                      handleChange(index, 'situation', value)
                    }
                    checked={member.situation === 'Yes'}
                  />
                  <label htmlFor='yes'>Yes</label>
                </div>
                <div className='radio_container'>
                  <RadioButton
                    value='No'
                    name='situation'
                    onChange={({ target: { value } }) =>
                      handleChange(index, 'situation', value)
                    }
                    checked={member.situation === 'No'}
                  />
                  <label htmlFor='no'>No</label>
                </div>
                <div className='radio_container'>
                  <RadioButton
                    value='Part-Time'
                    name='situation'
                    onChange={({ target: { value } }) =>
                      handleChange(index, 'situation', value)
                    }
                    checked={member.situation === 'Part-Time'}
                  />
                  <label htmlFor='no'> Part Time</label>
                </div>
                <div className='radio_container'>
                  <RadioButton
                    value='Other'
                    name='situation'
                    onChange={({ target: { value } }) =>
                      handleChange(index, 'situation', value)
                    }
                    checked={member.situation === 'Other'}
                  />
                  <label htmlFor='no'>Other</label>
                </div>
              </InputContainer>
            </div>
          </FormGroup>
        </>
      ))}
    </>
  )
}

export default Family
