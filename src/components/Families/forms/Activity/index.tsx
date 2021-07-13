import React, { useRef, useState, useContext } from 'react'
//components
import FormHeader from 'components/UI/Molecules/FormHeader'
import FormGroup from 'components/UI/Molecules/FormGroup'
import Observations from 'components/UI/Organism/Observations'
import { Calendar } from 'primereact/calendar';
import {Checkbox} from 'primereact/checkbox';
import InputContainer from 'components/UI/Molecules/InputContainer'
import Table from 'components/UI/Organism/Table'
import Modal from 'components/UI/Molecules/Modal'
import { InputText } from 'primereact/inputtext';
//styles
import classes from 'styles/Families/Forms.module.scss'
//context
import { FamilyContext } from 'context/FamilyContext'


export default function ActivityForm() {
    const { family } = useContext(FamilyContext)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [dateVerification, setDateVerification] = useState(null)
    const [dateRegisterSystem, setDateRegisterSystem] = useState(null)
    const [followUpActions, setFollowUpActions] = useState(family.familyInternalData.followUpActions || [])
    const [workWithHostCompany, setWorkWithHostCompany] = useState(false)
    //modals
    const [showWorkshopsModal, setShowWorkshopsModal] = useState(false)
    const [showFollowupActionsModal, setShowFollowupActionsModal] = useState(false)
    const [workshops, setWorkshops] = useState([])
    const dt = useRef()

    const data = [{ name: 'testo', date: '234234' }, { name: 'test', date: '234234' }]
    const workshopsColumns = [
        { field: 'name', header: 'Name', filterPlaceholder: 'Search by name' },
        { field: 'date', header: 'Date', filterPlaceholder: 'Search by date' },
    ]
    const followActionsColumns = [
        { field: 'actionType', header: 'Action Type', filterPlaceholder: 'Search by type' },
        { field: 'comments', header: 'Comments', filterPlaceholder: 'Search by comments' },
    ]
    const actionsData = [{ name: 'name of action', type: 'a type' }, { name: 'another action', type: 'another type' }]

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    console.log('actions: ', followUpActions)
    return (
        <div>
            <form onSubmit={e => { handleSubmit(e) }}>
                <FormHeader title='Activities' />
            </form>
            <FormGroup title="Tracing">
                <div className={classes.form_container_three}>
                    <InputContainer label="Last update">
                        <Calendar placeholder='Last update' value={lastUpdate} onChange={(e) => setLastUpdate(e.value)} showButtonBar showIcon></Calendar>
                    </InputContainer>
                    <InputContainer label="Date of verification">
                        <Calendar placeholder='Date of verification' value={dateVerification} onChange={(e) => setDateVerification(e.value)} showButtonBar showIcon></Calendar>
                    </InputContainer>
                    <InputContainer label="Date of registration in the system">
                        <Calendar placeholder="Date of registration in the system" value={dateRegisterSystem} onChange={(e) => setDateRegisterSystem(e.value)} showButtonBar showIcon></Calendar>
                    </InputContainer>
                </div>
            </FormGroup>
            <div className={classes.activity_layout}>
                <div>
                    <InputContainer label="Do you work or have you ever worked with another host family company?">
                    <div>
                        <Checkbox inputId="cb1" checked={workWithHostCompany} onChange={e => {setWorkWithHostCompany(e.checked)}}></Checkbox>
                        <label htmlFor="cb1" className="p-checkbox-label" style={{marginInline:'1em'}}>{workWithHostCompany ? 'Yes' : 'No'}</label>
                    </div>
                    </InputContainer>
                    {workWithHostCompany && <div className={classes.full_width}>
                        <FormGroup title="Company information">
                            <div className={classes.form_container_multiple}>
                                <InputContainer label="Company name">
                                    <InputText placeholder="Company name" />
                                </InputContainer>

                                <InputContainer label="Since when have you been hosting students?">
                                    <Calendar id="icon" showIcon placeholder="Date" />
                                </InputContainer>
                            </div>
                        </FormGroup>
                    </div>}
                    <FormGroup title="Workshops">
                        <Table name='Workshops' content={data} columns={workshopsColumns} create={() => { setShowWorkshopsModal(true) }} />
                    </FormGroup>
                    <FormGroup title="Follow-up actions ">
                        <Table name='Follow-up actions' content={followUpActions} columns={followActionsColumns} create={() => { setShowFollowupActionsModal(true) }} />
                    </FormGroup>
                </div>
                <FormGroup title="Internal observations">
                    <Observations />
                </FormGroup>
            </div>
            <Modal visible={showWorkshopsModal} setVisible={setShowWorkshopsModal} title="Create workshop" icon="workshop">
                <InputContainer label="Workshop name">
                    <InputText placeholder="Workshop name" />
                </InputContainer>
                <InputContainer label="Date of verification">
                    <Calendar placeholder='Date of verification' showIcon />
                </InputContainer>
            </Modal>
            <Modal visible={showFollowupActionsModal} setVisible={setShowFollowupActionsModal} title="Create Follow-up Action" icon="follow-up">
                <p>follow up actions form</p>
            </Modal>
        </div>
    )
}
