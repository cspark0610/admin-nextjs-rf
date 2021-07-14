import React from 'react'
import Icon from '../Atoms/Icon'
//styles
import classes from 'styles/UI/Molecules/ModalHeader.module.scss'
export default function ModalHeader({icon, title}) {
    console.log(icon)
    return (
        <header className={classes.container}>
           {/* <Icon classes={classes.icon} svg={icon}/> */}
           <h3>{title}</h3> 
        </header>
    )
}
