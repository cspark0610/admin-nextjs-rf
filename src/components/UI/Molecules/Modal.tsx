import React from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import ModalHeader from 'components/UI/Molecules/ModalHeader'

export default function Modal({visible,setVisible, children}) {
    const onHide = () => {
        setVisible()
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
        <Dialog  header={ModalHeader({icon: 'workshop', title: 'Workshops'})} style={{width: '40vw'}} visible={visible} onHide={onHide} footer={renderFooter}>
           {children}
        </Dialog>
    )
}
