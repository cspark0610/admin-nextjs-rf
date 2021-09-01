import InputContainer from "components/UI/Molecules/InputContainer"
import { RegisterFamilyContext } from "context/RegisterFamilyContext"
import { InputText } from "primereact/inputtext"
import { useContext } from "react"

const User = () => {
  const { family: { user }, setUser } = useContext(RegisterFamilyContext)

  const handleChange = (field, value) => setUser({ ...user, [field]: value })

  return (
    <>
      <div className='row-dir'>
        <InputContainer label='First name'>
          <InputText
            name='name'
            placeholder='Your first name'
            value={user.name}
            onChange={({ target }) => handleChange('name', target.value)}
          />
        </InputContainer>
        <InputContainer label='last name'>
          <InputText
            name='lastName'
            placeholder='Your last name'
            value={user.lastName}
            onChange={({ target }) => handleChange('lastName', target.value)}
          />
        </InputContainer>
      </div>
      <div className='row-dir'>
        <InputContainer label='Email'>
          <InputText
            type='email'
            name='email'
            placeholder='Your email'
            value={user.email}
            onChange={({ target }) => handleChange('email', target.value)}
          />
        </InputContainer>
      </div>
      <div className='row-dir'>
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
            name='passwordconfirm'
            placeholder='Confirm your password'
            value={user.confirmPassword}
            onChange={({ target }) => handleChange('confirmPassword', target.value)}
          />
        </InputContainer>
      </div>
    </>
  )
}

export default User