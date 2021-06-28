import React, { useRef, useState } from 'react'
//components
import FormGroup from 'components/UI/Molecules/FormGroup'
import Observations from 'components/UI/Organism/Observations'
import { Calendar } from 'primereact/calendar';
import InputContainer from 'components/UI/Molecules/InputContainer'
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
//styles
import classes from 'styles/Families/Forms.module.scss'

export default function ActivityForm() {
    const [lastUpdate, setLastUpdate] = useState(null)
    const [dateVerification, setDateVerification] = useState(null)
    const [dateRegisterSystem, setDateRegisterSystem] = useState(null)
    const [workshops,setWorkshops] = useState([])
    const dt = useRef()
    return (
        <div>
            <FormGroup title="Tracing">
                <div className={classes.form_container_three}>
                    <InputContainer label="Last update">
                        <Calendar value={lastUpdate} onChange={(e) => setLastUpdate(e.value)} showButtonBar showIcon></Calendar>
                    </InputContainer>
                    <InputContainer label="Date of verification">
                        <Calendar value={dateVerification} onChange={(e) => setDateVerification(e.value)} showButtonBar showIcon></Calendar>
                    </InputContainer>
                    <InputContainer label="Date of registration in the system ">
                        <Calendar value={dateRegisterSystem} onChange={(e) => setDateRegisterSystem(e.value)} showButtonBar showIcon></Calendar>
                    </InputContainer>
                </div>
            </FormGroup>
            <div className={classes.activity_layout}>
               <div>
               <FormGroup title="Workshops">
                <DataTable 
                    ref={dt}
                    rowHover
                    emptyMessage="No workshops found"
                    value={workshops}>
                <Column selectionMode="multiple" style={{ width: "3em" }} />
                </DataTable >
                </FormGroup>
                <FormGroup title="Follow-up actions ">
                <DataTable 
                    ref={dt}
                    rowHover
                    emptyMessage="No Follow-up actions  found"
                    value={workshops}>
                <Column selectionMode="multiple" style={{ width: "3em" }} />
                </DataTable >
                </FormGroup>
               </div>
                <FormGroup title="Internal observations">
                    <Observations />
                </FormGroup>
            </div>

        </div>
    )
}
