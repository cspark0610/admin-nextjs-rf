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
//services
import FamiliesService from 'services/Families'


export default function ActivityForm() {
    const { family } = useContext(FamilyContext)
    const [loading, setLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(new Date(family.updatedAt))
    const [dateVerification, setDateVerification] = useState<any>(new Date(family.familyInternalData.verificationDate )|| null)
    const [dateRegisterSystem, setDateRegisterSystem] = useState(new Date(family.createdAt))
    const [followUpActions, setFollowUpActions] = useState(family.familyInternalData.followUpActions || [])
    const [workshopsAttended, setWorkshopsAttended] = useState(family.familyInternalData.workshopsAttended || [])
    const [workWithHostCompany, setWorkWithHostCompany] = useState(false)
    const [companyName, setCompanyName] = useState(family.familyInternalData.otherCompanyName || '')
    const [beenHostingStudentsSince, setBeenHostingStudentsSince] = useState<any>(family.beenHostingStudentsSince ? new Date(family.beenHostingStudentsSince) : '')
    //modals
    const [showWorkshopsModal, setShowWorkshopsModal] = useState(false)
    const [showFollowupActionsModal, setShowFollowupActionsModal] = useState(false)
    const [workshops, setWorkshops] = useState([])
    const dt = useRef()

    const familiesService = new FamiliesService()

    const data = [{ name: 'testo', date: '234234' }, { name: 'test', date: '234234' }]
    const workshopsColumns = [
        { field: 'name', header: 'Name', filterPlaceholder: 'Search by name' },
        { field: 'date', header: 'Date', filterPlaceholder: 'Search by date' },
    ]
    const followActionsColumns = [
        { field: 'actionType', header: 'Action Type', filterPlaceholder: 'Search by type' },
        { field: 'comments', header: 'Comments', filterPlaceholder: 'Search by comments' },
    ]
    

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            familyInternalData: {
                ...family.familyInternalData,
                verificationDate: dateVerification,
                workedWithOtherCompany: workWithHostCompany,
                otherCompanyName: workWithHostCompany ? companyName : '',
                beenHostingStudentsSince: workWithHostCompany? beenHostingStudentsSince : ''
            }
        }
        console.log(data, family)
        familiesService.updatefamily(family.id, data)
        .then(()=>{
            setLoading(false)
            console.log('success')
        })
        .catch(err =>{
            setLoading(false)
            console.log(err)
        })
    }
   
    return (
        <div>
            <form onSubmit={e => { handleSubmit(e) }}>
                <FormHeader title='Activity' isLoading={loading} />
            </form>
            <FormGroup title="Tracing">
                <div className={classes.form_container_three}>
                    <InputContainer label="Date of registration in the system">
                        <Calendar placeholder="Date of registration in the system" value={dateRegisterSystem} disabled={true} showButtonBar showIcon></Calendar>
                    </InputContainer>
                    <InputContainer label="Last update">
                        <Calendar placeholder='Last update' value={lastUpdate} disabled={true} showButtonBar showIcon></Calendar>
                    </InputContainer>
                    <InputContainer label="Date of verification">
                        <Calendar placeholder='Date of verification' value={dateVerification} onChange={(e) => setDateVerification(e.target.value)} showButtonBar showIcon></Calendar>
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
                                    <InputText placeholder="Company name" value={companyName} onChange={e => {setCompanyName(e.target.value)}} />
                                </InputContainer>

                                <InputContainer label="Since when have you been hosting students?">
                                    <Calendar id="icon" showIcon placeholder="Date" value={beenHostingStudentsSince} onChange={e => {setBeenHostingStudentsSince(e.target.value)}}/>
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
