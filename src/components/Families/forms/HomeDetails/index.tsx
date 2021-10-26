import { useState, useEffect, useContext, useRef, useMemo } from 'react'
//components
import Modal from 'components/UI/Molecules/Modal'
import FormGroup from 'components/UI/Molecules/FormGroup'
import FormHeader from 'components/UI/Molecules/FormHeader'
import FileUploader from 'components/UI/Atoms/FileUploader'
import InputContainer from 'components/UI/Molecules/InputContainer'
import Map from 'components/UI/Organism/Map'
import Table from 'components/UI/Organism/Table'
import Gallery from 'components/UI/Organism/Gallery'
import HomePicturesForm from 'components/Families/modals/HomePicturesModal'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast'
import { BedroomsPicturesModal } from 'components/Families/modals/BedroomPicturesModal'
import CreatableSelect from 'react-select/creatable'
//styles
import classes from 'styles/Families/Forms.module.scss'
//services
import FamiliesService from 'services/Families'
import HomeService from 'services/Home'
import GenericsService from 'services/Generics'
//utils
import { verifyEditFamilyData } from 'utils/verifyEditFamilyData'
//context
import { FamilyContext } from 'context/FamilyContext'
//Api
import { useSession } from 'next-auth/client'
import { confirmDialog } from 'primereact/confirmdialog'
import BedroomModal from 'components/Families/modals/BedroomModal'

const bedroomsColumns = [
  {
    field: 'type',
    header: 'Type of bedroom',
    filterPlaceholder: 'Search by type of room',
  },
  {
    field: 'bathType',
    header: 'Bathroom Type',
    filterPlaceholder: 'Search by bath Type',
  },
  {
    field: 'bathroomLocation',
    header: 'Bathroom location',
    filterPlaceholder: 'Search by Bathroom location',
  },
  {
    field: 'bedType',
    header: 'Type of Bed',
    filterPlaceholder: 'Search by bed Type',
  },
  {
    field: 'floor',
    header: 'Bedroom Level',
    filterPlaceholder: 'Search by bedroom level',
  },
]

export default function HomeDetailsForm() {
  const toast = useRef(null)
  const { family, getFamily, activeUserType } = useContext(FamilyContext)
  const [familyData, setFamilyData] = useState(family)
  const [session] = useSession()
  const [showBedroomsModal, setShowBedroomsModal] = useState(false)
  const [editingBedroom, setEditingBedroom] = useState<any>({})

  const bedRooms = useMemo(
    () =>
      family.home?.studentRooms.map((room, index) => ({
        ...room,
        _id: `studentRoom${index}`,
      })),
    [family]
  )
  const [newVideoURL, setNewVideoURl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [homeCategory, setHomeCategory] = useState('Inside')
  const [roomTypes, setRoomTypes] = useState([])
  const [homePictures, setHomePictures] = useState([])
  const [bedroomPictures, setBedroomPictures] = useState([])
  const [showPicturesModal, setShowPicturesModal] = useState(false)
  const [showBedroomsPicturesModal, setShowBedroomsPicturesModal] =
    useState(false)
  const [houseRooms, setHouseRooms] = useState(
    familyData.home?.houseRooms
      ? familyData.home?.houseRooms
          .map((aux) => aux.roomType.doc)
          .filter((aux) => aux !== undefined)
      : []
  )

  //inputs data
  const [countriesInput, setCountriesInput] = useState([])
  const [provincesInput, setProvincesInput] = useState([])
  const [citiesInput, setCitiesInput] = useState([])
  const [homeTypesInput, setHomeTypesInput] = useState([])
  const [servicesInput, setServicesInput] = useState([])
  const [roomTypesInput, setRoomTypesInput] = useState([])
  const [nearbyServicesInput, setNearbyServicesInput] = useState([])
  const [communitiesinput, setCommunitiesinput] = useState([])
  const [community, setcommunity] = useState({_id:''})
  const [roomCategory, setRoomCategory] = useState('')

  const [services, setServices] = useState(
    family.home?.services.map((service) => ({
      value: service.isFreeComment ? service.freeComment : service.doc,
      isFreeComment: service.isFreeComment,
      label: service.isFreeComment ? service.freeComment : service.doc.name,
    })) || []
  )
  const [nearbyServices, setNearbyServices] = useState(
    family.home?.nearbyServices.map((nearbyService) => ({
      value: nearbyService.isFreeComment
        ? nearbyService.freeComment
        : nearbyService.doc,
      isFreeComment: nearbyService.isFreeComment,
      label: nearbyService.isFreeComment
        ? nearbyService.freeComment
        : nearbyService.doc.name,
    })) || []
  )

  const [mapOptions, setMapOptions] = useState({
    center: {
      lat: family.location?.cordinate.latitude || 45.421532,
      lng: family.location?.cordinate.longitude || -75.697189,
    },
    zoom: 16,
  })

  const [dataMarker, setDataMarker] = useState({
    lat: family.location?.cordinate.latitude ,
    lng: family.location?.cordinate.longitude,
  })

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Home details successfully updated',
      life: 3000,
    })
  }
  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error Message',
      detail: 'An error has ocurred',
      life: 3000,
    })
  }
  const toastMessage = (verify) => ({
    severity: 'error',
    summary: 'Error',
    detail: (
      <ul>
        {verify.map((item, idx) => (
          <li key={idx}>"{item}" is required</li>
        ))}
      </ul>
    ),
    life: 4000,
  })

  useEffect(() => {
    ;(async () => {
      const {
        countries,
        provinces,
        cities,
        homeTypes,
        services,
        roomTypes,
        nearbyServices,
        communities
      } = await GenericsService.getAll(session?.token, [
        'countries',
        'provinces',
        'cities',
        'homeTypes',
        'services',
        'roomTypes',
        'nearbyServices',
        'communities'
      ])
      setCommunitiesinput(communities)
      setRoomTypesInput(roomTypes)
      setCountriesInput(countries)
      setProvincesInput(provinces)
      setCitiesInput(cities)
      setHomeTypesInput(homeTypes)
      setServicesInput(
        services.map((service) => ({
          value: service._id,
          label: service.name,
        }))
      )
      setNearbyServicesInput(
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

  useEffect(() => {
    const pictures = []
    family &&
      family.home &&
      family.home?.photoGroups &&
      family.home.photoGroups
        .find((category) => category?.name === homeCategory)
        ?.photos.map((photo, idx) => {
          pictures.push({
            src: photo.photo,
            alt: `${idx}`,
            id: `${idx}`,
          })
        })

    setHomePictures(pictures)
  }, [family, homeCategory])

  useEffect(() => {
    if (editingBedroom) {
      let pictures = []

      const idx = editingBedroom._id?.replace('studentRoom', '')

      family &&
        family.home &&
        family.home.studentRooms
          .filter((_, index) => idx == index)
          .map((room) =>
            room?.photos.map((pic, idx) =>
              pictures.push({
                src: pic.photo || pic.src,
                id: pic._id,
                idx,
              })
            )
          )

      setBedroomPictures(pictures)
    }
  }, [editingBedroom, family])

  useEffect(() => {
    console.log(communitiesinput)

    if(familyData.familyInternalData?.community) {
      setcommunity(communitiesinput.filter(cm=>cm._id===familyData.familyInternalData?.community)[0])
    }
    console.log(community, 'the commmuniiiiity')
  }, [community, communitiesinput])


  const handleChange = (ev) => {
    if(ev.target.name === 'community') {
      setcommunity(ev.target.value)
      setFamilyData({
        ...familyData,
        community,
        familyInternalData: {
          ...familyData.familyInternalData,
        },
      })
      console.log(familyData.familyInternalData, 'setting the target')
    }
    if (ev.target.name === 'latitude' || ev.target.name === 'longitude') {
      setDataMarker({
        ...dataMarker,
        [ev.target.name === 'latitude' ? 'lat' : 'lng']: parseFloat(
          ev.target.value
        ),
      })
      setMapOptions({
        ...mapOptions,
        center: {
          ...mapOptions.center,
          [ev.target.name === 'latitude' ? 'lat' : 'lng']: parseFloat(
            ev.target.value
          ),
        },
      })
      setFamilyData({
        ...familyData,
        location: {
          ...familyData.location,
          cordinate: {
            ...familyData.location?.cordinate,
            [ev.target.name]: ev.target.value,
          },
        },
      })
    } else {
      setFamilyData({
        ...familyData,
        home: {
          ...familyData.home,
          [ev.target.name]: ev.target.value,
        },
      })
    }
    if (ev.target.name === 'city') {
      setMapOptions(prevData => {
        return {
          ...prevData,
          center: {
            lat: ev.target.value.latitude,
            lng: ev.target.value.longitude
          }
        }
      })
    }
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const servicesData = services.map((service) => {
        return service && service.isFreeComment
          ? {
              freeComment: service.value,
              isFreeComment: true,
            }
          : {
              doc: service.value,
              isFreeComment: false,
            }
      })

      const nearbyServicesData = nearbyServices.map((nearbyService) => {
        return nearbyService && nearbyService.isFreeComment
          ? {
              freeComment: nearbyService.value,
              isFreeComment: true,
            }
          : {
              doc: nearbyService.value,
              isFreeComment: false,
            }
      })

      const houseRoomsData = houseRooms.map((aux) => ({
        amount: 1,
        roomType: {
          doc: aux,
          isFreeComment: false,
        },
      }))

      const home = {
        ...(family.home && family.home),
        country: familyData.home?.country?._id,
        province: familyData.home?.province?._id,
        city: familyData.home?.city?._id,
        homeType: familyData.home?.homeType?._id,
        mainIntersection: familyData.home?.mainIntersection,
        houseRooms: houseRoomsData,
        services: servicesData,
        houseTypes: roomTypes,
        nearbyServices: nearbyServicesData,
      }

      const location = {
        description: familyData.location?.descripcion || '',
        cordinate: {
          latitude: dataMarker.lat || 0,
          longitude: dataMarker.lng || 0,
        },
      }
      const familyInternalData = {
        ...familyData.familyInternalData,
        community: community._id
      }

      const formData = new FormData(e.currentTarget)

      const data = new FormData()
      data.append('video', formData.get('video'))

      const verify = [
        ...verifyEditFamilyData(home, 4),
        ...verifyEditFamilyData(home, 5),
      ]
      if (verify.length === 0) {
        if (newVideoURL)
          await HomeService.updateHomeVideo(session?.token, family._id, data)

        await FamiliesService.updateFamilyHome(session?.token, family._id, home)

        await FamiliesService.updatefamily(session?.token, family._id, {
          location: location,
          familyInternalData: familyInternalData
          
        })

        showSuccess()
        getFamily()
        setLoading(false)
      } else {
        setLoading(false)
        toast.current.show(toastMessage(verify))
      }
    } catch (err) {
      showError()
      setLoading(false)
      console.error(err)
    }
  }

  const handleCreateBedroom = (data) => {
    setLoading(true)

    const studentRooms = [...bedRooms?.filter((item) => data._id !== item._id)]
    studentRooms.push(data)

    const homeData = {
      ...familyData.home,
      houseRooms: [
        ...houseRooms.map((room) => ({
          amount: 1,
          roomType: { isFreeComment: false, doc: room },
        })),
      ],
      services: [
        ...services.map((service) => {
          const formatedServices: any = {
            isFreeComment: service.value._id ? false : true,
          }

          if (service.value.name) formatedServices.doc = service.value
          else formatedServices.freeComment = service.value

          return formatedServices
        }),
      ],
      studentRooms: [...(studentRooms?.map(({ _id, ...rest }) => rest) || [])],
    }

    const formData = new FormData()

    Object.entries(homeData).map((aux) => {
      if (typeof aux[1] === 'object') {
        Object.entries(aux[1]).map((aux2) => {
          formData.append(`${aux[0]}[${aux2[0]}]`, aux2[1])
        })
      } else if (typeof aux[1] === 'string' || typeof aux[1] === 'number') {
        formData.append(aux[0], `${aux[1]}`)
      }
    })

    const verify = [
      ...verifyEditFamilyData(homeData, 4),
      ...verifyEditFamilyData(homeData, 5),
    ]

    if (verify.length === 0) {
      if (!family.home) {
        FamiliesService.createHome(session?.token, family._id, homeData)
          .then(() => {
            showSuccess()
            getFamily()
            setLoading(false)
            setShowBedroomsModal(false)
          })
          .catch((err) => {
            showError()
            setLoading(false)
            console.error(err)
          })
      } else {
        FamiliesService.updateFamilyHome(session?.token, family._id, homeData)
          .then(() => {
            showSuccess()
            getFamily()
            setLoading(false)
            setShowBedroomsModal(false)
          })
          .catch((err) => {
            showError()
            setLoading(false)
            console.error(err)
          })
      }
    } else toast.current.show(toastMessage(verify))
  }

  const handleDeleteBedRoom = (deleteItems) => {
    if (deleteItems.length > 0) {
      confirmDialog({
        message: `Are you sure you want to delete these rooms?`,
        header: 'Confirm Delete Student Rooms',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          setLoading(true)

          const rooms = bedRooms
            .filter((room) => !deleteItems.includes(room._id))
            .map(({ _id, ...room }) => room)

          const home = {
            ...familyData.home,
            studentRooms: rooms,
          }

          const formData = new FormData()

          Object.entries(home).map((aux) => {
            if (typeof aux[1] === 'object') {
              Object.entries(aux[1]).map((aux2) => {
                formData.append(`${aux[0]}[${aux2[0]}]`, aux2[1])
              })
            } else if (
              typeof aux[1] === 'string' ||
              typeof aux[1] === 'number'
            ) {
              formData.append(aux[0], `${aux[1]}`)
            }
          })

          FamiliesService.updateFamilyHome(session?.token, family._id, home)
            .then(() => {
              showSuccess()
              getFamily()
              setLoading(false)
            })
            .catch((err) => {
              showError()
              setLoading(false)
              console.error(err)
            })
        },
        reject: () => {},
      })
    }
  }
  const [selectedServices, setselectedServices] = useState([])
  const [selectedNearbyServices, setSelectedNearbyServices] = useState([])
  const [nearbyServicesOptions, setnearbyServicesOptions] = useState([])

  useEffect(() => {
    const scvFormated = []
    const nearbyscvFormated = []
    if (services.length > 0) {
      services.forEach((svc) => scvFormated.push(svc.value._id))
      setselectedServices(scvFormated)
    }
    if (nearbyServices.length > 0) {
      nearbyServices.forEach((svc) => nearbyscvFormated.push(svc.value._id))
      setSelectedNearbyServices(nearbyscvFormated)
    }

    //format the nearby services input because value is an object and we need an id
    if (nearbyServicesInput.length > 0) {
      let formatedVals = []
      nearbyServicesInput.forEach((si) => {
        formatedVals.push({
          label: si.label,
          value: si.value._id,
          isFreeComment: false,
        })
      })
      setnearbyServicesOptions(formatedVals)
    }
  }, [
    servicesInput.length,
    nearbyServicesInput.length,
    nearbyServicesInput.length,
  ])

  const handleSvcs = (value: string[]) => {
    //selected services can be updated here, no problem, value is the actual selection in the multiselect
    setselectedServices(value)
    //rewrite the services, services is the data format defined to the backend
    if (value.length > 0) {
      let newDataSvc = []
      value.forEach((val) => {
        let toPush = {
          ...servicesInput.filter((svc) => svc.value === val)[0],
          isFreeComment: false,
        }
        newDataSvc.push(toPush)
        console.log(newDataSvc, 'new formatted data')
      })
      setServices(newDataSvc)
    } else {
      setServices([])
    }
  }

  const handleNearbyServices = (value) => {
    setSelectedNearbyServices(value)
    if (value.length > 0) {
      let newDataSvc = []
      value.forEach((val) => {
        let toPush = {
          ...nearbyServicesOptions.filter((svc) => svc.value === val)[0],
        }
        newDataSvc.push(toPush)
        console.log(newDataSvc, 'new formatted data')
      })
      setNearbyServices(newDataSvc)
    } else {
      setNearbyServices([])
    }
  }

  const handleRoomCategoryChange = (newValue, actionMetadata) => {
    const newOption =
      actionMetadata.action === 'create-option'
        ? { ...newValue, isFreeComment: true }
        : { ...newValue }
    setRoomCategory(newOption)
    setHomeCategory(newOption.value)
  }

  const [roomCategoryOptionsInput, setRoomCategoryOptionsInput] = useState([])
  useEffect(() => {
    let options = [
      ...roomTypesInput.map((rt) => ({
        label: rt.name,
        value: rt.name,
        _id: rt._id,
      })),
    ]
    let PGOptions = [
      ...(family.home?.photoGroups.map((g) => ({
        label: g.name,
        value: g.name,
        _id: g._id,
      })) || []),
    ]
    PGOptions.forEach((opt) => {
      if (options.filter((o) => o.value === opt.value).length > 0) {
        options = options.filter((o) => o.value !== opt.value)
      }
    })
    setRoomCategoryOptionsInput(
      [...options, ...PGOptions].sort((a, b) => a.value.localeCompare(b.value))
    )
  }, [roomTypesInput.length, family.home?.photoGroups.length])

  const renderVideo = (event) => {
    const video = URL.createObjectURL(event.target.files[0])
    setNewVideoURl(video)
  }

  const [filteredCities, setFilteredCities] = useState([])

  useEffect(() => {
    if (familyData.home?.province?._id) {
      setFilteredCities(
        citiesInput.filter((ct) => ct.province === familyData.home.province._id)
      )
    }
  }, [citiesInput, familyData.home?.province?._id])
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(e)
        }}
      >
        <FormHeader
          title='Home details'
          isLoading={loading}
          onClick={() => {}}
        />
        <FormGroup title='Home video'>
          <div className={classes.form_container_multiple}>
            {newVideoURL && (
              <video width='100%' height='auto' controls>
                <source src={newVideoURL} />
              </video>
            )}
            {family.home?.video && newVideoURL === '' && (
              <video width='100%' height='auto' controls>
                <source src={family.home?.video} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            )}

            {!family.home?.video && !newVideoURL && (
              <img
                style={{ borderRadius: '14px', width: '100%' }}
                src='/assets/img/notVideoFound.svg'
                alt='You have not uploaded a video yet'
              />
            )}
            <div>
              {activeUserType !== 'Reader' && (
                <InputContainer label='Upload new video'>
                  <FileUploader
                    id='video'
                    name='video'
                    onChange={(event) => renderVideo(event)}
                    placeholder="Upload home's video"
                  />
                </InputContainer>
              )}
            </div>
          </div>
        </FormGroup>
      </form>
      <FormGroup title='Home photos'>
        <div className='two-columns'>
          {activeUserType !== 'Reader' && (
            <InputContainer label='Add new photos'>
              <Button
                style={{ width: 'fit-content' }}
                type='button'
                label="Upload home's pictures"
                onClick={() => setShowPicturesModal(true)}
              />
            </InputContainer>
          )}
          <InputContainer label='Category'>
            <CreatableSelect
              isClearable
              name='homeCategory'
              placeholder='Type a category'
              value={roomCategory}
              options={roomCategoryOptionsInput}
              onChange={handleRoomCategoryChange}
            />
          </InputContainer>
          <div />
          <Gallery
            options
            homeCase
            homeCategory={homeCategory}
            images={homePictures}
            setHomePictures={setHomePictures}
          />
        </div>
      </FormGroup>
      <FormGroup title='Location'>
        <div className={classes.form_container_multiple}>
          <InputContainer label='Country'>
            <Dropdown
              options={countriesInput}
              value={familyData.home?.country || 'Not assigned'}
              optionLabel='name'
              name='country'
              onChange={handleChange}
              placeholder='Select country'
            />
          </InputContainer>
          <InputContainer label='Community'>
            <Dropdown
              options={communitiesinput}
              value={community}
              optionLabel='name'
              name='community'
              onChange={handleChange}
              placeholder='Select community'
            />
          </InputContainer>
          
          <InputContainer label='Province'>
            <Dropdown
              options={provincesInput}
              value={familyData.home?.province || 'Not assigned'}
              onChange={handleChange}
              name='province'
              optionLabel='name'
              placeholder='Select province'
            />
          </InputContainer>
          <InputContainer label='City'>
            <Dropdown
              filter
              tooltip='The selected city will be centered on the map.'
              tooltipOptions={{position: 'top'}}
              options={filteredCities}
              value={familyData.home?.city || 'Not assigned'}
              onChange={handleChange}
              name='city'
              optionLabel='name'
              placeholder='Select city'
            />
          </InputContainer>
          <InputContainer label='Main Intersection'>
            <InputText
              placeholder='Main intersection'
              value={familyData.home?.mainIntersection}
              onChange={handleChange}
              name='mainIntersection'
            />
          </InputContainer>
          <InputContainer label='Address'>
            <InputTextarea
              rows={5}
              cols={30}
              value={familyData.home?.address}
              onChange={handleChange}
              name='address'
              autoResize
              placeholder='Put a description about the Address...'
            />
          </InputContainer>

          <InputContainer label='Postal Code'>
            <InputText
              placeholder='Postal code'
              value={familyData.home?.postalCode}
              onChange={handleChange}
              name='postalCode'
            />
          </InputContainer>
          <InputContainer label='Latitude'>
            <InputText
              type='number'
              placeholder='latitude'
              value={dataMarker.lat}
              onChange={handleChange}
              name='latitude'
            />
          </InputContainer>
          <InputContainer label='Longitude'>
            <InputText
              type='number'
              placeholder='longitude'
              value={dataMarker.lng}
              onChange={handleChange}
              name='longitude'
            />
          </InputContainer>
        </div>
          <p>In the map below you will be able to interact with the click to place the marker of the house of this family.</p>
        <div style={{ margin: '3em 0' }}>
          <Map
            setDataMarker={setDataMarker}
            position={dataMarker}
            options={mapOptions}
          />
        </div>
        <div className={classes.form_container_multiple}>
          <InputContainer label='Description'>
            <InputTextarea
              rows={5}
              cols={30}
              value={familyData.home?.description}
              onChange={handleChange}
              name='description'
              autoResize
              placeholder='Put a description about the location...'
            />
          </InputContainer>
          <InputContainer label='Nearby services (Within 15 minutes walk)'>
            <MultiSelect
              value={selectedNearbyServices}
              options={nearbyServicesOptions}
              onChange={(e) => {
                handleNearbyServices(e.value)
              }}
              name='nearbyServices'
              placeholder='Add services'
              optionLabel='label'
            />
          </InputContainer>
        </div>
      </FormGroup>
      <FormGroup title='Living place'>
        <div className={classes.form_container_multiple}>
          <InputContainer label='Type of house'>
            <Dropdown
              options={homeTypesInput}
              value={familyData.home?.homeType}
              onChange={handleChange}
              name='homeType'
              optionLabel='name'
              placeholder='Type of house'
            />
          </InputContainer>
        </div>
        <h4>Inside:</h4>
        <div className={classes.form_container_multiple}>
          <InputContainer label='Inside'>
            <MultiSelect
              options={roomTypesInput}
              placeholder='Select Inside'
              value={houseRooms}
              onChange={(e) => setHouseRooms(e.value)}
              name='houseRooms'
              optionLabel='name'
              selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
            />
          </InputContainer>
          <InputContainer label='Household Amenities'>
            <MultiSelect
              options={servicesInput}
              value={selectedServices}
              onChange={(e) => handleSvcs(e.value)}
              name='services'
              optionLabel='label'
              placeholder='Select services'
            />
          </InputContainer>
        </div>
      </FormGroup>
      <FormGroup title='Bedrooms'>
        <Table
          name='Bedrooms'
          columns={bedroomsColumns}
          content={bedRooms}
          create={() => {
            setEditingBedroom({})
            setShowBedroomsModal(true)
          }}
          edit={(data) => {
            setEditingBedroom(data)
            setShowBedroomsModal(true)
          }}
          onDelete={(e) => handleDeleteBedRoom([e._id])}
          deleteMany={(e) => handleDeleteBedRoom(e.map((room) => room._id))}
          defaultSortField='type'
        />
      </FormGroup>
      <Modal
        visible={showPicturesModal}
        setVisible={setShowPicturesModal}
        title='Home pictures'
        icon='family'
      >
        <HomePicturesForm
          homeCategory={homeCategory}
          pictures={homePictures}
          setVisible={setShowPicturesModal}
          setPictures={setHomePictures}
        />
      </Modal>
      <Modal
        visible={showBedroomsPicturesModal}
        setVisible={setShowBedroomsPicturesModal}
        title='Bedrooms pictures'
        icon='family'
      >
        <BedroomsPicturesModal
          pictures={bedroomPictures}
          editingBedroom={editingBedroom}
          setVisible={setShowBedroomsPicturesModal}
          setPictures={setBedroomPictures}
        />
      </Modal>
      <Modal
        visible={showBedroomsModal}
        setVisible={setShowBedroomsModal}
        title='Bedroom'
        icon='workshop'
      >
        <BedroomModal
          data={editingBedroom}
          onSubmit={handleCreateBedroom}
          bedroomPictures={bedroomPictures}
          setShowPicturesModal={setShowBedroomsPicturesModal}
        />
      </Modal>
      <Toast ref={toast} />
    </div>
  )
}
