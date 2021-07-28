import React, { useContext, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import Modal from 'components/UI/Molecules/Modal'
import FormHeader from 'components/UI/Molecules/FormHeader'
import { Panel } from 'primereact/panel';
import InputContainer from 'components/UI/Molecules/InputContainer'
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import Table from 'components/UI/Organism/Table'
import Gallery from 'components/UI/Organism/Gallery'
//styles
import classes from 'styles/Families/Forms.module.scss'
//services
import GenericsService from 'services/Generics'
//Context
import { FamilyContext } from 'context/FamilyContext'

export default function FamilyForm() {
    const { family } = useContext(FamilyContext)
    const genericsService = new GenericsService()
    //modals
    const [showFamilyMembersModal, setShowFamilyMembersModal] = useState(false)
    const [showPetsModal, setShowPetsModal] = useState(false)
    const [showExternalStudentsModal, setShowExternalStudentsModal] = useState(false)
    const [showTenantsModal, setShowTenantsModal] = useState(false)
    const [showSchoolModal, setShowSchoolModal] = useState(false)
    const [showViewer, setShowViewer] = useState(false)

    const [gendersInput, setGendersInput] = useState([])
    const [languagesInput, setLanguagesInput] = useState([])
    const [rulesInput, setRulesInput] = useState([])
    const [rules, setRules] = useState([])
    const [localCoordinator, setLocalCoordinator] = useState('')
    const [welcomeLetter, setWelcomeLetter] = useState(family.welcomeLetter)
    const [familyPictures, setFamilyPictures] = useState(family.familyPictures.map(pic => {
        return { src: pic.picture, alt: pic.caption }
    }))
    const Viewer = dynamic(() => import('react-viewer'), { ssr: false })

    //data fot datatables
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    function dateToDayAndMonth(date) {
        let result = new Date(date).toLocaleDateString("en-GB", {
            month: "2-digit",
            day: "2-digit",
        });
        return result
    }
    function formatDate (date){
        let result = new Date(date).toLocaleDateString("en-GB", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit"
        });
        return result
    }
    const familyMembers = family.familyMembers.map(({ firstName, lastName, birthDate, gender }) => {
        return (
            {
                firstName,
                lastName,
                birthDate: formatDate(birthDate),
                age: 17,
                gender: gender.name
            }
        )
    })
    const pets = family.pets.map(({ name, age, race, remarks, type }) => {
        return (
            {
                name,
                age,
                breed: race,
                remarks,
                type: type.name
            }
        )
    })
    const externalStudents = family.noRedLeafStudents.map(({ name, nationality, gender, birthDate, stayingSince, stayingUntil }) => {
        return (
            {
                name,
                nationality: nationality.name,
                gender: gender.name,
                age: getAge(birthDate),
                lengthToStay: `${dateToDayAndMonth(stayingSince)} to ${dateToDayAndMonth(stayingUntil)}`
            }
        )
    })
    const tenants = family.tenantList.map(({firstName, lastName, gender, birthDate, occupation, policeCheck}) => {
        return(
            {
                firstName,
                lastName,
                gender: gender.name,
                birthDate: formatDate(birthDate),
                occupation: occupation.name,
                policeCheck: policeCheck.name,
            }
        )
    } )
    const schools = family.schools.map(({school, transports})=> {
        return(
            {
                school: school.name,
                type: school.type,
            }
        )
    })

    //columns for datatables

    const familyMembersColumn = [
        {
            field: "firstName",
            header: "First Name",
            filterPlaceholder: "Search by firstName"
        },
        {
            field: "lastName",
            header: "Last Name",
            filterPlaceholder: "Search by lastName"
        },
        {
            field: "birthDate",
            header: "Date of birth",
            filterPlaceholder: "Search by birth date"
        },
        {
            field: "age",
            header: "Age",
            filterPlaceholder: "Search by age"
        },
        {
            field: "gender",
            header: "gender",
            filterPlaceholder: "Search by gender"
        },
    ]
    const petsColumns = [
        {
            field: "name",
            header: "Name",
            filterPlaceholder: "Search by name"
        },
        {
            field: "age",
            header: "Age",
            filterPlaceholder: "Search by age"
        },
        {
            field: "type",
            header: "Type",
            filterPlaceholder: "Search by type"
        },
        {
            field: "breed",
            header: "Breed",
            filterPlaceholder: "Search by breed"
        },
        {
            field: "remarks",
            header: "remarks",
            filterPlaceholder: "Search by remarks"
        },
    ]
    const externalStudentsColumns = [
        {
            field: "name",
            header: "Name",
            filterPlaceholder: "Search by name"
        },
        {
            field: "nationality",
            header: "Nationality",
            filterPlaceholder: "Search by nationality"
        },
        {
            field: "gender",
            header: "gender",
            filterPlaceholder: "Search by gender"
        },
        {
            field: "age",
            header: "Age",
            filterPlaceholder: "Search by age"
        },
        {
            field: "lengthToStay",
            header: "Length to stay",
            filterPlaceholder: "Search by interval"
        },
    ]
    const tenantsColumns = [
        {
            field: "firstName",
            header: "First name",
            filterPlaceholder: "Search by first name"
        },
        {
            field: "lastName",
            header: "Last Name",
            filterPlaceholder: "Search by last name"
        },
        {
            field: "gender",
            header: "Gender",
            filterPlaceholder: "Search by gender"
        },
        {
            field: "birthDate",
            header: "Birth Date",
            filterPlaceholder: "Search by birth date"
        },
        {
            field: "occupation",
            header: "Occupation",
            filterPlaceholder: "Search by occupation"
        },
        {
            field: "policeCheck",
            header: "Police Check",
            filterPlaceholder: "Search by police check"
        },
    ]
    const schoolsColumns = [
        {
            field: "school",
            header: "School/College",
            filterPlaceholder: "Search by name"
        },
        {
            field: "type",
            header: "Type",
            filterPlaceholder: "Search by type"
        },
    ]
    const handleSubmit = (e) => {
        e.preventdefault()
    }

    useEffect(() => {
        (async () => {
            const { genders, familyRules, languages } = await genericsService.getAll(['genders', 'familyRules', 'languages'])
            await setGendersInput(genders)
            await setLanguagesInput(languages)
            await setRulesInput(familyRules)
            return(
                ()=> {}
            )
        })()
    }, [])

    return (
        <>
            <form onSubmit={e => { handleSubmit(e) }}>
                <FormHeader title="Family" />
                <FormGroup title='Welcome'>
                    <div className={classes.form_container_multiple}>
                        <InputContainer label='Welcome video'>
                            <video width="100%" height="auto" controls>
                                <source src={family.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1em' }}>
                                <p>Add new welcome video</p>
                                <FileUpload mode="basic" name="welcomeVideo" url="https://primefaces.org/primereact/showcase/upload.php" accept="video/*" maxFileSize={1000000} />
                            </div>
                        </InputContainer>
                        <div>
                            <InputContainer label="Welcome letter">
                                <InputTextarea rows={5} cols={30} autoResize value={welcomeLetter} onChange={e => { setWelcomeLetter(e.target.value) }} />
                            </InputContainer>
                            <div>
                                <p>This family is receiving: </p>
                                <InputContainer label="Genders">
                                    <MultiSelect placeholder="Select gender" options={gendersInput} optionLabel='name' onChange={e => { }} />
                                </InputContainer>

                            </div>
                        </div>
                    </div>
                </FormGroup>
            </form>
            <div className={classes.form_container_multiple}>
                <FormGroup title='Rules'>
                    <InputContainer label='Rules'>
                        <MultiSelect options={rulesInput} optionLabel='name' value={rules} onChange={e => { setRules(e.target.value) }} placeholder="Select a rule" />
                    </InputContainer>
                    <InputContainer label='Local Coordinator'>
                        <InputText placeholder="Local coordinator" value={localCoordinator} onChange={e => { setLocalCoordinator(e.target.value) }}></InputText>
                    </InputContainer>
                </FormGroup>
                <FormGroup title='Family photos'>
                    <Gallery images={familyPictures} />
                </FormGroup>
            </div>
            <FormGroup title="Family">
                <Panel header="Members of the family" toggleable>
                    <Table name="Family members" columns={familyMembersColumn} content={familyMembers} create={() => { setShowFamilyMembersModal(true) }} />
                </Panel>
                <Panel header="Pets" toggleable style={{ marginTop: '3rem' }}>
                    <Table name="Pets" columns={petsColumns} content={pets} create={() => { setShowPetsModal(true) }} />
                </Panel>
                <Panel header="External Students" toggleable style={{ marginTop: '3rem' }}>
                    <Table name="External Students" columns={externalStudentsColumns} content={externalStudents} create={() => { setShowExternalStudentsModal(true) }} />
                </Panel>
                <Panel header="Tenants" toggleable style={{ marginTop: '3rem' }}>
                    <Table name="Tenants" columns={tenantsColumns} content={tenants} create={() => { setShowTenantsModal(true) }} />
                </Panel>
            </FormGroup>
            <FormGroup title="Schools">
                <Table name="Schools" columns={schoolsColumns} content={schools} create={() => { setShowSchoolModal(true) }} />
            </FormGroup>
            {/* Modals */}
            <Modal visible={showFamilyMembersModal} setVisible={setShowFamilyMembersModal} title='Create family members' icon='family-members'>
                <div className={classes.form_container_multiple}>
                    <label >
                        Name
                        <InputText
                            name="name"
                            placeholder="name"
                            // value={member.lastName}
                            // onChange={e => { submit(e, id) }}
                        />
                    </label>
                    <label >
                        Last Name
                        <InputText
                            name="name"
                            placeholder="last name"
                            // value={member.lastName}
                            // onChange={e => { submit(e, id) }}
                        />
                    </label>
                    <label >
                        Date of Birth
                        <Calendar
                            // id="basic"
                            // value={date1}
                            // onChange={(e) => setDate1(e.value)}
                        />
                    </label>
                    <label >
                        Age
                        <InputText
                            name="name"
                            placeholder="name"
                            // value={member.lastName}
                            // onChange={e => { submit(e, id) }}
                        />
                    </label>
                    <label htmlFor="Languages"></label>
                    <label >
                        Spoken Languages
                        <MultiSelect 
                            placeholder="Select gender"
                            options={languagesInput}
                            optionLabel='name'
                            onChange={e => { }}
                        />
                    </label>
                    <label >
                        Live in the house
                        <Dropdown 
                            placeholder="Select gender"
                            options={gendersInput}
                            optionLabel='name'
                            onChange={e => { }}
                        />
                    </label>
                    <label >
                        Gender
                        <Dropdown 
                            placeholder="Select gender"
                            options={gendersInput}
                            optionLabel='name'
                            onChange={e => { }}
                        />
                    </label>
                    <label >
                        Relationship
                        <Dropdown 
                            placeholder="Select gender"
                            options={gendersInput}
                            optionLabel='name'
                            onChange={e => { }}
                        />
                    </label>
                    <label >
                        Comments<input type="text" />
                    </label>
                </div>
            </Modal>
            <Modal visible={showPetsModal} setVisible={setShowPetsModal} title='Create family pet' icon="pet">
                <p>Pets form</p>
            </Modal>
            <Modal visible={showExternalStudentsModal} setVisible={setShowExternalStudentsModal} title='Create external student' icon="external-student">
                <p>External students form</p>
            </Modal>
            <Modal visible={showTenantsModal} setVisible={setShowTenantsModal} title="Create Tenants" icon='tenant'>
                <p>tenant form</p>
            </Modal>
            <Modal visible={showSchoolModal} setVisible={setShowSchoolModal} title="Create school" icon="school">
                <p>school form</p>
            </Modal>
        </>
    )
}
