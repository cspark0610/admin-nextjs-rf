import React, { useRef, useState, useContext } from 'react'
//components
import FormHeader from 'components/UI/Molecules/FormHeader'
import FormGroup from 'components/UI/Molecules/FormGroup'
import Observations from 'components/UI/Organism/Observations'
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast'
import {Checkbox} from 'primereact/checkbox';
import { confirmDialog } from 'primereact/confirmdialog';
import InputContainer from 'components/UI/Molecules/InputContainer'
import Table from 'components/UI/Organism/Table'
import Modal from 'components/UI/Molecules/Modal'
import { InputText } from 'primereact/inputtext';
import WorkshopForm from 'components/Families/modals/WorkshopForm'
import FollowupActionsForm from 'components/Families/modals/FollowupActionsForm'
//styles
import classes from 'styles/Families/Forms.module.scss'
//context
import { FamilyContext } from 'context/FamilyContext'
//services
import FamiliesServices from 'services/Families'
//utils
import {formatDate} from 'utils/formatDate'
import {general} from 'utils/calendarRange'
import { useSession } from 'next-auth/client';


export default function ActivityForm() {
    const { family, getFamily } = useContext(FamilyContext)
    const [workedWithOtherCompany, setWorkedWithOtherCompany] = useState(family.familyInternalData.workedWithOtherCompany || false)
    const [loading, setLoading] = useState(false)
    const [session, ] = useSession()
    
    const [editableWorkshop, setEditableWorkshop] = useState(null)
    const [editableFollowUpAction, setEditableFollowUpAction] = useState(null)
    //modals
    const [showCreateWorkshopModal, setShowCreateWorkshopModal] = useState(false)
    const [showEditWorkshopModal, setShowEditWorkshopModal] = useState(false)
    const [showCreateFollowupActionsModal, setShowCreateFollowupActionsModal] = useState(false)
    const [showEditFollowUpActionModal, setShowEditFollowUpActionModal] = useState(false)

    const [verificationDate, setVerificationDate] = useState(family.familyInternalData.verificationDate || '')
    const [otherCompanyName, setOtherCompanyName] = useState(family.familyInternalData.otherCompanyName || '')
    const [beenHostingStudentsSince, setBeenHostingStudentsSince] = useState(family.familyInternalData.beenHostingStudentsSince || '')

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
    const formatedFollowUpActions = family.familyInternalData.followUpActions.map((action)=> {
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
    const handleSubmit = () => {
        setLoading(true)
        FamiliesServices.updatefamily(session?.token, family._id, {
            familyInternalData: {
                verificationDate,
                otherCompanyName: workedWithOtherCompany ? otherCompanyName : '',
                workedWithOtherCompany,
                beenHostingStudentsSince: workedWithOtherCompany ? beenHostingStudentsSince : ''
            }
        })
        .then(()=> {
            setLoading(false)
            showSuccess('Family activity updated')
            getFamily()
        })
        .catch(err =>{
            setLoading(false)
            showError()
            console.log(err)
        })
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
        FamiliesServices.updatefamily(session?.token, family._id, newFollowUpActions)        
        .then(()=> {
            getFamily()
            showSuccess('Follow Up Actions Successfully created')
        })
        .catch(err => {
            showError()
            console.log(err)
        })
    }
    const confirmDeleteFollowUpActions = (data) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteFollowUpActions(data),
            reject: ()=> {}
        });
    }
    const deleteFollowUpActions = async (data) => {
        const updatedActions = await family.familyInternalData.followUpActions.filter(action => action._id !== data._id)
        const newFollowUpActions = {
            familyInternalData: {
                followUpActions: updatedActions
            }
        }
        FamiliesServices.updatefamily(session?.token, family._id, newFollowUpActions)        
        .then(()=> {
            getFamily()
            showSuccess('Follow Up Action Successfully deleted')
        })
        .catch(err => {
            showError()
            console.log(err)
        })
    }
    const handleEditFollowUpActions = (data) => {
        setEditableFollowUpAction(data)
        setShowEditFollowUpActionModal(true)
    }
    const editFollowUpActions = (data) => {
        setShowEditFollowUpActionModal(false)
        const actions = family.familyInternalData.followUpActions.filter((action) => action._id !== editableFollowUpAction._id)
        const newFollowUpActions = {
            familyInternalData: {
                followUpActions: [
                        ...actions,
                        {...data, _id: editableFollowUpAction._id, id: editableFollowUpAction._id}
                    ]
            }
        }
        FamiliesServices.updatefamily(session?.token, family._id, newFollowUpActions)
        .then(()=> {
            showSuccess('Follow-Up Action updated')
            getFamily()
        })
        .catch(err => {
            showError()
            console.log(err)
        })
    }
    const createWorkshop = (data) => {
        setShowCreateWorkshopModal(false)
        setWorkshops([...workshops, data])
        //here goes and not yet created endpoint
    }
    const editWorkshops = (data) => {
        setEditableWorkshop(data)
        setShowEditWorkshopModal(true)
    }
    return (
        <div>
            <form
                onSubmit={e => { 
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                <FormHeader title='Activity' onClick={handleSubmit} isLoading={loading} />
            </form>
            <FormGroup title="Tracing">
                <div className={classes.form_container_three}>

                    <InputContainer label="Date of verification">
                        <Calendar 
                            placeholder='Date of verification'
                            value={new Date(verificationDate)}
                            onChange={(e) => setVerificationDate(e.value)} 
                            showButtonBar 
                            showIcon
                            yearRange={general}
                            monthNavigator
                            yearNavigator
                        />
                    </InputContainer>
                    <InputContainer label="Last update">
                        <Calendar 
                            placeholder='Last update'
                            value={new Date(family.updatedAt)}
                            showButtonBar 
                            showIcon
                            disabled
                        />
                    </InputContainer>
                    
                    <InputContainer label="Date of registration in the system">
                        <Calendar 
                            placeholder="Date of registration in the system"
                            value={new Date(family.createdAt)}
                            showButtonBar
                            showIcon
                            disabled
                        />
                    </InputContainer>
                </div>
            </FormGroup>
            <div className={classes.activity_layout}>
                <div>
                    <InputContainer label="Do you work or have you ever worked with another host family company?">
                    <div>
                        <Checkbox inputId="cb1" checked={workedWithOtherCompany} onChange={e => {setWorkedWithOtherCompany(e.checked)}}></Checkbox>
                        <label htmlFor="cb1" className="p-checkbox-label" style={{marginInline:'1em', textTransform: 'capitalize'}}>{workedWithOtherCompany ? 'Yes' : 'No'}</label>
                    </div>
                    </InputContainer>
                    {workedWithOtherCompany && <div className={classes.full_width}>
                        <FormGroup title="Company information">
                            <div className={classes.form_container_multiple}>
                                <InputContainer label="Company name">
                                    <InputText 
                                        placeholder="Company name"
                                        value={otherCompanyName}
                                        onChange={({ target }) => setOtherCompanyName(target.value)} />
                                </InputContainer>

                                <InputContainer label="Since when have you been hosting students?">
                                    <Calendar 
                                        id="icon"
                                        showIcon placeholder="Date"
                                        yearNavigator
                                        monthNavigator
                                        yearRange={general}
                                        value={new Date(beenHostingStudentsSince)}
                                        onChange={({ target }) => setBeenHostingStudentsSince(target.value)}
                                    />
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
                            onDelete={confirmDeleteFollowUpActions}
                            edit={handleEditFollowUpActions}
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
            <Modal visible={showEditFollowUpActionModal} setVisible={setShowEditFollowUpActionModal} title="Edit Follow-up Action" icon="follow-up">
                <FollowupActionsForm onSubmit={editFollowUpActions} data={editableFollowUpAction}/>
            </Modal>
            <Toast ref={toast}/>
        </div>
    )
}
