import { useState, useEffect, useContext } from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import InputContainer from 'components/UI/Molecules/InputContainer'
import FileUploader from 'components/UI/Atoms/FileUploader'
import { Checkbox } from 'primereact/checkbox'
import { InputMask } from 'primereact/inputmask'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { MultiSelect } from 'primereact/multiselect'
import GenericsService from 'services/Generics'
import FamiliesService from 'services/Families'
//styles
import classes from 'styles/Families/Forms.module.scss'
import { useSession } from 'next-auth/client'
//utils
import { adult } from 'utils/calendarRange'
import { FamilyContext } from 'context/FamilyContext'

export default function MainMemberForm({ member, submit, id, family }) {
  const { getFamily } = useContext(FamilyContext)
  const [gendersInput, setGendersInput] = useState([])
  const [occupationsInput, setOccupationsInput] = useState([])
  const [languagesInput, setLanguagesInput] = useState([])
  const [hostsRelationshipsInput, setHostsRelationshipsInput] = useState([])
  const [session] = useSession()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { genders, occupations, languages, hostsRelationships } =
        await GenericsService.getAll(session?.token, [
          'genders',
          'occupations',
          'languages',
          'hostsRelationships',
        ])
      await setGendersInput(genders)
      await setOccupationsInput(occupations)
      await setLanguagesInput(languages)
      await setHostsRelationshipsInput(hostsRelationships)

      return () => {}
    })()
  }, [session])

  const [birthDate, setBirthDate] = useState(new Date(member.birthDate))

  const [photo, setPhoto] = useState(
    member.photo || '/assets/img/user-avatar.svg'
  )

  const title = ['Primary', 'Secondary']

  const changePhoto = (event) => {
    setPhoto(URL.createObjectURL(event.target.files[0]))
    setLoading(true)
    const data = new FormData()

    family.mainMembers.map((memberItem, index) => {
      const dataToUpdate = {
        isCellPhoneVerified: memberItem.isCellPhoneVerified,
        isHomePhoneVerified: memberItem.isHomePhoneVerified,
        isWorkHomeVerified: memberItem.isWorkHomeVerified,
        mainLanguagesSpokenAtHome: memberItem.mainLanguagesSpokenAtHome,
        spokenLanguages: memberItem.spokenLanguages,
        relationshipWithThePrimaryHost:
          memberItem.relationshipWithThePrimaryHost
            ? memberItem.relationshipWithThePrimaryHost._id
            : null,
        _id: memberItem._id,
        email: memberItem.email,
        gender: memberItem.gender?._id,
        lastName: memberItem.lastName,
        firstName: memberItem.firstName,
        birthDate: memberItem.birthDate,
        occupation: memberItem.occupation?._id,
        cellPhoneNumber: memberItem.cellPhoneNumber,
        photo: memberItem.photo,
      }

      Object.entries(dataToUpdate).forEach((entries) => {
        if (
          entries[0] === 'mainLanguagesSpokenAtHome' ||
          entries[0] === 'spokenLanguages'
        ) {
          entries[1].forEach((item, index2) =>
            data.append(
              `mainMembers[${index}][${entries[0]}][${index2}]`,
              item._id
            )
          )
        } else if (
          entries[0] === 'relationshipWithThePrimaryHost' &&
          entries[1]
        ) {
          data.append(`mainMembers[${index}][${entries[0]}]`, entries[1])
        } else if (entries[0] !== 'relationshipWithThePrimaryHost') {
          data.append(`mainMembers[${index}][${entries[0]}]`, entries[1])
        }
      })
    })

    data.append(`mainMembers[${id}][photo]`, event.target.files[0])
    FamiliesService.updateFamilyFormData(session?.token, family._id, data)
      .then((response) => {
        submit(
          { target: { name: 'photo', value: response.mainMembers[id].photo } },
          id
        )
        setLoading(false)
        getFamily()
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  return (
    <FormGroup title={`${title[id]} Host`} customClass={classes.side_layout}>
      <div className={classes.photo_container}>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          <img
            src={photo}
            style={{ objectFit: 'cover' }}
            className={loading ? classes.profile_loading : ''}
          />
          {loading && (
            <ProgressSpinner
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          )}
        </div>

        <FileUploader
          id={`familyPictures-${id}`}
          name='familyPictures'
          accept='image/*'
          onChange={changePhoto}
          placeholder='Upload host photo'
        />
      </div>
      <div className={classes.form_container_multiple}>
        <InputContainer label='First Name'>
          <InputText
            name='firstName'
            placeholder='Firstname'
            value={member.firstName}
            onChange={(e) => submit(e, id)}
          />
        </InputContainer>

        <InputContainer label='Last Name'>
          <InputText
            name='lastName'
            placeholder='Lastname'
            value={member.lastName}
            onChange={(e) => submit(e, id)}
          />
        </InputContainer>

        <InputContainer label='Sex'>
          <Dropdown
            name='gender'
            value={member.gender}
            optionLabel='name'
            options={gendersInput}
            onChange={(e) => submit(e, id)}
            placeholder='Select gender'
          />
        </InputContainer>

        <InputContainer label='Occupation'>
          <Dropdown
            name='occupation'
            value={member.occupation}
            optionLabel='name'
            options={occupationsInput}
            filter
            filterBy='name'
            placeholder='Select occupation'
            onChange={(e) => submit(e, id)}
          />
        </InputContainer>

        <InputContainer label='Email'>
          <InputText
            name='email'
            placeholder='Email'
            type='email'
            value={member.email}
            onChange={(e) => submit(e, id)}
          />
        </InputContainer>

        <InputContainer label='Date of birth'>
          <Calendar
            name='birthDate'
            id='icon'
            showIcon
            monthNavigator
            yearNavigator={true}
            yearRange={adult}
            placeholder='Date of birth'
            value={birthDate}
            onChange={(e) => submit(e, id)}
          />
        </InputContainer>
        {id == 0 && (
          <InputContainer label='Main Languages Spoken at Home'>
            <MultiSelect
              name='mainLanguagesSpokenAtHome'
              value={member.mainLanguagesSpokenAtHome}
              onChange={(e) => {
                submit(e, id)
              }}
              options={languagesInput}
              optionLabel='name'
              placeholder='Select languages'
              selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
            />
          </InputContainer>
        )}
        <InputContainer label='What languages Do You Speak?'>
          <MultiSelect
            name='spokenLanguages'
            value={member.spokenLanguages}
            onChange={(e) => submit(e, id)}
            options={languagesInput}
            optionLabel='name'
            placeholder='Select languages'
            selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
          />
        </InputContainer>
        {id == 1 && (
          <InputContainer label='Relationship With The Primary Host'>
            <Dropdown
              options={hostsRelationshipsInput}
              optionLabel='name'
              name='relationshipWithThePrimaryHost'
              placeholder='Relationship'
              value={member.relationshipWithThePrimaryHost}
              onChange={(e) => {
                submit(e, id)
              }}
            />
          </InputContainer>
        )}
        <InputContainer label='Cell Phone'>
          <InputMask
            name='cellPhoneNumber'
            mask='+01 (999) 999-9999'
            placeholder='555-555-55'
            value={member.cellPhoneNumber}
            onChange={(e) => submit(e, id)}
          />
          <div style={{ marginTop: '1em' }}>
            <Checkbox
              name='isCellPhoneVerified'
              checked={member.isCellPhoneVerified}
              onChange={(e) => {
                submit(
                  { target: { value: e.checked, name: 'isCellPhoneVerified' } },
                  id
                )
              }}
            />
            <label
              htmlFor='isCellPhoneVerified'
              style={{ marginInline: '1em' }}
            >
              {member.isCellPhoneVerified ? 'Verified' : 'Not verified'}
            </label>
          </div>
        </InputContainer>

        <InputContainer label='Home Phone Number'>
          <InputMask
            name='homePhoneNumber'
            mask='+01 (999) 999-9999'
            placeholder='555-555-55'
            value={member.homePhoneNumber}
            onChange={(e) => submit(e, id)}
          />
          <div style={{ marginTop: '1em' }}>
            <Checkbox
              name='isHomePhoneVerified'
              checked={member.isHomePhoneVerified}
              onChange={(e) => {
                submit(
                  { target: { value: e.checked, name: 'isHomePhoneVerified' } },
                  id
                )
              }}
            />
            <label
              htmlFor='isHomePhoneVerified'
              style={{ marginInline: '1em' }}
            >
              {member.isHomePhoneVerified ? 'Verified' : 'Not verified'}
            </label>
          </div>
        </InputContainer>
        <InputContainer label='Work Phone Number'>
          <InputMask
            name='workPhoneNumber'
            mask='+01 (999) 999-9999'
            placeholder='555-555-55'
            value={member.workPhoneNumber}
            onChange={(e) => submit(e, id)}
          />
          <div style={{ marginTop: '1em' }}>
            <Checkbox
              name='isWorkPhoneVerified'
              checked={member.isWorkHomeVerified}
              onChange={(e) => {
                submit(
                  { target: { value: e.checked, name: 'isWorkHomeVerified' } },
                  id
                )
              }}
            />
            <label
              htmlFor='isWorkPhoneVerified'
              style={{ marginInline: '1em' }}
            >
              {member.isWorkHomeVerified ? 'Verified' : 'Not verified'}
            </label>
          </div>
        </InputContainer>
      </div>
    </FormGroup>
  )
}
