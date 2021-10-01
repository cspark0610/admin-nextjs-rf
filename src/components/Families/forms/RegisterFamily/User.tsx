import InputContainer from "components/UI/Molecules/InputContainer"
import { RegisterFamilyContext } from "context/RegisterFamilyContext"
import { InputText } from "primereact/inputtext"
import { useContext } from "react"

const User = () => {
  const { family: { user }, setUser } = useContext(RegisterFamilyContext)

  const handleChange = (field, value) => setUser({ ...user, [field]: value })

  return (
    <>
      <div className='two-columns'>
        <InputContainer label='First name'>
          <InputText
            name='first_name'
            placeholder='Your first name'
            value={user.first_name}
            onChange={({ target }) => handleChange('first_name', target.value)}
          />
        </InputContainer>
        <InputContainer label='last name'>
          <InputText
            name='last_name'
            placeholder='Your last name'
            value={user.last_name}
            onChange={({ target }) => handleChange('last_name', target.value)}
          />
        </InputContainer>
        <InputContainer label='Email'>
          <InputText
            type='email'
            name='email'
            placeholder='Your email'
            value={user.email}
            onChange={({ target }) => handleChange('email', target.value)}
          />
        </InputContainer>
        <InputContainer label='Password'>
          <InputText
            type='password'
            name='password'
            placeholder='Your password'
            value={user.password}
            onChange={({ target }) => handleChange('password', target.value)}
          />
        </InputContainer>
        <InputContainer label='Confirm Password'>
          <InputText
            type='password'
            name='confirmPass'
            placeholder='Confirm your password'
            value={user.confirmPass}
            onChange={({ target }) => handleChange('confirmPass', target.value)}
          />
        </InputContainer>
      </div>
    </>
  )
}

export default User