import React, { useRef, useState, useContext, useMemo, useEffect } from 'react'
//components
import FormHeader from 'components/UI/Molecules/FormHeader'
import FormGroup from 'components/UI/Molecules/FormGroup'
import Observations from 'components/UI/Organism/Observations'
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast'
import { Checkbox } from 'primereact/checkbox';
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
import { formatDate } from 'utils/formatDate'
import { general } from 'utils/calendarRange'
import { useSession } from 'next-auth/client';
import { Dropdown } from 'primereact/dropdown';
import UsersService from 'services/Users';


export default function ActivityForm() {
    const { family, getFamily } = useContext(FamilyContext)
    const [workedWithOtherCompany, setWorkedWithOtherCompany] = useState(family.familyInternalData.workedWithOtherCompany || false)
    const [loading, setLoading] = useState(false)
    const [session,] = useSession()

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

    const [selectedWorkshop, setSelectedWorkshop] = useState(null)
    const toast = useRef(null)

    const [users, setUsers] = useState(null)
    const [user, setUser] = useState(null)

    const formatedWorkshops = useMemo(() => family.familyInternalData.workshopsAttended?.map(workshop => ({
        ...workshop,
        date: formatDate(workshop.date)
    })), [family])

    const formatedFollowUpActions = family.familyInternalData.followUpActions.map((action) => {
        return (
            {
                ...action,
                date: formatDate(action.date)
            }
        )
    })
    const showSuccess = (msg) => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: msg, life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'An error has ocurred', life: 3000 });
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
            user: user._id,
            familyInternalData: {
                verificationDate,
                otherCompanyName: workedWithOtherCompany ? otherCompanyName : '',
                workedWithOtherCompany,
                beenHostingStudentsSince: workedWithOtherCompany ? beenHostingStudentsSince : ''
            }
        })
            .then(() => {
                setLoading(false)
                showSuccess('Family activity updated')
                getFamily()
            })
            .catch(err => {
                setLoading(false)
                showError()
                console.error(err)
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
            .then(() => {
                getFamily()
                showSuccess('Follow Up Actions Successfully created')
            })
            .catch(err => {
                showError()
                console.error(err)
            })
    }
    const confirmDeleteFollowUpActions = (data) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteFollowUpActions(data),
            reject: () => { }
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
            .then(() => {
                getFamily()
                showSuccess('Follow Up Action Successfully deleted')
            })
            .catch(err => {
                showError()
                console.error(err)
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
                    { ...data, _id: editableFollowUpAction._id, id: editableFollowUpAction._id }
                ]
            }
        }
        FamiliesServices.updatefamily(session?.token, family._id, newFollowUpActions)
            .then(() => {
                showSuccess('Follow-Up Action updated')
                getFamily()
            })
            .catch(err => {
                showError()
                console.error(err)
            })
    }
    const handleWorkshop = (data) => {
        const newData = {
            ...family,
            familyInternalData: {
                ...family.familyInternalData,
                workshopsAttended: family.familyInternalData.workshopsAttended ? [...family.familyInternalData.workshopsAttended] : []
            }
        }

        if (!selectedWorkshop) {
            newData.familyInternalData.workshopsAttended = [...newData.familyInternalData.workshopsAttended, data]
        } else {
            const item = newData.familyInternalData.workshopsAttended.find(item => item._id = data._id)
            newData.familyInternalData.workshopsAttended[newData.familyInternalData.workshopsAttended.indexOf(item)] = data
        }

        FamiliesServices.updatefamily(session?.token, family._id, newData)
            .then(() => {
                getFamily()
                setShowCreateWorkshopModal(false)
                setSelectedWorkshop(null)
                showSuccess('Follow Up Actions Successfully created')
            })
            .catch(err => {
                showError()
                console.error(err)
            })
    }

    const handleDeleteWorkshop = data => {
        confirmDialog({
            message: `Are you sure you want to delete these workshops?`,
            header: 'Confirm Delete Workshops',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const newData = {
                    ...family,
                    familyInternalData: {
                        ...family.familyInternalData,
                        workshopsAttended: family.familyInternalData.workshopsAttended.filter(item => !data.includes(item._id))
                    }
                }

                FamiliesServices.updatefamily(session?.token, family._id, newData)
                    .then(() => {
                        getFamily()
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            reject: () => { }
        });
    }

    useEffect(() => {
        FamiliesServices.getUsers(session?.token)
            .then((response) => {
                setUser(response.find(item => item._id === family.user._id))
                setUsers(response)
            })
            .catch((error) => console.error(error))
      }, [session])

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
            <FormGroup title="Associated user">
                <InputContainer label="User">
                    <Dropdown
                        options={users}
                        value={user}
                        onChange={e => setUser(e.value)}
                        optionLabel='email'
                        placeholder="User"
                        className="single_input"
                        />
                </InputContainer>
            </FormGroup>

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
                            <Checkbox inputId="cb1" checked={workedWithOtherCompany} onChange={e => { setWorkedWithOtherCompany(e.checked) }}></Checkbox>
                            <label htmlFor="cb1" className="p-checkbox-label" style={{ marginInline: '1em', textTransform: 'capitalize' }}>{workedWithOtherCompany ? 'Yes' : 'No'}</label>
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
                            edit={e => {
                                setSelectedWorkshop(e)
                                setShowCreateWorkshopModal(true)
                            }}
                            onDelete={e => handleDeleteWorkshop([e._id])}
                            deleteMany={e => handleDeleteWorkshop([...e.map(item => item._id)])}
                            defaultSortField='name'
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
                            defaultSortField='date'
                        />
                    </FormGroup>
                </div>
                <FormGroup title="Internal observations">
                    <Observations />
                </FormGroup>
            </div>
            <Modal
                visible={showCreateWorkshopModal}
                setVisible={() => {
                    setShowCreateWorkshopModal(false)
                    setSelectedWorkshop(null)
                }}
                title={selectedWorkshop ? "Update workshop" : "Create workshop"}
                icon="workshop"
            >
                <WorkshopForm onSubmit={handleWorkshop} data={selectedWorkshop} />
            </Modal>

            <Modal visible={showCreateFollowupActionsModal} setVisible={setShowCreateFollowupActionsModal} title="Create Follow-up Action" icon="follow-up">
                <FollowupActionsForm onSubmit={createFollowUpActions} />
            </Modal>
            <Modal visible={showEditFollowUpActionModal} setVisible={setShowEditFollowUpActionModal} title="Edit Follow-up Action" icon="follow-up">
                <FollowupActionsForm onSubmit={editFollowUpActions} data={editableFollowUpAction} />
            </Modal>
            <Toast ref={toast} />
        </div>
    )
}
