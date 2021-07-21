import React from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Icon from '../Atoms/Icon'
//styles
import styles from 'styles/UI/Molecules/Modal.module.scss'
import classes from 'styles/UI/Molecules/ModalHeader.module.scss'

interface Props {
    visible: boolean,
    setVisible: any,
    title: string,
    icon: string,
    children: any
}

const Modal : React.FC<Props> = ({visible,setVisible, title, icon, children}) => {
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

    return (
        <Dialog className={styles.modal} header={ModalHeader} style={{width: '40vw',}} visible={visible} onHide={onHide}>
              {children}
        </Dialog>
    )
}

export default Modal


