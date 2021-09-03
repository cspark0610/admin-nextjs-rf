import { useContext, useEffect, useState } from "react"
import { RegisterFamilyContext } from "context/RegisterFamilyContext"
import { useSession } from "next-auth/client"
import { Button } from 'primereact/button'
import GenericsService from "services/Generics"
import InputContainer from "components/UI/Molecules/InputContainer"
import { Dropdown } from "primereact/dropdown"
import { MultiSelect } from "primereact/multiselect"
import { AvailabilityPicker } from "components/UI/Atoms/AvailabilityPicker"
import CreatableSelect from 'react-select/creatable'

const STUDENT_ROOM_INITIAL_VALUES = {
  aditionalFeatures: [],
  availability: [],
  bathType: '',
  bathroomLocation: '',
  bedType: '',
  floor: '',
  type: '',
}

const Home = () => {
  const [session] = useSession()

  const { family: { home }, setHome, setStudentRooms } = useContext(RegisterFamilyContext)

  const [count, setCount] = useState(0)
  const [homeTypes, setHomeTypes] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [features, setFeatures] = useState([])
  const [nearbyServices, setNearbyServices] = useState([])

  const handleChange = (field, value) => setHome({ ...home, [field]: value }) 

  const handleIncrement = () => {
    setCount(count + 1)
    let auxStudentRooms = [...home.studentRooms]
    auxStudentRooms.push(STUDENT_ROOM_INITIAL_VALUES)
    setStudentRooms(auxStudentRooms)
  }

  const handleDecrement = () => {
    if (count - 1 >= 0) {
      setCount(count - 1)
      let auxStudentRooms = [...home.studentRooms]
      setStudentRooms(auxStudentRooms.slice(0, count - 1))
    }
  }

  const handleRoomChange = (index, field, value) => {
    let auxStudentRooms = [...home.studentRooms]
    auxStudentRooms[index] = { ...auxStudentRooms[index], [field]: value }
    setStudentRooms(auxStudentRooms)
  }

  const handleChangeNearbyServices = (_, actionMetadata) => {
    if(actionMetadata.action === "remove-value"){
      setHome({ nearbyServices: home.nearbyServices.filter(item => item.value !== actionMetadata.removedValue.value) })
    } else if(actionMetadata.action === 'clear') {
      setHome({ nearbyServices: [] })
    } else {
      const newOption = actionMetadata.action === "create-option"
        ? { ...actionMetadata.option, isFreeComment: true }
        : { ...actionMetadata.option }

      setHome({
        nearbyServices: [
          ...home.nearbyServices,
          newOption.isFreeComment 
            ? { isFreeComment: true, freeComment: newOption.value }
            : { isFreeComment: false, doc: newOption.value }
        ]
      })
    }
  };

  const handleChangeServices = (_, actionMetadata) => {
    if(actionMetadata.action === "remove-value"){
      setHome({ services: home.services.filter(item => item.value !== actionMetadata.removedValue.value) })
    } else if(actionMetadata.action === 'clear') {
      setHome({ services: [] })
    } else {
      const newOption = actionMetadata.action === "create-option"
        ? { ...actionMetadata.option, isFreeComment: true }
        : { ...actionMetadata.option }

      setHome({
        services: [
          ...home.services,
          newOption.isFreeComment 
            ? { isFreeComment: true, freeComment: newOption.value }
            : { isFreeComment: false, doc: newOption.value }
        ]
      })
    }
  };


  useEffect(() => {
    ;(async () => {
      const { homeTypes, roomTypes, additionalRoomFeatures, nearbyServices } = await GenericsService.getAll(
        session?.token,
        ['homeTypes', 'roomTypes', 'additionalRoomFeatures', 'nearbyServices']
      )

      setHomeTypes(homeTypes)
      setRoomTypes(roomTypes)

      setFeatures(
        additionalRoomFeatures.map((feature) => ({
          value: {
            ...feature,
          },
          label: feature.name,
          isFreeComment: false,
        }))
      )

      setNearbyServices(
        nearbyServices.map((nearbyService) => ({
          value: {
            ...nearbyService,
          },
          label: nearbyService.name,
          isFreeComment: false,
        }))
      )
    })()
  }, [session])

  return (
    <>
      <div className='two-columns'>
        <InputContainer label='House Type'>
          <Dropdown
              options={homeTypes}
              value={home.homeType}
              optionLabel='name'
              name='homeType'
              onChange={({ value }) => handleChange('homeType', value)}
              placeholder="Select type"
          />
        </InputContainer>
        <InputContainer label='Inside'>
          <MultiSelect
            name="houseRooms"
            value={home.houseRooms}
            options={roomTypes}
            onChange={({ value }) => handleChange('houseRooms', value)}
            optionLabel="name"
            selectedItemTemplate={item => item ? `${item?.name}, ` : ''}
            placeholder="Select rooms"
          />
        </InputContainer>
        <InputContainer label='Household Amenities'>
          <CreatableSelect
            isMulti
            placeholder='Select Diets'
            value={
              home.services.map(item => {
                return item.isFreeComment
                  ? {
                    isFreeComment: true,
                    label: item.freeComment,
                    value: item.freeComment
                  }
                  : {
                    isFreeComment: false,
                    label: item.doc.name,
                    value: item.doc
                  }
              })
            }
            options={features}
            onChange={handleChangeServices}
          />
        </InputContainer>
        <InputContainer label='Nearby Services'>
          <CreatableSelect
            isMulti
            placeholder='Select Diets'
            value={
              home.nearbyServices.map(item => {
                return item.isFreeComment
                  ? {
                    isFreeComment: true,
                    label: item.freeComment,
                    value: item.freeComment
                  }
                  : {
                    isFreeComment: false,
                    label: item.doc.name,
                    value: item.doc
                  }
              })
            }
            options={nearbyServices}
            onChange={handleChangeNearbyServices}
          />
        </InputContainer>
      </div>
      <div style={{margin: '1rem 0'}}>
        <p>How many rooms you have?</p>
        <div style={{display:'flex', alignItems:'center'}}>
          <Button type="button" icon="pi pi-minus-circle" className="p-button-rounded p-button-info p-button-text" onClick={handleDecrement}/> 
          <span style={{margin:'auto 0.5rem'}}>{ count }</span>
          <Button type="button" icon="pi pi-plus-circle" className="p-button-rounded p-button-info p-button-text" onClick={handleIncrement}/> 
        </div>
      </div>
      {
        home.studentRooms.map((room, index) => (
          <>
            <div className='two-columns'>
              <InputContainer label='Type'>
                <Dropdown
                  options={roomTypes}
                  value={room.type}
                  optionLabel='name'
                  name='homeType'
                  onChange={({ value }) => handleRoomChange(index, 'type', value)}
                  placeholder="Select type"
                />
              </InputContainer>
              <InputContainer label='Bath Type'>
                <Dropdown
                  options={roomTypes}
                  value={room.bathType}
                  optionLabel='name'
                  name='bathType'
                  onChange={({ value }) => handleRoomChange(index, 'bathType', value)}
                  placeholder="Select Bath type"
                />
              </InputContainer>
              <InputContainer label='Bed Type'>
                <Dropdown
                  options={["Single", "Double/Full", "Queen", "King","Twin/Single"]}
                  value={room.bedType}
                  name='bedType'
                  onChange={({ value }) => handleRoomChange(index, 'bedType', value)}
                  placeholder="Select Bed type"
                />
              </InputContainer>
              <InputContainer label='Floor'>
                <Dropdown
                  options={["Upper Level", "Main Level", "Lower Level"]}
                  value={room.bathroomLocation}
                  name='bathType'
                  onChange={({ value }) => handleRoomChange(index, 'bathroomLocation', value)}
                  placeholder="Select Floor"
                />
              </InputContainer>
            </div>
              <InputContainer label='Availabiliy'>
                <AvailabilityPicker
                  dates={room.availability}
                  setDates={({ target: { value } }) => handleRoomChange(index, 'availability', value)}
                />
              </InputContainer>
          </>
        ))
      }
    </>
  )
}

export default Home