import React, { useContext, useState, useEffect, useMemo } from 'react'
//components
import FileUploader from 'components/UI/Atoms/FileUploader'
import FormGroup from 'components/UI/Molecules/FormGroup'
import Modal from 'components/UI/Molecules/Modal'
import FormHeader from 'components/UI/Molecules/FormHeader'
import Table from 'components/UI/Organism/Table'
import Gallery from 'components/UI/Organism/Gallery'
import FamilyMemberModal from 'components/Families/modals/FamilyMemberModal'
import PetMemberModal from 'components/Families/modals/PetMemberModal'
import ExternalStudentsModal from 'components/Families/modals/ExternalStudentsModal'
import InputContainer from 'components/UI/Molecules/InputContainer'
import TenantsModal from 'components/Families/modals/TenantsModal'
import SchoolsModal from 'components/Families/modals/SchoolsModal'
import { Panel } from 'primereact/panel';
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { confirmDialog } from 'primereact/confirmdialog'
import { Dropdown } from 'primereact/dropdown'
//styles
import classes from 'styles/Families/Forms.module.scss'
//services
import FamiliesService from 'services/Families'
import GenericsService from 'services/Generics'
//Context
import { FamilyContext } from 'context/FamilyContext'
//utils
import { externalStudentsColumns, familyMembersColumn, petsColumns, schoolsColumns, tenantsColumns } from 'utils/constants'
import {dateToDayAndMonth,formatDate,getAge} from 'utils/formatDate'
import { useSession } from 'next-auth/client'

const editContext = {
    FAMILY_MEMBER: 'FAMILY_MEMBER',
    PET: 'PET',
    EXTERNAL_STUDENT: 'EXTERNAL_STUDENT',
    TENANT: 'TENANT',
    SCHOOLS: 'SCHOOLS'
}

const arrayDataContent = {
    FAMILY_MEMBER: 'familyMembers',
    PET: 'pets',
    EXTERNAL_STUDENT: 'noRedLeafStudents',
    TENANT: 'tenantList',
    SCHOOLS: 'schools'
}

export default function FamilyForm() {
    const { family, getFamily } = useContext(FamilyContext)
    const [session,] = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [newVideoURL, setNewVideoURl] = useState<string>('')
    
    //modals
    const [showFamilyMembersModal, setShowFamilyMembersModal] = useState(false)
    const [showPetsModal, setShowPetsModal] = useState(false)
    const [showExternalStudentsModal, setShowExternalStudentsModal] = useState(false)
    const [showTenantsModal, setShowTenantsModal] = useState(false)
    const [showSchoolModal, setShowSchoolModal] = useState(false)
    const [editData, setEditData] = useState(null);

    const [gendersInput, setGendersInput] = useState([])
    const [programsInput, setProgramsInput] = useState([])
    const [rulesInput, setRulesInput] = useState([])
    const [localManagerInput, setLocalManagerInput] = useState([])
    const [rules, setRules] = useState(family.rulesForStudents)
    const [localCoordinator, setLocalCoordinator] = useState(family.familyInternalData.localManager || {})
    const [welcomeLetter, setWelcomeLetter] = useState(family.welcomeLetter)
    const [familyPictures, setFamilyPictures] = useState(
        family && family.familyPictures 
            ? family.familyPictures.filter(pic => pic !== null).map((pic,id) => {
                return { src: pic.picture, alt: pic.caption, id  }
            })
            : []
    )
    const [welcomeStudentGenders, setWelcomeStudentGenders] = useState(family.welcomeStudentGenders)
    const [familyPrograms, setFamilyPrograms] = useState(family.familyInternalData.availablePrograms || [])
    const [relationships, setRelationships] = useState([])

    const [familyVideo, setFamilyVideo] = useState(family.video)
    const [newFamilyVideo, setNewFamilyVideo] = useState(null)

    const familyMembers = useMemo(() => family.familyMembers.map(member => ({
        ...member,
        firstName: member.firstName,
        lastName: member.lastName,
        birthDate: formatDate(member.birthDate),
        age: getAge(member.birthDate),
        gender: member.gender?.name,
        situation: member.situation,
        _id: member._id
    })), [family])

    const pets = useMemo(() => family.pets.map(({ _id, name, age, race, remarks, type, isHipoalergenic }) => ({
        name,
        age,
        race,
        remarks,
        type: type.name,
        isHipoalergenic,
        _id
    })), [family])

    const externalStudents = useMemo(() => family.noRedLeafStudents.map(({ _id, name, nationality, gender, birthDate, stayingSince, stayingUntil }) => ({
        name,
        nationality: nationality.name,
        gender: gender.name,
        age: getAge(birthDate),
        lengthToStay: `${dateToDayAndMonth(stayingSince)} to ${dateToDayAndMonth(stayingUntil)}`,
        _id
    })), [family])

    const tenants = useMemo(() => family?.tenantList?.map(({ _id, firstName, lastName, gender, birthDate, occupation, }) => ({
        firstName,
        lastName,
        gender: gender.name,
        birthDate: formatDate(birthDate),
        occupation: occupation.name,
        _id
    })), [family])

    const schools = useMemo(() => family.schools.map(({school, transports})=> ({
        school: school.name,
        type: school.type,
        _id: school._id
    })), [family])

    const renderVideo = (event) => {
        const video = URL.createObjectURL(event.target.files[0])
        setNewVideoURl(video)
        setNewFamilyVideo(event.target.files[0])
    }
    const handleSubmit = () => {

        if(newFamilyVideo) {
            const formData = new FormData()
            formData.append('video', newFamilyVideo)
            FamiliesService.updateFamilyVideo(session?.token, family._id, formData)
                .then(response => {
                    setNewFamilyVideo(null)
                })
                .catch(error => console.error(error))
        }

        FamiliesService.updatefamily(session?.token, family._id, {
            welcomeLetter,
            welcomeStudentGenders,
            rulesForStudents: rules,
            familyInternalData: {
                ...family.familyInternalData,
                localManager: localCoordinator,
                availablePrograms: familyPrograms
            }
        })
            .then(() => {
                getFamily()
            })
            .catch(err => {
                console.error(err)
            })
    }


    useEffect(() => {
        (async () => {
            const { genders, familyRules, local_manager, program } = await GenericsService.getAll(session?.token,['program', 'genders', 'familyRules', 'local-manager'])
            setProgramsInput(program)
            setLocalManagerInput(local_manager)
            setGendersInput(genders)
            setRulesInput(familyRules)
            return(
                ()=> {}
            )
        })()
    }, [session])

    const handleDeleteFamilyMembers = (e) => {
        confirmDialog({
            message: `Are you sure you want to delete this family member?`,
            header: 'Confirm Delete Family Member',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const memberFamilyData = family.familyMembers.filter(item => {
                    if(item.firstName !== e.firstName) {
                        return item
                    }
                })
        
                FamiliesService.updatefamily(session?.token, family._id, {...family, familyMembers: memberFamilyData})
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        // showError()
                        console.error(err)
                    })
            },
            reject: () => {}
        });
    }
    
    const handleDeletePets = (e) => {
        confirmDialog({
            message: `Are you sure you want to delete this pet?`,
            header: 'Confirm Delete Pet',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const memberPetData = family.pets.filter(item => {
                    if(item.name !== e.name) {
                        return item
                    }
                })
        
                FamiliesService.updatefamily(session?.token, family._id, {...family, pets: memberPetData})
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        // showError()
                        console.error(err)
                    })
            },
            reject: () => {}
        });
        
    }
    const handleDeleteExternalStudents = (e) => {
        confirmDialog({
            message: `Are you sure you want to delete this external student?`,
            header: 'Confirm Delete External Student',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const externalStudentData = family.noRedLeafStudents.filter(item => {
                    if(item.name !== e.name) {
                        return item
                    }
                })
        
                FamiliesService.updatefamily(session?.token, family._id, {...family, noRedLeafStudents: externalStudentData})
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        // showError()
                        console.error(err)
                    })
            },
            reject: () => {}
        });        
    }
    const handleDeleteTenants = (e) => {
        confirmDialog({
            message: `Are you sure you want to delete this tenant?`,
            header: 'Confirm Delete Tenant',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const tenantData = family.tenantList.filter(item => {
                    if(item.firstName !== e.firstName) {
                        return item
                    }
                })
        
                FamiliesService.updatefamily(session?.token, family._id, {...family, tenantList: tenantData})
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        // showError()
                        console.error(err)
                    })
            },
            reject: () => {}
        });         
    }

    const handleDeleteSchool = (e) => {
        confirmDialog({
            message: `Are you sure you want to delete this school?`,
            header: 'Confirm Delete School',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const schoolData = family.schools.filter(item => item.school._id !== e._id)
        
                FamiliesService.updatefamily(session?.token, family._id, {...family, schools: schoolData})
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        // showError()
                        console.error(err)
                    })
            },
            reject: () => {}
        });         
    }

    const handleEditData = (data, context) => {
        setEditData(data)
        if(context === editContext.FAMILY_MEMBER)setShowFamilyMembersModal(true)
        if(context === editContext.PET)setShowPetsModal(true)
        if(context === editContext.EXTERNAL_STUDENT)setShowExternalStudentsModal(true)
        if(context === editContext.TENANT)setShowTenantsModal(true)
        if(context === editContext.SCHOOLS)setShowSchoolModal(true)
    }

    const handleDeleteMany = (deleteData, context) => {
        confirmDialog({
            message: `Are you sure you want to delete all of these?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const newData = context === editContext.SCHOOLS
                    ?   family[arrayDataContent[context]].filter(item => !deleteData.includes(item.school._id))
                    :   family[arrayDataContent[context]].filter(item => !deleteData.includes(item._id))

                FamiliesService.updatefamily(session?.token, family._id, {...family, [arrayDataContent[context]]: newData})
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        // showError()
                        console.error(err)
                    })
            },
            reject: () => {}
        }); 
    }

    useEffect(() => {
        setFamilyVideo(family.video)
    }, [family.video])

    useEffect(() => {
        GenericsService.getGeneric(session?.token, 'family-relationship')
            .then(response => setRelationships(response))
            .catch(error => console.error(error))
    }, [session])

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                <FormHeader title="Family" isLoading={isLoading} onClick={handleSubmit}/>
                <FormGroup title='Welcome'>
                    <div className={classes.form_container_multiple}>
                        {newVideoURL && <video width="100%" height="auto" controls>
                            <source src={newVideoURL} />
                        </video>}
                        {family.home.video && newVideoURL === '' && <video width="100%" height="auto" controls>
                            <source src={familyVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>}

                        {!family.home.video && !newVideoURL && <img style={{ borderRadius: '14px', width: '100%' }} src="/assets/img/notVideoFound.svg" alt='You have not uploaded a video yet' />}
                            <div>
                        <InputContainer label='Add new Welcome video'>
                            <FileUploader 
                                id="welcomeVideo"
                                name="welcomeVideo"
                                accept="video/*"
                                onChange={(event) => renderVideo(event)}
                                placeholder="Upload welcome video"
                            />
                        </InputContainer>
                            </div>
                            <InputContainer label="Welcome letter">
                                <InputTextarea
                                    autoResize
                                    rows={5}
                                    cols={30}
                                    value={welcomeLetter}
                                    onChange={e => { setWelcomeLetter(e.target.value) }}
                                />
                            </InputContainer>
                            <div>
                                <p>This family is receiving: </p>
                                <InputContainer label="Genders">
                                    <MultiSelect
                                        placeholder="Select gender"
                                        options={gendersInput}
                                        optionLabel='name'
                                        selectedItemTemplate={item => item ? `${item?.name}, ` : ''}
                                        value={welcomeStudentGenders}
                                        onChange={e => setWelcomeStudentGenders(e.value)}
                                    />
                                </InputContainer>
                            <div>
                                <p>Family Programs: </p>
                                <InputContainer label="Programs">
                                    <MultiSelect
                                        placeholder="Select programs"
                                        options={programsInput}
                                        optionLabel='name'
                                        selectedItemTemplate={item => item ? `${item?.name}, ` : ''}
                                        value={familyPrograms}
                                        onChange={e => setFamilyPrograms(e.value)}
                                    />
                                </InputContainer>

                            </div>
                        </div>
                    </div>
                </FormGroup>
            </form>
            <div className={classes.form_container_multiple}>
                <FormGroup title='Rules'>
                    <InputContainer label='Rules'>
                        <MultiSelect 
                            options={rulesInput}
                            optionLabel='name'
                            value={rules}
                            selectedItemTemplate={item => item ? `${item?.name}, ` : ''}
                            onChange={e => setRules(e.value)}
                            placeholder="Select a rule"
                        />
                    </InputContainer>
                    <InputContainer label='Local Coordinator'>
                        <Dropdown
                            options={localManagerInput}
                            placeholder="Local coordinator"
                            optionLabel='name'
                            value={localCoordinator}
                            onChange={e => setLocalCoordinator(e.target.value)}
                        />
                    </InputContainer>
                </FormGroup>
                <FormGroup title='Family photos'>
                    <Gallery images={familyPictures} options/>
                </FormGroup>
            </div>
            <FormGroup title="Family">
                <Panel header="Members of the family" toggleable>
                    <Table
                        edit={data => handleEditData(family.familyMembers.find(item => item._id === data._id), editContext.FAMILY_MEMBER)}
                        name="Family members"
                        columns={familyMembersColumn}
                        content={familyMembers}
                        create={() => setShowFamilyMembersModal(true)}
                        onDelete={handleDeleteFamilyMembers}
                        deleteMany={data => handleDeleteMany(data.map(item => item._id), editContext.FAMILY_MEMBER)}
                        defaultSortField='firstName'
                    />
                </Panel>
                <Panel header="Pets" toggleable style={{ marginTop: '3rem' }}>
                    <Table
                        edit={data => handleEditData(family.pets.find(pet => pet._id === data._id), editContext.PET)}
                        name="Pets"
                        columns={petsColumns}
                        content={pets}
                        create={() => setShowPetsModal(true)}
                        deleteMany={data => handleDeleteMany(data.map(item => item._id), editContext.PET)}
                        onDelete={handleDeletePets}
                        defaultSortField='name'
                    />
                </Panel>
                <Panel header="External Students" toggleable style={{ marginTop: '3rem' }}>
                    <Table
                        edit={data => handleEditData(family.noRedLeafStudents.find(student => student._id === data._id), editContext.EXTERNAL_STUDENT)}
                        name="External Students"
                        columns={externalStudentsColumns}
                        content={externalStudents}
                        create={() => setShowExternalStudentsModal(true)}
                        deleteMany={data => handleDeleteMany(data.map(item => item._id), editContext.EXTERNAL_STUDENT)}
                        onDelete={handleDeleteExternalStudents}
                        defaultSortField='name'
                    />
                </Panel>
                <Panel header="Tenants" toggleable style={{ marginTop: '3rem' }}>
                    <Table
                        edit={data => handleEditData(family.tenantList.find(tenant => tenant._id === data._id), editContext.TENANT)}
                        name="Tenants"
                        columns={tenantsColumns}
                        content={tenants}
                        create={() => { setShowTenantsModal(true) }}
                        deleteMany={data => handleDeleteMany(data.map(item => item._id), editContext.TENANT)}
                        onDelete={handleDeleteTenants}
                        defaultSortField='firstName'
                    />
                </Panel>
            </FormGroup>
            <FormGroup title="Schools">
                <Table name="Schools"
                    edit={data => handleEditData(family.schools.find(school => school.school._id === data._id), editContext.SCHOOLS)}
                    columns={schoolsColumns}
                    content={schools}
                    create={() => setShowSchoolModal(true)}
                    deleteMany={data => handleDeleteMany(data.map(item => item._id), editContext.SCHOOLS)}
                    onDelete={handleDeleteSchool}
                    defaultSortField='school'
                />
            </FormGroup>
            {/* Modals */}
            {/* Family members*/}
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
                        familyRelationship: editData && editData?.familyRelationship 
                            ? relationships.find(item => item._id === editData?.familyRelationship[0]._id)
                            : undefined
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
                icon="pet"
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
            <Modal
                draggable={false} 
                visible={showExternalStudentsModal} 
                setVisible={() => {
                    setShowExternalStudentsModal(false)
                    setEditData(null)
                }} 
                title={editData ? 'Update external student' : 'Create external student'} 
                icon="external-student"
            >
                <ExternalStudentsModal
                    familyData={family}
                    closeDialog={() => {
                        setShowExternalStudentsModal(false)
                        setEditData(null)
                    }}
                    studentData={editData}
                />
            </Modal>
            <Modal
                draggable={false} 
                visible={showTenantsModal} 
                setVisible={() => {
                    setShowTenantsModal(false)
                    setEditData(null)
                }} 
                title={editData ? "Update Tenants" : "Create Tenants"} 
                icon='tenant'
            >
                <TenantsModal
                    familyData={family}
                    closeDialog={() => {
                        setShowTenantsModal(false)
                        setEditData(null)
                    }}
                    tenantData={editData}
                />
            </Modal>
            <Modal
                draggable={false} 
                visible={showSchoolModal} 
                setVisible={() => {
                    setShowSchoolModal(false)
                    setEditData(null)
                }} 
                title={editData ? "Update school" : "Create school"} 
                icon="school"
            >
                <SchoolsModal
                    familyData={family}
                    closeDialog={() => {
                        setShowSchoolModal(false)
                        setEditData(null)
                    }}
                    schoolData={editData}
                />
            </Modal>
        </>
    )
}
