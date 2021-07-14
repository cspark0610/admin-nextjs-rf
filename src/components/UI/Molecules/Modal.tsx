import React from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Icon from '../Atoms/Icon'
//styles
import classes from 'styles/UI/Molecules/ModalHeader.module.scss'

export default function Modal({visible,setVisible, title, icon, children}) {
    const onHide = () => {
        setVisible()
    }
    const ModalHeader = () => {
        return (
            <header className={classes.container}>
               <Icon classes={classes.icon} svg={icon}/>
               <h3>{title}</h3> 
            </header>
        )
    }
    const renderFooter = () => {
        return (
            <div>
                <Button label="Back"  onClick={() => onHide()} className="p-button-text" />
                <Button label="Create" onClick={() => onHide()} />
            </div>
        );
    }

    return (
        <Dialog  header={ModalHeader} style={{width: '40vw'}} visible={visible} onHide={onHide} footer={renderFooter}>
           {children}
        </Dialog>
    )
}
