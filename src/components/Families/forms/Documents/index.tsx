import React,{useState, useEffect, useContext} from 'react'
//components
import Table from 'components/UI/Organism/Table'
import Modal from 'components/UI/Molecules/Modal'
//context
import {FamilyContext} from 'context/FamilyContext'
//services
import DocumentService from 'services/Documents'
import { useSession } from 'next-auth/client'

export default function DocumentsForm() {
    const {family} = useContext(FamilyContext)
    const [showCreateDocumets, setShowCreateDocuments] = useState(false)
    const [session, ] = useSession()

    const [documents, setDocuments] = useState([])
    useEffect(()=> {
        (async () => {
            const data = await DocumentService.getFamilyDocuments(session?.token, family._id)
            setDocuments(data)
            console.log(data)
        })()
        return ()=> {}
    }, [session]) 
    const docsColumns = [
        {field: 'name', header: 'Name', filterPlaceholder: 'Search by name'},
        {field: 'remarks', header: 'Remarks', filterPlaceholder: 'Search by remarks'},
        {field: 'url', header: 'Url', filterPlaceholder: 'Search by url'},
    ]
    return (
        <>
            <h1>Documents</h1>
            <Table name='Documents' columns={docsColumns} content={documents} create={()=> {setShowCreateDocuments(true)}} />
            <Modal title= 'Create Documents' setVisible={setShowCreateDocuments} visible={showCreateDocumets} icon="document">
                form
            </Modal>
        </>
    )
}
