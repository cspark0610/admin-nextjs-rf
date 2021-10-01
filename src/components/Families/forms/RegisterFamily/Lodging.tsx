import InputContainer from 'components/UI/Molecules/InputContainer'
import { RegisterFamilyContext } from 'context/RegisterFamilyContext'
import { useSession } from 'next-auth/client'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useContext, useEffect, useState } from 'react'
import GenericsService from 'services/Generics'

const Lodging = () => {
  const [session] = useSession()
  const {
    family: { home },
    setHome,
  } = useContext(RegisterFamilyContext)

  const [countries, setCountries] = useState([])
  const [provinces, setProvinces] = useState([])
  const [cities, setCities] = useState([])
  const [citiesByProvinces, setCitiesByProvinces] = useState([])
  const handleChange = (field, value) => setHome({ ...home, [field]: value })

  useEffect(() => {
    ;(async () => {
      const { countries, provinces, cities } = await GenericsService.getAll(
        session?.token,
        ['countries', 'provinces', 'cities']
      )

      setCountries(countries)
      setProvinces(provinces)
      setCities(cities)
    })()
  }, [session])

  useEffect(() => {
    let cbp = cities.filter((city) => city.province === home.province._id)
    setCitiesByProvinces(cbp)
  }, [home.province._id])

  return (
    <>
      <div className='two-columns'>
        <InputContainer label='Country'>
          <Dropdown
            options={countries}
            value={home.country}
            optionLabel='name'
            name='country'
            onChange={({ value }) => handleChange('country', value)}
            placeholder='Select type'
          />
        </InputContainer>
        <InputContainer label='Province'>
          <Dropdown
            options={provinces}
            value={home.province}
            optionLabel='name'
            name='province'
            onChange={({ value }) => handleChange('province', value)}
            placeholder='Select type'
          />
        </InputContainer>
        <InputContainer label='City'>
          <Dropdown
            options={citiesByProvinces}
            value={home.city}
            optionLabel='name'
            name='city'
            onChange={({ value }) => handleChange('city', value)}
            placeholder='Select type'
          />
        </InputContainer>
        <InputContainer label='Address'>
          <InputText
            name='address'
            placeholder='Address'
            value={home.address}
            onChange={({ target: { value } }) => handleChange('address', value)}
          />
        </InputContainer>
        <InputContainer label='Postal Code'>
          <InputText
            name='postalCode'
            placeholder='Postal Code'
            value={home.postalCode}
            onChange={({ target: { value } }) =>
              handleChange('postalCode', value)
            }
          />
        </InputContainer>
        <InputContainer label='Main intersection'>
          <InputText
            name='mainIntersection'
            placeholder='Main intersection'
            value={home.mainIntersection}
            onChange={({ target: { value } }) =>
              handleChange('mainIntersection', value)
            }
          />
        </InputContainer>
      </div>
    </>
  )
}

export default Lodging
