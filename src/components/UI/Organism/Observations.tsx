import React, { useState,useRef, useContext, useEffect} from 'react'
import { useSession } from 'next-auth/client';
//components
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from "primereact/toast";
import ObservationCard from 'components/UI/Molecules/ObservationCard'
//styles
import classes from 'styles/UI/Organism/Observations.module.scss'
//context
import {FamilyContext} from 'context/FamilyContext'
//services
import InternalObservationsService from 'services/InternalObservations'
//utils 
import {formatDate} from 'utils/formatDate'
import FamiliesService from 'services/Families';

export default function Observations() {
    const [observation, setObservation] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editableObservationId, setEditableObservationId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {family, getFamily} = useContext(FamilyContext)
    const [session] = useSession()
    const [users, setUsers] = useState([])

    const toast = useRef(null)
    const showSuccess = (msg) => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:msg, life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:'An error has ocurred', life: 3000});
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const data = {
            /* @ts-ignore */
            author: {_id: session?.user?.id} ,
            content: observation,
        }
        if(isEditing){
            InternalObservationsService.updateObservation(session?.token, family._id, editableObservationId, data)
            .then(() => {
                setIsLoading(false)
                getFamily()
                setObservation('')
                setIsEditing(false)
                showSuccess('Internal observation successfully updated')
            })
            .catch(err => {
                setIsLoading(false)
                setIsEditing(false)
                console.error(err)
                showError()
            }) 

        }else{
           InternalObservationsService.createObservations(session?.token, family._id,data)
            .then(() => {
                setIsLoading(false)
                getFamily()
                setObservation('')
                showSuccess('Internal observation successfully created')
            })
            .catch(err => {
                setIsLoading(false)
                console.error(err)
                showError()
            }) 
        }
        
    }
    const deleteObservation = (id) => {
        InternalObservationsService.deleteObservation(session?.token, family._id, id)
            .then(()=>{
                showSuccess('Observation deleted successfully')
                getFamily()
            })
            .catch(err => {
                console.error(err)
                showError()
            })
    }
    const confirmDelete = (id) => {
        confirmDialog({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteObservation(id), 
        reject: () => {}
    });
    }
    const editObservation = (id, content) => {
        setObservation(content)
        setEditableObservationId(id)
        setIsEditing(true)
    }

    useEffect(() => {
        FamiliesService.getUsers(session?.token)
            .then(response => setUsers(response))
            .catch(error => console.error(error))
    }, [session])

    return (
        <div className={classes.main_container}>
            <section className={classes.card_container}>
                {family.familyInternalData.internalObservations.map(({_id, author, content, updatedAt})=>{
                    return(
                        <ObservationCard 
                            key={_id}
                            id={_id}
                            author={users.find(user => user._id === author)}
                            content={content}
                            updatedAt={formatDate(updatedAt)}
                            onEdit={editObservation}
                            onDelete={confirmDelete}
                        />
                    )
                })}
                
            </section>
            <section className={classes.observation_footer}>
            <label htmlFor="">Add Internal observation</label> 
            <form onSubmit={e => handleSubmit(e)}>
                <InputTextarea autoResize rows={1} name='tags' value={observation} placeholder='Add Observation' onChange={e => setObservation(e.target.value)} style={{width:'100%'}}/>
                <Button 
                    className={classes.observation_btn} 
                    label={isEditing ? 'Edit' : 'Add'} 
                    loading={isLoading}
                    />
                {isEditing && 
                    <Button 
                    icon="pi pi-times" 
                    className={`${classes.cancel_edit_btn} p-button-rounded p-button-danger p-button-text`}
                    onClick={() => {setIsEditing(false); setObservation('')}}
                    />}
            </form>
            </section>
        <Toast ref={toast} />
        </div>
    )
}
