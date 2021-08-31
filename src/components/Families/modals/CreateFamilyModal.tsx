import React, { useState, useEffect, useContext } from 'react'
import Modal from 'components/UI/Molecules/Modal'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { useSession } from 'next-auth/client'
import GenericsService from 'services/Generics'
import { AutoComplete } from 'primereact/autocomplete'
import DropDown from 'components/UI/Atoms/DropDown'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Chips } from 'primereact/chips'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import FamilyMemberModal from 'components/Families/modals/FamilyMemberModal'
import PetMemberModal from 'components/Families/modals/PetMemberModal'
import { FamilyContext } from 'context/FamilyContext'

export default function CreateFamilyModal({ isOpen, setIsOpen }) {
  const { family, getFamily } = useContext(FamilyContext)
  const [session] = useSession()
  const [actualStep, setActualStep] = useState(0)
  const [secHost, setSecHost] = useState(false)

  //provinces
  const [filteredLocation, setFilteredLocation] = useState([])
  //cities
  const [filteredcity, setFilteredcity] = useState([])
  const [filteredCountry, setFilteredCountry] = useState([])
  const [filteredOccupation, setFilteredOccupation] = useState([])
  //home types
  const [homeTypes, sethomeTypes] = useState([])
  //form sections
  const [familyUser, setFamilyUser] = useState({
    tenants: false,
    name: '',
    languages: '',
    welcomeStudentGenders: '',
    mainMembers: [],
    lastName: '',
    gender: '',
    motherTongue: '',
    mainPhone: '',
    occupation: '',
    birthDate: '',
    email: '',
    password: '',
    cpassword: '',
  })
  const [newFamilyContact, setNewFamilyContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    sex: '',
    Occupation: '',
    otherLanguages: '',
    occupation: '',
    phone: '',
    homePhone: '',
    motherTongue: '',
    //secondaryHost
    secondHostfirstName: '',
    secondHostlastName: '',
    secondHostemail: '',
    secondHostsex: '',
    secondHostOccupation: '',
    secondHostotherLanguages: '',
    secondHostoccupation: '',
    secondHostphone: '',
    secondHosthomePhone: '',
    secondHostmotherTongue: '',
  })
  const [homeDetails, setHomeDetails] = useState({
    country: '',
    province: '',
    city: '',
    postalCode: 0,
    intersection: '',
    address: '',
    description: '',
    nearbySvcs: [],
    homeType: '',
  })
  const [familyMembersAndPets, setFamilyMembersAndPets] = useState({})

  //step 4 states for create members and pets
  const [accordionIndex, setaccordionIndex] = useState(0)
  const [editFamilyMember, seteditFamilyMember] = useState(false)
  const [deleteFamilyMember, setDeleteFamilyMember] = useState(false)
  const [editFamilyPet, seteditFamilyPet] = useState(false)
  const [deleteFamilyPet, setDeleteFamilyPet] = useState(false)
  const [showFamilyMembersModal, setShowFamilyMembersModal] = useState(false)
  const [showPetsModal, setShowPetsModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [relationships, setRelationships] = useState([])

  useEffect(() => {
    GenericsService.getGeneric(session?.token, 'family-relationship')
      .then((response) => setRelationships(response))
      .catch((error) => console.error(error))

    return () => {}
  }, [session])

  const stepItems = [
    { label: 'User' },
    { label: 'Contact' },
    { label: 'Home Details' },
    { label: 'Family' },
  ]

  const handleSteps = (e) => {
    e.preventDefault()
    if (e.target.getAttribute('data-action') === 'btncfmback') {
      if (actualStep > 0) setActualStep(actualStep - 1)
    } else {
      if (actualStep < 3) setActualStep(actualStep + 1)
    }
  }

  useEffect(() => {
    ;(async () => {
      const { homeTypes } = await GenericsService.getAll(session?.token, [
        'homeTypes',
      ])
      sethomeTypes(homeTypes)
    })()

    return () => {}
  }, [])

  //search locations (provinces)
  const searchLocation = async (e) => {
    const { provinces } = await GenericsService.getAll(session?.token, [
      'provinces',
    ])
    let _filteredLocations = []
    let filtered = provinces.filter((prov) =>
      prov.name.toLowerCase().includes(e.query)
    )
    filtered.forEach((fl) => {
      _filteredLocations.push(fl.name)
    })
    setFilteredLocation(_filteredLocations)
  }

  const searchCity = async (e) => {
    const { cities } = await GenericsService.getAll(session?.token, ['cities'])
    let _filteredLocations = []
    let filtered = cities.filter((prov) =>
      prov.name.toLowerCase().includes(e.query)
    )
    filtered.forEach((fl) => {
      _filteredLocations.push(fl.name)
    })
    setFilteredcity(_filteredLocations)
  }

  const searchCountry = async (e) => {
    const { countries } = await GenericsService.getAll(session?.token, [
      'countries',
    ])
    let _filteredLocations = []
    let filtered = countries.filter((prov) =>
      prov.name.toLowerCase().includes(e.query)
    )
    filtered.forEach((fl) => {
      _filteredLocations.push(fl.name)
    })
    setFilteredCountry(_filteredLocations)
  }
  const searchOccupation = async (e) => {
    const { occupations } = await GenericsService.getAll(session?.token, [
      'occupations',
    ])
    let _filteredLocations = []
    let filtered = occupations.filter((prov) =>
      prov.name.toLowerCase().includes(e.query)
    )
    filtered.forEach((fl) => {
      _filteredLocations.push(fl.name)
    })
    setFilteredOccupation(_filteredLocations)
  }

  //-------------------
  //HOME DETAILS CONFIG END
  //-------------------

  //family member template for data table
  const leftToolbarTemplate = () => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          label=''
          icon='pi pi-pencil'
          className='p-button-success p-button-rounded p-mr-2'
          onClick={() => {
            seteditFamilyMember(true)
          }}
        />
        <Button
          label=''
          icon='pi pi-trash'
          className='p-button-danger p-button-rounded'
          onClick={() => {
            setDeleteFamilyMember(true)
          }}
          disabled={false}
        />
      </div>
    )
  }

  const leftpetToolbarTemplate = () => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          label=''
          icon='pi pi-pencil'
          className='p-button-success p-button-rounded p-mr-2'
          onClick={() => {
            seteditFamilyPet(true)
          }}
        />
        <Button
          label=''
          icon='pi pi-trash'
          className='p-button-danger p-button-rounded'
          onClick={() => {
            setDeleteFamilyPet(true)
          }}
          disabled={false}
        />
      </div>
    )
  }

  const handleSubmit = () => {
    console.log('enviado')
  }

  return (
    <Modal
      title='Create new family'
      icon='family'
      visible={isOpen}
      setVisible={setIsOpen}
      xbig={true}
    >
      <form className='stepsForm' onSubmit={handleSubmit}>
        <Steps model={stepItems} activeIndex={actualStep} />
        <div className='steps-container'>
          {actualStep === 0 && (
            <div>
              <div className='row-dir'>
                <InputContainer label='First name'>
                  <InputText
                    name='name'
                    placeholder='Your first name'
                    value={familyUser.name}
                    onChange={(e) => {
                      setFamilyUser({ ...familyUser, name: e.target.value })
                    }}
                  />
                </InputContainer>
                <InputContainer label='last name'>
                  <InputText
                    name='lastName'
                    placeholder='Your last name'
                    value={familyUser.lastName}
                    onChange={(e) => {
                      setFamilyUser({ ...familyUser, lastName: e.target.value })
                    }}
                  />
                </InputContainer>
              </div>
              <div className='row-dir'>
                <InputContainer label='Email'>
                  <InputText
                    type='email'
                    name='email'
                    placeholder='Your email'
                    value={familyUser.email}
                    onChange={(e) => {
                      setFamilyUser({ ...familyUser, email: e.target.value })
                    }}
                  />
                </InputContainer>
                <InputContainer label='Occupation'>
                  <AutoComplete
                    value={familyUser.occupation}
                    suggestions={filteredOccupation}
                    completeMethod={searchOccupation}
                    onChange={(e) =>
                      setFamilyUser({ ...familyUser, occupation: e.value })
                    }
                  />
                </InputContainer>
              </div>
              <div className='row-dir'>
                <InputContainer label='Password'>
                  <InputText
                    type='password'
                    name='password'
                    placeholder='Your password'
                    value={familyUser.password}
                    onChange={(e) => {
                      setFamilyUser({ ...familyUser, password: e.target.value })
                    }}
                  />
                </InputContainer>
                <InputContainer label='Confirm Password'>
                  <InputText
                    type='password'
                    name='passwordconfirm'
                    placeholder='Confirm your password'
                    value={familyUser.cpassword}
                    onChange={(e) => {
                      setFamilyUser({
                        ...familyUser,
                        cpassword: e.target.value,
                      })
                    }}
                  />
                </InputContainer>
              </div>
            </div>
          )}

          {actualStep === 1 && (
            <>
              <div>
                <h3 style={{ textAlign: 'center' }}>Primary Host</h3>
                <div className='row-dir'>
                  <InputContainer label='First name'>
                    <InputText
                      name='firstName'
                      placeholder='Your first name'
                      value={newFamilyContact.firstName}
                      onChange={(e) => {
                        setNewFamilyContact({
                          ...newFamilyContact,
                          firstName: e.target.value,
                        })
                      }}
                    />
                  </InputContainer>
                  <InputContainer label='last name'>
                    <InputText
                      name='lastName'
                      placeholder='Your last name'
                      value={newFamilyContact.lastName}
                      onChange={(e) => {
                        setNewFamilyContact({
                          ...newFamilyContact,
                          lastName: e.target.value,
                        })
                      }}
                    />
                  </InputContainer>
                </div>
                <div className='row-dir'>
                  <InputContainer label='Email'>
                    <InputText
                      type='email'
                      name='email'
                      placeholder='Your email'
                      value={newFamilyContact.email}
                      onChange={(e) => {
                        setNewFamilyContact({
                          ...newFamilyContact,
                          email: e.target.value,
                        })
                      }}
                    />
                  </InputContainer>
                  <InputContainer label='Occupation'>
                    <AutoComplete
                      value={newFamilyContact.occupation}
                      suggestions={filteredOccupation}
                      completeMethod={searchOccupation}
                      onChange={(e) =>
                        setNewFamilyContact({
                          ...newFamilyContact,
                          occupation: e.value,
                        })
                      }
                    />
                  </InputContainer>
                </div>
                <div className='row-dir'>
                  <InputContainer label='Sex'>
                    <InputText
                      type='text'
                      name='sex'
                      placeholder='sex'
                      value={newFamilyContact.sex}
                      onChange={(e) => {
                        setNewFamilyContact({
                          ...newFamilyContact,
                          sex: e.target.value,
                        })
                      }}
                    />
                  </InputContainer>
                  <InputContainer label='Main Language(s) spoken at home'>
                    <InputText
                      type='text'
                      name='motherTongue'
                      style={{ marginLeft: '12px' }}
                      value={newFamilyContact.motherTongue}
                      onChange={(e) => {
                        setNewFamilyContact({
                          ...newFamilyContact,
                          motherTongue: e.target.value,
                        })
                      }}
                    />
                  </InputContainer>
                </div>
                <div className='row-dir'>
                  <InputContainer
                    label='What language(s) do you speak'
                    style={{
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    >
                      <InputText
                        type='text'
                        name='otherLanguages'
                        style={{ marginLeft: '12px' }}
                        value={newFamilyContact.otherLanguages}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            otherLanguages: e.target.value,
                          })
                        }}
                      />
                    </div>
                  </InputContainer>
                </div>
                <div className='row-dir'>
                  <InputContainer label='Phone number'>
                    <InputText
                      type='tel'
                      name='phone'
                      placeholder='Your phone number'
                      value={newFamilyContact.phone}
                      onChange={(e) => {
                        setNewFamilyContact({
                          ...newFamilyContact,
                          phone: e.target.value,
                        })
                      }}
                    />
                  </InputContainer>
                  <InputContainer label='Home phone number'>
                    <InputText
                      type='tel'
                      name='homephone'
                      placeholder='Your home phone'
                      value={newFamilyContact.homePhone}
                      onChange={(e) => {
                        setNewFamilyContact({
                          ...newFamilyContact,
                          homePhone: e.target.value,
                        })
                      }}
                    />
                  </InputContainer>
                </div>
                <div className='row-dir'>
                  <InputContainer
                    label='Would you like to add a second host'
                    style={{ flexDirection: 'row' }}
                  >
                    <Checkbox
                      onChange={(e) => setSecHost(e.checked)}
                      checked={secHost}
                      style={{ marginLeft: '16px' }}
                    ></Checkbox>
                  </InputContainer>
                </div>
              </div>

              {secHost && (
                <div>
                  <h3 style={{ textAlign: 'center' }}>Primary Host</h3>
                  <div className='row-dir'>
                    <InputContainer label='First name'>
                      <InputText
                        name='firstName'
                        placeholder='Your first name'
                        value={newFamilyContact.secondHostfirstName}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHostfirstName: e.target.value,
                          })
                        }}
                      />
                    </InputContainer>
                    <InputContainer label='last name'>
                      <InputText
                        name='lastName'
                        placeholder='Your last name'
                        value={newFamilyContact.secondHostlastName}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHostlastName: e.target.value,
                          })
                        }}
                      />
                    </InputContainer>
                  </div>
                  <div className='row-dir'>
                    <InputContainer label='Email'>
                      <InputText
                        type='email'
                        name='email'
                        placeholder='Your email'
                        value={newFamilyContact.secondHostemail}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHostemail: e.target.value,
                          })
                        }}
                      />
                    </InputContainer>
                    <InputContainer label='Occupation'>
                      <AutoComplete
                        value={newFamilyContact.secondHostoccupation}
                        suggestions={filteredOccupation}
                        completeMethod={searchOccupation}
                        onChange={(e) =>
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHostoccupation: e.value,
                          })
                        }
                      />
                    </InputContainer>
                  </div>
                  <div className='row-dir'>
                    <InputContainer label='Sex'>
                      <InputText
                        type='text'
                        name='sex'
                        placeholder='sex'
                        value={newFamilyContact.secondHostsex}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHostsex: e.target.value,
                          })
                        }}
                      />
                    </InputContainer>
                    <InputContainer label='Main Language(s) spoken at home'>
                      <InputText
                        type='text'
                        name='motherTongue'
                        style={{ marginLeft: '12px' }}
                        value={newFamilyContact.secondHostmotherTongue}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHostmotherTongue: e.target.value,
                          })
                        }}
                      />
                    </InputContainer>
                  </div>
                  <div className='row-dir'>
                    <InputContainer
                      label='What language(s) do you speak'
                      style={{
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                      >
                        <InputText
                          type='text'
                          name='otherLanguages'
                          style={{ marginLeft: '12px' }}
                          value={newFamilyContact.secondHostotherLanguages}
                          onChange={(e) => {
                            setNewFamilyContact({
                              ...newFamilyContact,
                              secondHostotherLanguages: e.target.value,
                            })
                          }}
                        />
                      </div>
                    </InputContainer>
                  </div>
                  <div className='row-dir'>
                    <InputContainer label='Phone number'>
                      <InputText
                        type='tel'
                        name='phone'
                        placeholder='Your phone number'
                        value={newFamilyContact.secondHostphone}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHostphone: e.target.value,
                          })
                        }}
                      />
                    </InputContainer>
                    <InputContainer label='Home phone number'>
                      <InputText
                        type='tel'
                        name='homephone'
                        placeholder='Your home phone'
                        value={newFamilyContact.secondHosthomePhone}
                        onChange={(e) => {
                          setNewFamilyContact({
                            ...newFamilyContact,
                            secondHosthomePhone: e.target.value,
                          })
                        }}
                      />
                    </InputContainer>
                  </div>
                </div>
              )}
            </>
          )}

          {actualStep === 2 && (
            <div>
              <div className='row-dir'>
                <InputContainer label='Country'>
                  <AutoComplete
                    value={homeDetails.country}
                    suggestions={filteredCountry}
                    completeMethod={searchCountry}
                    onChange={(e) =>
                      setHomeDetails({ ...homeDetails, country: e.value })
                    }
                  />
                </InputContainer>

                <InputContainer label='Province'>
                  <AutoComplete
                    value={homeDetails.province}
                    suggestions={filteredLocation}
                    completeMethod={searchLocation}
                    onChange={(e) =>
                      setHomeDetails({ ...homeDetails, province: e.value })
                    }
                  />
                </InputContainer>
              </div>
              <div className='row-dir'>
                <InputContainer label='City'>
                  <AutoComplete
                    value={homeDetails.city}
                    suggestions={filteredcity}
                    completeMethod={searchCity}
                    onChange={(e) =>
                      setHomeDetails({ ...homeDetails, city: e.value })
                    }
                  />
                </InputContainer>
                <InputContainer label='Postal code'>
                  <InputNumber
                    inputId='withoutgrouping'
                    value={homeDetails.postalCode}
                    onValueChange={(e) =>
                      setHomeDetails({ ...homeDetails, postalCode: e.value })
                    }
                    mode='decimal'
                    useGrouping={false}
                  />
                </InputContainer>
              </div>
              <div className='row-dir'>
                <InputContainer label='Main intersection'>
                  <InputText name='intersection' />
                </InputContainer>
                <InputContainer label='Address'>
                  <InputTextarea
                    rows={1}
                    cols={30}
                    value={homeDetails.address}
                    onChange={(e) =>
                      setHomeDetails({
                        ...homeDetails,
                        address: e.target.value,
                      })
                    }
                    autoResize
                  />
                </InputContainer>
              </div>
              <div className='row-dir'>
                <InputContainer label='Description'>
                  <InputTextarea
                    rows={1}
                    cols={30}
                    value={homeDetails.description}
                    onChange={(e) =>
                      setHomeDetails({
                        ...homeDetails,
                        description: e.target.value,
                      })
                    }
                    autoResize
                  />
                </InputContainer>
                <InputContainer label='Nearby services'>
                  <Chips
                    value={homeDetails.nearbySvcs}
                    onChange={(e) =>
                      setHomeDetails({ ...homeDetails, nearbySvcs: e.value })
                    }
                    separator=','
                  />
                </InputContainer>
              </div>
              <h3 style={{ textAlign: 'center' }}>Living place</h3>
              <div className='row-dir'>
                <InputContainer label='Description'>
                  <DropDown
                    id='homeTypes'
                    placeholder='House Type'
                    className=''
                    options={homeTypes}
                    handleChange={(id, selected) => {
                      setHomeDetails({ ...homeDetails, homeType: selected })
                    }}
                  />
                </InputContainer>
                <InputContainer label='Household aminities'>
                  <Chips
                    value={homeDetails.nearbySvcs}
                    onChange={(e) =>
                      setHomeDetails({ ...homeDetails, nearbySvcs: e.value })
                    }
                    separator=','
                  />
                </InputContainer>
              </div>
            </div>
          )}
          {actualStep === 3 && (
            <div className=''>
              <Accordion
                activeIndex={accordionIndex}
                onTabChange={(e) => setaccordionIndex(e.index)}
              >
                <AccordionTab header='Family Members'>
                  <div className=''>
                    <Button>Create</Button>
                  </div>
                  <div className=''>
                    <DataTable
                      value={[
                        {
                          firstName: 'Jhon',
                          lastName: 'Doe',
                          birthDate: 'a date',
                          livesAtHome: 'Yes',
                          comment: 'none',
                          relationship: 'brother',
                          gender: 'tripanic binary',
                        },
                      ]}
                    >
                      <Column
                        field='firstName'
                        header='Name'
                        headerStyle={{ fontSize: '12px' }}
                      ></Column>
                      <Column field='lastName' header='Last Name'></Column>
                      <Column field='birthDate' header='Birth'></Column>
                      <Column
                        field='livesAtHome'
                        header='Lives At Home'
                      ></Column>
                      <Column field='comment' header='Comment'></Column>
                      <Column
                        field='relationship'
                        header='Relationship'
                      ></Column>
                      <Column field='gender' header='Gender'></Column>
                      <Column
                        body={leftToolbarTemplate}
                        header='Actions'
                      ></Column>
                    </DataTable>
                  </div>
                </AccordionTab>
                <AccordionTab header='Pets'>
                  <div className=''>
                    <Button>Create</Button>
                  </div>
                  <div className=''>
                    <DataTable
                      value={[
                        {
                          name: 'Tom',
                          age: '2',
                          type: 'Cat',
                          breed: 'Yes',
                          comment: 'none',
                          relationship: 'brother',
                          gender: 'tripanic binary',
                        },
                      ]}
                    >
                      <Column field='name' header='Name'></Column>
                      <Column field='age' header='Age'></Column>
                      <Column field='type' header='Type'></Column>
                      <Column field='breed' header='Breed'></Column>
                      <Column field='comment' header='Comment'></Column>
                      <Column
                        body={leftpetToolbarTemplate}
                        header='Actions'
                      ></Column>
                    </DataTable>
                  </div>
                </AccordionTab>
              </Accordion>
            </div>
          )}

          <div className=''>
            <Button
              className='p-btn p-btn-primary'
              data-action='btncfmback'
              onClick={handleSteps}
            >
              Back
            </Button>
            <Button className='p-btn p-btn-primary' onClick={handleSteps}>
              Next
            </Button>
          </div>
        </div>
      </form>

      <Modal
        draggable={false}
        visible={showFamilyMembersModal}
        setVisible={() => {
          setShowFamilyMembersModal(false)
          setEditData(null)
        }}
        title={editData ? 'Update family members' : 'Create family members'}
        icon='family-members'
      >
        <FamilyMemberModal
          closeDialog={() => {
            setShowFamilyMembersModal(false)
            setEditData(null)
          }}
          familyData={family}
          memberData={{
            ...editData,
            familyRelationship: relationships.find(
              (item) => item._id === editData?.familyRelationship[0]._id
            ),
          }}
          relationships={relationships}
        />
      </Modal>
      <Modal
        draggable={false}
        visible={showPetsModal}
        setVisible={() => {
          setShowPetsModal(false)
          setEditData(null)
        }}
        title={editData ? 'Update family pet' : 'Create family pet'}
        icon='pet'
      >
        <PetMemberModal
          familyData={family}
          closeDialog={() => {
            setShowPetsModal(false)
            setEditData(null)
          }}
          petData={editData}
        />
      </Modal>
    </Modal>
  )
}
