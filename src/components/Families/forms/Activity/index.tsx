import React, { useRef, useState, useContext } from 'react'
//components
import FormHeader from 'components/UI/Molecules/FormHeader'
import FormGroup from 'components/UI/Molecules/FormGroup'
import Observations from 'components/UI/Organism/Observations'
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast'
import {Checkbox} from 'primereact/checkbox';
import InputContainer from 'components/UI/Molecules/InputContainer'
import Table from 'components/UI/Organism/Table'
import Modal from 'components/UI/Molecules/Modal'
import { InputText } from 'primereact/inputtext';
import WorkshopForm from 'components/Families/modals/WorkshopForm'
import FollowupActionsForm from 'components/Families/modals/FollowupActionsForm'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
//styles
import classes from 'styles/Families/Forms.module.scss'
//context
import { FamilyContext } from 'context/FamilyContext'
//services
import FamiliesServices from 'services/Families'
//utils
import {formatDate} from 'utils/formatDate'


export default function ActivityForm() {
    const { family,setFamily } = useContext(FamilyContext)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [dateVerification, setDateVerification] = useState(null)
    const [dateRegisterSystem, setDateRegisterSystem] = useState(null)
    const [followUpActions, setFollowUpActions] = useState(family.familyInternalData.followUpActions || [])
    const [workWithHostCompany, setWorkWithHostCompany] = useState(false)
    const [editableWorkshop, setEditableWorkshop] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    //modals
    const [showCreateWorkshopModal, setShowCreateWorkshopModal] = useState(false)
    const [showEditWorkshopModal, setShowEditWorkshopModal] = useState(false)
    const [showCreateFollowupActionsModal, setShowCreateFollowupActionsModal] = useState(false)
    const [workshops, setWorkshops] = useState(family.familyInternalData.workshopsAttended)
    const toast = useRef(null)
    const formatedWorkshops = workshops.map((workshop)=> {
        return (
            {
                ...workshop,
                date: formatDate(workshop.date)
            }
        )
    })
    const formatedFollowUpActions = followUpActions.map((action)=> {
        return(
            {
                ...action,
                date: formatDate(action.date)
            }
        )
    })
    const showSuccess = (msg) => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:msg, life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:'An error has ocurred', life: 3000});
    }
    const workshopsColumns = [
        { field: 'name', header: 'Name', filterPlaceholder: 'Search by name' },
        { field: 'date', header: 'Date', filterPlaceholder: 'Search by date' },
        { field: 'remarks', header: 'Remarks', filterPlaceholder: 'Search by remark' },    
    ]
    const followActionsColumns = [
        { field: 'actionType', header: 'Action Type', filterPlaceholder: 'Search by type' },
        { field: 'date', header: 'Date', filterPlaceholder: 'Search by date' },
         { field: 'comments', header: 'Comments', filterPlaceholder: 'Search by comments' },
    ]
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const createFollowUpActions = (data) => {
        setShowCreateFollowupActionsModal(false)
        const newFollowUpActions = {
            familyInternalData: {
                followUpActions: [
                    ...family.familyInternalData.followUpActions,
                     data
                    ]
            }
        }
        FamiliesServices.updatefamily(family._id, newFollowUpActions)        
        .then(()=> {
            setFamily({...family,newFollowUpActions})
            showSuccess('Follow Up Actions Successfully created')
        })
        .catch(err => {
            showError()
            console.log(err)
        })
    }
    const deleteFollowUpActions = async (data) => {
        const updatedActions = await family.familyInternalData.followUpActions.filter(action => action._id !== data._id)
        const newFollowUpActions = {
            familyInternalData: {
                followUpActions: updatedActions
            }
        }
        FamiliesServices.updatefamily(family._id, newFollowUpActions)        
        .then(()=> {
            setFamily({...family,familyInternalData: {...family.familyInternalData,followUpActions: updatedActions }})
            showSuccess('Follow Up Action Successfully deleted')
        })
        .catch(err => {
            showError()
            console.log(err)
        })

    }
    const createWorkshop = (data) => {
        setShowCreateWorkshopModal(false)
        setWorkshops([...workshops, data])
    }
    const editWorkshops = (data) => {
        console.log(data)
        setEditableWorkshop(data)
        setShowEditWorkshopModal(true)
    }
    return (
        <div>
            <form onSubmit={e => { handleSubmit(e) }}>
                <FormHeader title='Activity' />
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
                        <Table 
                            name='Workshops' 
                            content={formatedWorkshops}
                            columns={workshopsColumns}
                            create={() => { setShowCreateWorkshopModal(true) }}
                            edit={editWorkshops}
                        />
                    </FormGroup>
                    <FormGroup title="Follow-up actions ">
                        <Table 
                            name='Follow-up actions'
                            content={formatedFollowUpActions}
                            columns={followActionsColumns}
                            create={() => { setShowCreateFollowupActionsModal(true) }}
                            onDelete={deleteFollowUpActions}
                        />
                    </FormGroup>
                </div>
                <FormGroup title="Internal observations">
                    <Observations />
                </FormGroup>
            </div>
            <Modal visible={showCreateWorkshopModal} setVisible={setShowCreateWorkshopModal} title="Create workshop" icon="workshop">
                <WorkshopForm onSubmit={createWorkshop}/>
            </Modal>
            <Modal visible={showEditWorkshopModal} setVisible={setShowEditWorkshopModal} title="Edit workshop" icon="workshop">
                <WorkshopForm onSubmit={editWorkshops} data={editableWorkshop}/>
            </Modal>
            <Modal visible={showCreateFollowupActionsModal} setVisible={setShowCreateFollowupActionsModal} title="Create Follow-up Action" icon="follow-up">
                <FollowupActionsForm onSubmit={createFollowUpActions}/>
            </Modal>
            <Toast ref={toast}/>
        </div>
    )
}
