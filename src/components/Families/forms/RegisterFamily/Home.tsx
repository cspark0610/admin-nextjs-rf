import { useContext, useEffect, useState } from "react";
import { RegisterFamilyContext } from "context/RegisterFamilyContext";
import { useSession } from "next-auth/client";
import { Button } from "primereact/button";
import GenericsService from "services/Generics";
import InputContainer from "components/UI/Molecules/InputContainer";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { AvailabilityPicker } from "components/UI/Atoms/AvailabilityPicker";
import CreatableSelect from "react-select/creatable";

const STUDENT_ROOM_INITIAL_VALUES = {
  aditionalFeatures: [],
  availability: [],
  bathType: "",
  bathroomLocation: "",
  bedType: "",
  floor: "",
  type: "",
  roomNumber: 0,
};

const Home = () => {
  const [session] = useSession();

  const {
    family: { home },
    setHome,
    setStudentRooms,
  } = useContext(RegisterFamilyContext);

  const [count, setCount] = useState(0);
  const [homeTypes, setHomeTypes] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [additionalRoomFeatures, setAdditionalRoomFeatures] = useState([]);
  const [nearbyServices, setNearbyServices] = useState([]);

  const handleChange = (field, value) => setHome({ ...home, [field]: value });

  const handleIncrement = () => {
    setCount(count + 1);
    let auxStudentRooms = [...home.studentRooms];
    auxStudentRooms.push(STUDENT_ROOM_INITIAL_VALUES);
    setStudentRooms(auxStudentRooms);
  };

  const handleDecrement = () => {
    if (count - 1 >= 0) {
      setCount(count - 1);
      let auxStudentRooms = [...home.studentRooms];
      setStudentRooms(auxStudentRooms.slice(0, count - 1));
    }
  };

  const handleRoomChange = (index, field, value) => {
    let auxStudentRooms = [...home.studentRooms];
    if (auxStudentRooms[index]?.roomNumber) {
      auxStudentRooms[index] = { ...auxStudentRooms[index], [field]: value };
    } else {
      auxStudentRooms[index] = {
        ...auxStudentRooms[index],
        roomNumber: index === 0 ? 1 : 2,
        [field]: value,
      };
    }
    setStudentRooms(auxStudentRooms);
  };

  useEffect(() => {
    (async () => {
      const {
        homeTypes,
        roomTypes,
        services,
        additionalRoomFeatures,
        nearbyServices,
      } = await GenericsService.getAll(session?.token, [
        "homeTypes",
        "roomTypes",
        "nearbyServices",
        "additionalRoomFeatures",
        "services",
      ]);

      setHomeTypes(homeTypes);
      setRoomTypes(roomTypes);

      setAdditionalRoomFeatures(
        additionalRoomFeatures.map((service) => ({
          value: {
            ...service,
          },
          label: service.name,
          isFreeComment: false,
        }))
      );

      setServices(
        services.map((service) => ({
          value: {
            ...service,
          },
          label: service.name,
          isFreeComment: false,
        }))
      );

      setNearbyServices(
        nearbyServices.map((nearbyService) => ({
          value: {
            ...nearbyService,
          },
          label: nearbyService.name,
          isFreeComment: false,
        }))
      );
    })();
  }, [session]);

  return (
    <>
      <div className='two-columns'>
        <InputContainer label='House Type'>
          <Dropdown
            options={homeTypes}
            value={home.homeType}
            optionLabel='name'
            name='homeType'
            onChange={({ value }) => handleChange("homeType", value)}
            placeholder='Select type'
          />
        </InputContainer>
        <InputContainer label='Inside'>
          <MultiSelect
            name='houseRooms'
            value={home.houseRooms}
            options={roomTypes}
            onChange={({ value }) => handleChange("houseRooms", value)}
            optionLabel='name'
            selectedItemTemplate={(item) => (item ? `${item?.name}, ` : "")}
            placeholder='Select rooms'
          />
        </InputContainer>
        <InputContainer label='Household Amenities'>
          <MultiSelect
            name='services'
            value={home.services}
            options={services}
            onChange={({ value }) => handleChange("services", value)}
            optionLabel='value.name'
            selectedItemTemplate={(item) => (item ? `${item?.name}, ` : "")}
            placeholder='Select Services'
          />
        </InputContainer>
        <InputContainer label='Nearby Services'>
          <MultiSelect
            name='nearbyServices'
            value={home.nearbyServices}
            options={nearbyServices}
            onChange={({ value }) => handleChange("nearbyServices", value)}
            optionLabel='value.name'
            selectedItemTemplate={(item) => (item ? `${item?.name}, ` : "")}
            placeholder='Select Nearby Services'
          />
        </InputContainer>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <p>How many rooms you have?</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type='button'
            icon='pi pi-minus-circle'
            className='p-button-rounded p-button-info p-button-text'
            onClick={handleDecrement}
          />
          <span style={{ margin: "auto 0.5rem" }}>{count}</span>
          <Button
            type='button'
            icon='pi pi-plus-circle'
            className='p-button-rounded p-button-info p-button-text'
            onClick={handleIncrement}
          />
        </div>
      </div>
      {home.studentRooms.map((room, index) => (
        <>
          <div className='two-columns'>
            <InputContainer label='Type'>
              <Dropdown
                options={["Private", "Shared"]}
                value={room.type}
                name='homeType'
                onChange={({ value }) => handleRoomChange(index, "type", value)}
                placeholder='Select type'
              />
            </InputContainer>
            <InputContainer label='Bath Type'>
              <Dropdown
                options={["Private", "Shared"]}
                value={room.bathType}
                name='bathType'
                onChange={({ value }) =>
                  handleRoomChange(index, "bathType", value)
                }
                placeholder='Select Bath type'
              />
            </InputContainer>
            <InputContainer label='Bed Type'>
              <Dropdown
                options={[
                  "Single",
                  "Double/Full",
                  "Queen",
                  "King",
                  "Twin/Single",
                ]}
                value={room.bedType}
                name='bedType'
                onChange={({ value }) =>
                  handleRoomChange(index, "bedType", value)
                }
                placeholder='Select Bed type'
              />
            </InputContainer>
            <InputContainer label='Floor'>
              <Dropdown
                options={["Upper Level", "Main Level", "Lower Level"]}
                value={room.floor}
                name='floor'
                onChange={({ value }) =>
                  handleRoomChange(index, "floor", value)
                }
                placeholder='Select Floor'
              />
            </InputContainer>
            <InputContainer label='Bathroom Location'>
              <Dropdown
                options={["In the Room", "Outside of the Room"]}
                value={room.bathroomLocation}
                name='bathroomLocation'
                onChange={({ value }) =>
                  handleRoomChange(index, "bathroomLocation", value)
                }
                placeholder='Select Bathroom location'
              />
            </InputContainer>
            <InputContainer label='Aditional features'>
              <MultiSelect
                name='aditionalFeatures'
                value={room.aditionalFeatures}
                options={additionalRoomFeatures}
                onChange={({ value }) =>
                  handleRoomChange(index, "aditionalFeatures", value)
                }
                optionLabel='value.name'
                selectedItemTemplate={(item) => (item ? `${item?.name}, ` : "")}
                placeholder='Select Aditional features'
              />
            </InputContainer>
          </div>
          <InputContainer label='Availabiliy'>
            <AvailabilityPicker
              dates={room.availability}
              setDates={({ target: { value } }) =>
                handleRoomChange(index, "availability", value)
              }
            />
          </InputContainer>
        </>
      ))}
    </>
  );
};

export default Home;
