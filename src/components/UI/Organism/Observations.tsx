import React, { useState } from 'react'
//components
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import ObservationCard from 'components/UI/Molecules/ObservationCard'
//styles
import classes from 'styles/UI/Organism/Observations.module.scss'

export default function Observations() {
    const [Observation, setObservation] = useState('')
    
    const handleSubmit = (e) => {
        console.log('working')
    }
    return (
        <div className={classes.main_container}>
            <section className={classes.card_container}>
                <ObservationCard/>
                <ObservationCard/>
                <ObservationCard/>
                <ObservationCard/>
            </section>
            <form onSubmit={e => handleSubmit(e)}>
                <InputText name='tags' value={Observation} placeholder='Add Observation' onChange={e => setObservation(e.target.value)} style={{width:'100%'}}/>
                <Button label="Add" />
            </form>
            
        </div>
    )
}
