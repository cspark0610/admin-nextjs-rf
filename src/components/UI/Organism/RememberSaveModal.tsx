import React, { useContext } from 'react'
import Modal from 'components/UI/Molecules/Modal'
import { FamilyContext } from 'context/FamilyContext'
import { Button } from 'primereact/button'

export default function RememberSaveModal(handleSubmit, tabName) {
    let { activeUserType, tabInfo, setTabChanges } = useContext(FamilyContext)
    if(typeof(handleSubmit) !== 'function') {handleSubmit = handleSubmit.handleSubmit }
    return (
        <>
            {
            tabInfo.hasChanges===true && activeUserType !== 'Reader' &&
                <Modal
                visible={tabInfo.leaving}
                setVisible={()=>{}}
                title='You make some changes here'
                icon='workshop'
                >
                    <div style={{
                    display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center',
                    padding: '12px 30px', }}>
                        <Button 
                        onClick={handleSubmit} label="Save" icon="pi pi-save"
                        className="p-button-rounded" 
                        />
                        <p style={{margin:'16px'}}>or</p>
                        <Button 
                        label="Discard" icon="pi pi-times" 
                        className="p-button-danger p-button-rounded" 
                        onClick={()=>{setTabChanges(tabName, false, false)}} 
                        />
                    </div>
                </Modal>
            }
        </>
    )
}
