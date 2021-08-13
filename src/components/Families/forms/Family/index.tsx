import React, { useContext, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
//components
import FamiliesService from 'services/Families'
import FormGroup from 'components/UI/Molecules/FormGroup'
import Modal from 'components/UI/Molecules/Modal'
import FormHeader from 'components/UI/Molecules/FormHeader'
import { Panel } from 'primereact/panel';
import InputContainer from 'components/UI/Molecules/InputContainer'
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import Table from 'components/UI/Organism/Table'
import Gallery from 'components/UI/Organism/Gallery'
import FamilyMemberModal from 'components/Families/modals/FamilyMemberModal'
import PetMemberModal from 'components/Families/modals/PetMemberModal'
import ExternalStudentsModal from 'components/Families/modals/ExternalStudentsModal'
//styles
import classes from 'styles/Families/Forms.module.scss'
//services
import GenericsService from 'services/Generics'
//Context
import { FamilyContext } from 'context/FamilyContext'
//utils
import { externalStudentsColumns, familyMembersColumn, petsColumns, schoolsColumns, tenantsColumns } from 'utils/constants'
import {dateToDayAndMonth,formatDate,getAge} from 'utils/formatDate'
import { useSession } from 'next-auth/client'
import TenantsModal from 'components/Families/modals/TenantsModal'

export default function FamilyForm() {
    const { family, setFamily } = useContext(FamilyContext)
    const [session,] = useSession()
    const [familyData, setFamilyData] = useState(family);
    //modals
    //Family members 
    const [showCreateFamilyMembersModal, setShowCreateFamilyMembersModal] = useState(false)
    const [showEditFamilyMembersModal, setShowEditFamilyMembersModal] = useState(false)
    const [showPetsModal, setShowPetsModal] = useState(false)
    const [showExternalStudentsModal, setShowExternalStudentsModal] = useState(false)
    const [showTenantsModal, setShowTenantsModal] = useState(false)
    const [showSchoolModal, setShowSchoolModal] = useState(false)
    const [showViewer, setShowViewer] = useState(false)
    const [editData, setEditData] = useState(null);

    const [gendersInput, setGendersInput] = useState([])
    const [rulesInput, setRulesInput] = useState([])
    const [rules, setRules] = useState([])
    const [localCoordinator, setLocalCoordinator] = useState('')
    const [welcomeLetter, setWelcomeLetter] = useState(family.welcomeLetter)
    const [familyPictures, setFamilyPictures] = useState(family.familyPictures.map((pic,id) => {
        return { src: pic.picture, alt: pic.caption, id  }
    }))
    const Viewer = dynamic(() => import('react-viewer'), { ssr: false })
    //data fot datatables

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
    const tenants = family.tenantList.map(({ firstName, lastName, gender, birthDate, occupation, }) => {
        return(
            {
                firstName,
                lastName,
                gender: gender.name,
                birthDate: formatDate(birthDate),
                occupation: occupation.name,
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

    const handleSubmit = (e) => {
        e.preventdefault()
    }
    const handleCreateFamilyMembers = (e) => {
        setShowCreateFamilyMembersModal(false)
        console.log(e)
    } 
    useEffect(() => {
        (async () => {
            const { genders, familyRules } = await GenericsService.getAll(session?.token,['genders', 'familyRules'])
            await setGendersInput(genders)
            await setRulesInput(familyRules)
            return(
                ()=> {}
            )
        })()
    }, [session])

    const handleDeleteFamilyMembers = (e) => {
        const memberFamilyData = family.familyMembers.filter(item => {
            if(item.firstName !== e.firstName) {
                return item
            }
        })

        FamiliesService.updatefamily(session?.token, family._id, {...family, familyMembers: memberFamilyData})
            .then(() => {
                alert('salio bien')
            })
            .catch(err => {
                // showError()
                console.log(err)
            })

        setFamily({
            ...family,
            familyMembers: memberFamilyData
        })
    }
    const handleDeletePets = (e) => {
        const memberPetData = family.pets.filter(item => {
            if(item.name !== e.name) {
                return item
            }
        })

        FamiliesService.updatefamily(session?.token, family._id, {...family, pets: memberPetData})
            .then(() => {
                alert('salio bien')
            })
            .catch(err => {
                // showError()
                console.log(err)
            })

        setFamily({
            ...family,
            pets: memberPetData
        })
    }
    const handleDeleteExternalStudents = (e) => {
        const externalStudentData = family.noRedLeafStudents.filter(item => {
            if(item.name !== e.name) {
                return item
            }
        })

        FamiliesService.updatefamily(session?.token, family._id, {...family, noRedLeafStudents: externalStudentData})
            .then(() => {
                alert('salio bien')
            })
            .catch(err => {
                // showError()
                console.log(err)
            })

        setFamily({
            ...family,
            noRedLeafStudents: externalStudentData
        })
    }
    const handleDeleteTenants = (e) => {
        const tenantData = family.tenantList.filter(item => {
            if(item.firstName !== e.firstName) {
                return item
            }
        })

        FamiliesService.updatefamily(session?.token, family._id, {...family, tenantList: tenantData})
            .then(() => {
                alert('salio bien')
            })
            .catch(err => {
                // showError()
                console.log(err)
            })

        setFamily({
            ...family,
            tenantList: tenantData
        })
    }

    const handleEditData = (data) => {
        setEditData(data)
        setShowEditFamilyMembersModal(true)
    }

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
                    <Gallery images={familyPictures}/>
                </FormGroup>
            </div>
            <FormGroup title="Family">
                <Panel header="Members of the family" toggleable>
                    <Table
                        edit={handleEditData}
                        name="Family members"
                        columns={familyMembersColumn}
                        content={familyMembers}
                        create={() => { setShowCreateFamilyMembersModal(true) }}
                        onDelete={handleDeleteFamilyMembers}
                    />
                </Panel>
                <Panel header="Pets" toggleable style={{ marginTop: '3rem' }}>
                    <Table
                        // edit={(e) => editData(e)}
                        name="Pets"
                        columns={petsColumns}
                        content={pets}
                        create={() => { setShowPetsModal(true) }}
                        onDelete={handleDeletePets}
                    />
                </Panel>
                <Panel header="External Students" toggleable style={{ marginTop: '3rem' }}>
                    <Table
                        edit={(e) => console.log(e)}
                        name="External Students"
                        columns={externalStudentsColumns}
                        content={externalStudents}
                        create={() => { setShowExternalStudentsModal(true) }}
                        onDelete={handleDeleteExternalStudents}
                    />
                </Panel>
                <Panel header="Tenants" toggleable style={{ marginTop: '3rem' }}>
                    <Table
                        edit={(e) => console.log(e)}
                        name="Tenants"
                        columns={tenantsColumns}
                        content={tenants}
                        create={() => { setShowTenantsModal(true) }}
                        onDelete={handleDeleteTenants}
                    />
                </Panel>
            </FormGroup>
            <FormGroup title="Schools">
                <Table name="Schools"
                    edit={(e) => console.log(e)}
                    columns={schoolsColumns}
                    content={schools}
                    create={() => { setShowSchoolModal(true) }}
                    // onDelete={handleDelete}
                />
            </FormGroup>
            {/* Modals */}
            {/* Family members*/}
            <Modal draggable={false}  visible={showCreateFamilyMembersModal} setVisible={setShowCreateFamilyMembersModal} title='Create family members' icon='family-members'>
                <FamilyMemberModal
                    onSubmit={(e) => { handleCreateFamilyMembers(e) }}
                    setFamilyData={setFamily}
                    familyData={family}
                />
            </Modal>
            <Modal
                draggable={false}
                visible={showEditFamilyMembersModal}
                setVisible={setShowEditFamilyMembersModal}
                title='Edit family members'
                icon='family-members'
            >
                <FamilyMemberModal
                    onSubmit={(e) => { handleCreateFamilyMembers(e) }}
                    setFamilyData={setFamily}
                    familyData={family}
                    data={editData}
                />
            </Modal>
            <Modal draggable={false} visible={showPetsModal} setVisible={setShowPetsModal} title='Create family pet' icon="pet">
                <PetMemberModal
                    setFamilyData={setFamily}
                    familyData={family}
                    setShowPetsModal={setShowPetsModal}
                />
            </Modal>
            <Modal draggable={false} visible={showExternalStudentsModal} setVisible={setShowExternalStudentsModal} title='Create external student' icon="external-student">
                <ExternalStudentsModal
                    setFamilyData={setFamily}
                    familyData={family}
                    setShowExternalStudentsModal={setShowExternalStudentsModal}
                />
            </Modal>
            <Modal draggable={false} visible={showTenantsModal} setVisible={setShowTenantsModal} title="Create Tenants" icon='tenant'>
                <TenantsModal
                    setFamilyData={setFamily}
                    familyData={family}
                    setShowTenantsModal={setShowTenantsModal}
                />
            </Modal>
            <Modal draggable={false} visible={showSchoolModal} setVisible={setShowSchoolModal} title="Create school" icon="school">
                <p>school form</p>
            </Modal>
        </>
    )
}
