import React, { useContext, useState } from 'react'
//components
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
//styles
import classes from 'styles/Families/Forms.module.scss'
//Context
import { FamilyContext } from 'context/FamilyContext'

export default function FamilyForm() {
    const { family } = useContext(FamilyContext)
    //modals
    const [showFamilyMembersModal, setShowFamilyMembersModal] = useState(false)
    const [showPetsModal, setShowPetsModal] = useState(false)
    const [showExternalStudentsModal, setShowExternalStudentsModal] = useState(false)
    const [showTenantsModal, setShowTenantsModal] = useState(false)
    const [showSchoolModal, setShowSchoolModal] = useState(false)

    const [rules, setRules] = useState([])
    const [localCoordinator, setLocalCoordinator] = useState('')
    const [welcomeLetter, setWelcomeLetter] = useState(family.welcomeLetter)
    //data fot datatables
    
    const familyMembers = family.familyMembers.map(({ firstName, lastName, birthDate, gender }) => {
        return (
            {
                firstName,
                lastName,
                birthDate,
                age: 17,
                gender
            }
        )
    })
    const pets = family.pets.map(({name, age, race, remarks, type}) => {
        return(
            {
                name,
                age,
                breed: race,
                remarks,
                type
            }
        )
    })
    const externalStudents = []
    const tenants = []
    const schools = []
    const genders= ['Male', 'Female', 'Other', 'No binary']
    //columns for datatables

    const familyMembersColumn = [
        {
            field: "firstName",
            header: "FirstName",
            filterPlaceholder: "Search by firstName"
        },
        {
            field: "lastName",
            header: "LastName",
            filterPlaceholder: "Search by lastName"
        },
        {
            field: "birthDate",
            header: "birth date",
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
            field: "length",
            header: "Length to stay",
            filterPlaceholder: "Search by interval"
        },
    ]
    const tenantsColumns = [
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
            field: "gender",
            header: "Gender",
            filterPlaceholder: "Search by gender"
        },
    ]
    const schoolsColumns = [
        {
            field: "school",
            header: "School/College",
            filterPlaceholder: "Search by name"
        },
        {
            field: "course",
            header: "Course",
            filterPlaceholder: "Search by course"
        },
        {
            field: "type",
            header: "Type",
            filterPlaceholder: "Search by type"
        }, 
    ]
    const rulesList = ['No smoke', 'No drink alcohol']
    const handleSubmit = (e) => {
        e.preventdefault()
    }
    return (
        <>
        <form onSubmit={e => { handleSubmit(e) }}>
            <FormHeader title="Family" />
            <FormGroup title='Welcome'>
            <div className={classes.form_container_multiple}>
                <InputContainer label='Welcome video'>
                    <video width="100%" height="auto" controls>
                        <source src={family.video} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                    <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', marginTop: '1em'}}>
                        <p>Add new welcome video</p>
                        <FileUpload mode="basic" name="welcomeVideo" url="https://primefaces.org/primereact/showcase/upload.php" accept="video/*" maxFileSize={1000000} />
                    </div>
                </InputContainer>
                <div>
                    <InputContainer label="Welcome letter">
                    <InputTextarea  rows={5} cols={30} autoResize value={welcomeLetter} onChange={e => {setWelcomeLetter(e.target.value)}} />
                    </InputContainer>
                    <div>
                        <p>This family is receiving: </p>
                        <InputContainer label="Genders">
                            <MultiSelect placeholder="Select gender" options={genders} />
                        </InputContainer>
                        
                    </div>
                </div>
            </div>
            <FormGroup title='Rules'>
                <InputContainer label='Rules'>
                    <MultiSelect options={rulesList} value={rules} onChange={e => {setRules(e.target.value)}} placeholder="Select a rule"/>
                </InputContainer>
                <InputContainer label='Local Coordinator'>
                    <InputText placeholder="Local coordinator" value={localCoordinator} onChange={e => {setLocalCoordinator(e.target.value)}}></InputText>
                </InputContainer>         
            </FormGroup>
            </FormGroup>
           </form>
            <FormGroup title="Family">
                <Panel header="Members of the family" toggleable>
                    <Table name="Family members" columns={familyMembersColumn} content={familyMembers} create={() => {setShowFamilyMembersModal(true)}}/>
                </Panel>
                <Panel header="Pets" toggleable style={{marginTop: '3rem'}}>
                    <Table name="Pets" columns={petsColumns} content={pets} create={() => {setShowPetsModal(true)}}/>
                </Panel>
                <Panel header="External Students" toggleable style={{marginTop: '3rem'}}>
                    <Table name="External Students" columns={externalStudentsColumns} content={externalStudents} create={()=> {setShowExternalStudentsModal(true)}}/>
                </Panel>
                <Panel header="Tenants" toggleable style={{marginTop: '3rem'}}>
                    <Table name="Tenants" columns={tenantsColumns} content={tenants} create={() => {setShowTenantsModal(true)}}/>
                </Panel>
            </FormGroup>
            <FormGroup title="Schools">
                <Table name="Schools" columns={schoolsColumns} content={schools} create={() => {setShowSchoolModal(true)}}/>
            </FormGroup>
            {/* Modals */}
            <Modal visible={showFamilyMembersModal} setVisible={setShowFamilyMembersModal} title='Create family members' icon='family-members'>
                <p>family member form</p>
            </Modal>
            <Modal visible={showPetsModal} setVisible={setShowPetsModal} title='Create family pet' icon="pet">
                <p>Pets form</p>
            </Modal>
            <Modal visible={showExternalStudentsModal} setVisible={setShowExternalStudentsModal} title='Create external student' icon="external-student">
                <p>External students form</p>
            </Modal>
            <Modal visible={showTenantsModal} setVisible= {setShowTenantsModal} title="Create Tenants" icon='tenant'>
            <p>tenant form</p>
            </Modal>
            <Modal visible={showSchoolModal} setVisible= {setShowSchoolModal} title="Create school" icon="school">
                <p>school form</p>
            </Modal>
        </>
    )
}
