import React, { useState, useContext} from 'react'
//components
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import ObservationCard from 'components/UI/Molecules/ObservationCard'
//styles
import classes from 'styles/UI/Organism/Observations.module.scss'
//context
import {FamilyContext} from 'context/FamilyContext'

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
                {family.familyInternalData.internalObservations.map(({author, content, updatedAt})=>{
                    return(
                        <ObservationCard 
                            author={author}
                            content={content}
                            updatedAt={updatedAt}
                        />
                    )
                })}
                
            </section>
            <form onSubmit={e => handleSubmit(e)}>
                <InputText name='tags' value={Observation} placeholder='Add Observation' onChange={e => setObservation(e.target.value)} style={{width:'100%'}}/>
                <Button label="Add" />
            </form>
            
        </div>
    )
}
