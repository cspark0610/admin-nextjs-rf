import { useContext, useEffect, useState } from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import FormGroup from 'components/UI/Molecules/FormGroup'
import { RegisterFamilyContext } from 'context/RegisterFamilyContext'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'

import GenericsService from 'services/Generics'
import { useSession } from 'next-auth/client'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { Calendar } from 'primereact/calendar'

const INITIAL_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  occupation: '',
  gender: '',
  birthDate: '',
  mainLanguagesSpokenAtHome: '',
  spokenLanguages: '',
  cellPhoneNumber: '',
  homePhoneNumber: '',
  workPhoneNumber: '',
  relationshipWithThePrimaryHost: null,
}

const Anfitrion = () => {
  const [session] = useSession()
  const {
    family: { mainMembers },
    setMainMembers,
  } = useContext(RegisterFamilyContext)

  const [hasSecondHost, setHasSecondHost] = useState(false)
  const [occupations, setOccupations] = useState([])
  const [genders, setGenders] = useState([])
  const [languages, setLanguages] = useState([])
  const [relationships, setRelationships] = useState([])
  const [primary, setPrimary] = useState(INITIAL_DATA)
  const [secondary, setSecondary] = useState(INITIAL_DATA)

  const handleChange = (index, field, value) => {
    if (index === 0) {
      setPrimary({ ...primary, [field]: value })
    } else {
      setSecondary({ ...secondary, [field]: value })
    }

    let auxMembers = [...mainMembers]

    auxMembers[index] =
      index === 0
        ? { ...primary, [field]: value }
        : { ...secondary, [field]: value }

    setMainMembers(auxMembers)
  }

  useEffect(() => {
    ;(async () => {
      const { occupations, genders, languages, familyRelationships } =
        await GenericsService.getAll(session?.token, [
          'occupations',
          'genders',
          'languages',
          'familyRelationships',
        ])

      setOccupations(occupations)
      setGenders(genders)
      setLanguages(languages)
      setRelationships(familyRelationships)
    })()
    mainMembers.length === 0 && setMainMembers([primary])
  }, [session])

  useEffect(() => {
    if (!hasSecondHost) {
      setSecondary(INITIAL_DATA)
      if (mainMembers.length > 1) {
        const deleted = [...mainMembers]
        deleted.pop()
        setMainMembers(deleted)
      }
    } else {
      setMainMembers([...mainMembers, INITIAL_DATA])
    }
  }, [hasSecondHost])

  return (
    <>
      <FormGroup title='Primary Host'>
        <div className='two-columns'>
          <InputContainer label='First name'>
            <InputText
              name='firstName'
              placeholder='Your first name'
              value={primary.firstName}
              onChange={({ target: { value } }) =>
                handleChange(0, 'firstName', value)
              }
            />
          </InputContainer>
          <InputContainer label='last name'>
            <InputText
              name='lastName'
              placeholder='Your last name'
              value={primary.lastName}
              onChange={({ target: { value } }) =>
                handleChange(0, 'lastName', value)
              }
            />
          </InputContainer>
          <InputContainer label='Email'>
            <InputText
              type='email'
              name='email'
              placeholder='Your email'
              value={primary.email}
              onChange={({ target: { value } }) =>
                handleChange(0, 'email', value)
              }
            />
          </InputContainer>
          <InputContainer label='Occupation'>
            <Dropdown
              options={occupations}
              value={primary.occupation}
              optionLabel='name'
              name='occupation'
              onChange={({ value }) => handleChange(0, 'occupation', value)}
              placeholder='Select occupation'
            />
          </InputContainer>
          <InputContainer label='Sex'>
            <Dropdown
              options={genders}
              value={primary.gender}
              optionLabel='name'
              name='gender'
              onChange={({ value }) => handleChange(0, 'gender', value)}
              placeholder='Select gender'
            />
          </InputContainer>
          <InputContainer label='Date of birth'>
            <Calendar
              placeholder='Date of birth'
              value={new Date(primary.birthDate)}
              onChange={({ value }) => handleChange(0, 'birthDate', value)}
              showButtonBar
              showIcon
            />
          </InputContainer>
          <InputContainer label='Main Language(s) spoken at home'>
            <MultiSelect
              value={primary.mainLanguagesSpokenAtHome}
              placeholder='Languages at home'
              options={languages}
              optionLabel='name'
              onChange={({ value }) =>
                handleChange(0, 'mainLanguagesSpokenAtHome', value)
              }
              selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
            />
          </InputContainer>
          <InputContainer label='What language(s) do you speak'>
            <MultiSelect
              value={primary.spokenLanguages}
              placeholder='Spoken languages'
              options={languages}
              optionLabel='name'
              onChange={({ value }) =>
                handleChange(0, 'spokenLanguages', value)
              }
              selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
            />
          </InputContainer>
          <InputContainer label='Cell Phone number'>
            <InputText
              type='tel'
              name='phone'
              placeholder='Your phone number'
              value={primary.cellPhoneNumber}
              onChange={({ target: { value } }) =>
                handleChange(0, 'cellPhoneNumber', value)
              }
            />
          </InputContainer>
          <InputContainer label='Home phone number'>
            <InputText
              type='tel'
              name='homephone'
              placeholder='Your home phone'
              value={primary.homePhoneNumber}
              onChange={({ target: { value } }) =>
                handleChange(0, 'homePhoneNumber', value)
              }
            />
          </InputContainer>
          <InputContainer
            label='Would you like to add a second host'
            style={{ flexDirection: 'row' }}
          >
            <Checkbox
              onChange={(e) => setHasSecondHost(e.checked)}
              checked={hasSecondHost}
              style={{ marginLeft: '16px' }}
            ></Checkbox>
          </InputContainer>
        </div>
      </FormGroup>
      {hasSecondHost && (
        <div>
          <FormGroup title='Secondary Host'>
            <div className='two-columns'>
              <InputContainer label='First name'>
                <InputText
                  name='firstName'
                  placeholder='Your first name'
                  value={secondary.firstName}
                  onChange={({ target: { value } }) =>
                    handleChange(1, 'firstName', value)
                  }
                />
              </InputContainer>
              <InputContainer label='last name'>
                <InputText
                  name='lastName'
                  placeholder='Your last name'
                  value={secondary.lastName}
                  onChange={({ target: { value } }) =>
                    handleChange(1, 'lastName', value)
                  }
                />
              </InputContainer>
              <InputContainer label='Email'>
                <InputText
                  type='email'
                  name='email'
                  placeholder='Your email'
                  value={secondary.email}
                  onChange={({ target: { value } }) =>
                    handleChange(1, 'email', value)
                  }
                />
              </InputContainer>
              <InputContainer label='Date of birth'>
                <Calendar
                  placeholder='Date of birth'
                  value={new Date(secondary.birthDate)}
                  onChange={({ value }) => handleChange(0, 'birthDate', value)}
                  showButtonBar
                  showIcon
                />
              </InputContainer>
              <InputContainer label='Occupation'>
                <Dropdown
                  options={occupations}
                  value={secondary.occupation}
                  optionLabel='name'
                  name='occupation'
                  onChange={({ value }) => handleChange(1, 'occupation', value)}
                  placeholder='Select occupation'
                />
              </InputContainer>
              <InputContainer label='Sex'>
                <Dropdown
                  options={genders}
                  value={secondary.gender}
                  optionLabel='name'
                  name='gender'
                  onChange={({ value }) => handleChange(1, 'gender', value)}
                  placeholder='Select gender'
                />
              </InputContainer>
              <InputContainer label='Main Language(s) spoken at home'>
                <MultiSelect
                  value={secondary.mainLanguagesSpokenAtHome}
                  placeholder='Languages at home'
                  options={languages}
                  optionLabel='name'
                  onChange={({ value }) =>
                    handleChange(1, 'mainLanguagesSpokenAtHome', value)
                  }
                  selectedItemTemplate={(item) =>
                    item ? `${item?.name}, ` : ''
                  }
                />
              </InputContainer>
              <InputContainer label='What language(s) do you speak'>
                <MultiSelect
                  value={secondary.spokenLanguages}
                  placeholder='Spoken languages'
                  options={languages}
                  optionLabel='name'
                  onChange={({ value }) =>
                    handleChange(1, 'spokenLanguages', value)
                  }
                  selectedItemTemplate={(item) =>
                    item ? `${item?.name}, ` : ''
                  }
                />
              </InputContainer>
              <InputContainer label='Cell Phone number'>
                <InputText
                  type='tel'
                  name='phone'
                  placeholder='Your phone number'
                  value={secondary.cellPhoneNumber}
                  onChange={({ target: { value } }) =>
                    handleChange(1, 'cellPhoneNumber', value)
                  }
                />
              </InputContainer>
              <InputContainer label='Home phone number'>
                <InputText
                  type='tel'
                  name='homephone'
                  placeholder='Your home phone'
                  value={secondary.homePhoneNumber}
                  onChange={({ target: { value } }) =>
                    handleChange(1, 'homePhoneNumber', value)
                  }
                />
              </InputContainer>
              <InputContainer label='Relationship with primary host'>
                <Dropdown
                  options={relationships}
                  value={secondary.relationshipWithThePrimaryHost}
                  optionLabel='name'
                  name='relationshipWithThePrimaryHost'
                  onChange={({ value }) =>
                    handleChange(1, 'relationshipWithThePrimaryHost', value)
                  }
                  placeholder='Select relationship'
                />
              </InputContainer>
            </div>
          </FormGroup>
        </div>
      )}
    </>
  )
}

export default Anfitrion
