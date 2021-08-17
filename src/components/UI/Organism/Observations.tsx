import React, { useState, useContext} from 'react'
import { useSession } from 'next-auth/client';
//components
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import InputContainer from 'components/UI/Molecules/InputContainer'
import ObservationCard from 'components/UI/Molecules/ObservationCard'
//styles
import classes from 'styles/UI/Organism/Observations.module.scss'
//context
import {FamilyContext} from 'context/FamilyContext'
//services
import InternalObservationsService from 'services/InternalObservations'
//utils 
import {formatDate} from 'utils/formatDate'

export default function Observations() {
    const [observation, setObservation] = useState('')
    const {family} = useContext(FamilyContext)
    const [session] = useSession()

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            /* @ts-ignore */
            author: {_id: session?.user?.id} ,
            content: observation,
        }
        InternalObservationsService.createObservations(session?.token, family._id,data)
        .then(() => {
            console.log('success')
        })
        .catch(err => console.log(err))
    }
    return (
        <div className={classes.main_container}>
            <section className={classes.card_container}>
                {family.familyInternalData.internalObservations.map(({_id, author, content, updatedAt})=>{
                    return(
                        <ObservationCard 
                            key={_id}
                            author={author}
                            content={content}
                            updatedAt={formatDate(updatedAt)}
                        />
                    )
                })}
                
            </section>
            <section className={classes.observation_footer}>
            <label htmlFor="">Add Internal observation</label> 
            <form onSubmit={e => handleSubmit(e)}>
           
                <InputTextarea autoResize rows={1} name='tags' value={observation} placeholder='Add Observation' onChange={e => setObservation(e.target.value)} style={{width:'100%'}}/>
                <Button className={classes.observation_btn} label="Add" />
            </form>

            </section>
            
        </div>
    )
}
