import React,{useState} from 'react'
//components
import { Button } from 'primereact/button';
//styles
import classes from 'styles/UI/Atoms/Tag.module.scss'

interface Props {
    callback: () => void,
    label: string,
    color:string
}

export default function Tag<Props>({label,callback,color}) {
    const [backgroundColor] = useState(color)
    return (
        <p className={classes.tag} style={{background: backgroundColor}}>
            {label}
            <Button icon="pi pi-times" className={`p-button-rounded ${classes.button}`} onClick={e => callback()} />
        </p>
    )
}
