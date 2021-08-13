import React, { useState, useContext} from 'react'
//components
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import InputContainer from 'components/UI/Molecules/InputContainer'
import ObservationCard from 'components/UI/Molecules/ObservationCard'
//styles
import classes from 'styles/UI/Organism/Observations.module.scss'
//context
import {FamilyContext} from 'context/FamilyContext'
//utils 
import {formatDate} from 'utils/formatDate'

export default function Observations() {
    const [Observation, setObservation] = useState('')
    const {family} = useContext(FamilyContext)
    
    console.log(family.familyInternalData.internalObservations)
    const handleSubmit = (e) => {
        console.log('working')
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
           
                <InputTextarea autoResize rows={1} name='tags' value={Observation} placeholder='Add Observation' onChange={e => setObservation(e.target.value)} style={{width:'100%'}}/>
                <Button className={classes.observation_btn} label="Add" />
            </form>

            </section>
            
        </div>
    )
}
