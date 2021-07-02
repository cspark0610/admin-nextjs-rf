import React, { useRef, useState } from 'react'
//components
import FormHeader from 'components/UI/Molecules/FormHeader'
import FormGroup from 'components/UI/Molecules/FormGroup'
import Observations from 'components/UI/Organism/Observations'
import { Calendar } from 'primereact/calendar';
import InputContainer from 'components/UI/Molecules/InputContainer'
import Table from 'components/UI/Organism/Table'

//styles
import classes from 'styles/Families/Forms.module.scss'

export default function ActivityForm() {
    const [lastUpdate, setLastUpdate] = useState(null)
    const [dateVerification, setDateVerification] = useState(null)
    const [dateRegisterSystem, setDateRegisterSystem] = useState(null)
    const [workshops,setWorkshops] = useState([])
    const dt = useRef()

    const data = [{name: 'testo', date: '234234'},{name: 'test', date: '234234'}]
    const workshopsColumns = [
        {field: 'name', header: 'Name', filterPlaceholder: 'Search by name'},
        {field: 'date', header: 'Date', filterPlaceholder: 'Search by date'},
    ]
    const followActionsColumns = [
        {field: 'name', header: 'Name', filterPlaceholder: 'Search by name'},
        {field: 'type', header: 'Type', filterPlaceholder: 'Search by type'},
    ]
    const actionsData = [{name: 'name of action', type: 'a type'},{name: 'another action', type: 'another type'}]
    
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    
    return (
        <div>
        <form onSubmit={e => {handleSubmit(e)}}>
            <FormHeader title='Activities'/>
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
               <FormGroup title="Workshops">
                <Table name='Workshops' content={data} columns={workshopsColumns}/>
                </FormGroup>
                <FormGroup title="Follow-up actions ">
                <Table name='Follow-up actions' content={actionsData}  columns={followActionsColumns} />
                </FormGroup>
               </div>
                <FormGroup title="Internal observations">
                    <Observations />
                </FormGroup>
            </div>
        </div>
    )
}
