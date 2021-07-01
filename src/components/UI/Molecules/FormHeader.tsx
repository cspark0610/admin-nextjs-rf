import React from 'react'
import { Button } from 'primereact/button';
//styles
import classes from 'styles/UI/Molecules/FormHeader.module.scss'

export default function FormHeader({title}) {
    return (
        <div className={classes.container}>
            <h1>{title}</h1>
            <Button label="Save" icon="pi pi-save" className="p-button-rounded" />
        </div>
    )
}
