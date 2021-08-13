import React from 'react'
import { Button } from 'primereact/button';
//styles
import classes from 'styles/UI/Molecules/FormHeader.module.scss'

interface Props {
    title: string,
    isLoading?: boolean
    onClick?: (e: any)=> void
}

const FormHeader : React.FC<Props>= ({title, isLoading, onClick}) => {
    return (
        <div className={classes.container}>
            <h1>{title}</h1>
            <Button onClick={(e) => onclick ? onClick(e) : {}} loading={isLoading} label="Save" icon="pi pi-save" className="p-button-rounded" />
        </div>
    )
}

export default  FormHeader
