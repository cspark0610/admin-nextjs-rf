import React from 'react'
import { Button } from 'primereact/button';
//styles
import classes from 'styles/UI/Molecules/FormHeader.module.scss'

interface Props {
    title: string,
    isLoading?: boolean
}

const FormHeader : React.FC<Props>= ({title, isLoading}) => {
    return (
        <div className={classes.container}>
            <h1>{title}</h1>
            <Button loading={isLoading} label="Save" icon="pi pi-save" className="p-button-rounded" />
        </div>
    )
}

export default  FormHeader
