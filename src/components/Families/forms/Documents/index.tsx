import React,{useState, useEffect, useContext, useRef} from 'react'
import Link from 'next/link'
//components
import Table from 'components/UI/Organism/Table'
import Modal from 'components/UI/Molecules/Modal'
import DocumentForm from 'components/Families/modals/DocumentForm'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
//styles
import classes from "styles/Families/Datatable.module.scss";
//context
import {FamilyContext} from 'context/FamilyContext'
//services
import DocumentService from 'services/Documents'
import { useSession } from 'next-auth/client'

export default function DocumentsForm() {
    const {family} = useContext(FamilyContext)
    const dt = useRef(null)
    const [showCreateDocumets, setShowCreateDocuments] = useState(false)
    const [session, ] = useSession()
    const [globalFilter, setGlobalFilter] = useState('')

    const [documents, setDocuments] = useState([])
    const [selectedDocuments, setSelectedDocuments] = useState([])
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

    const handleSubmit = (data) => {
        console.log(data)
        setShowCreateDocuments(false)
    }
    const createDocuments = ()=> {
    }
    const confirmDeleteDocuments= (documents)=>{
    }
    const handleEdit = (document)=> {}
    const confirmDeleteDocument = (document) => {}
    const urlTemplate = (rowData) => {
        return(
          <div className={classes.link}>
            <Link href={rowData.file}>
                <a>
                    {rowData.file}
                </a>
            </Link>
          </div>
            
        )
    }
    const renderHeader = () => {
    return (
      <div className={`${classes.table_header} table-header`}>
        <div>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global search"
            />
          </span>
        </div>

        <div className={classes.button_group}>
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger p-button-rounded"
            onClick={() => confirmDeleteDocuments(selectedDocuments)}
          />
          <Button 
            label="New" 
            icon="pi pi-plus" 
            className="p-button-rounded" 
            onClick={() => {createDocuments()}} 
        />
        </div>
      </div>
    );
  };

  const actionButtonsTemplate = props => (
      <div className={classes.actions_field}>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-outlined p-mr-2" 
          onClick={() => handleEdit(props)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-outlined" 
          onClick={() => confirmDeleteDocument(props)}
        />
      </div>
  )
    return (
        <>
            <h1>Documents</h1>
            <DataTable 
                className="p-datatable-responsive-demo"    
                ref={dt}
                rowHover
                header={renderHeader()}
                emptyMessage='No documents found'
                globalFilter={globalFilter}
                value={documents}
                selection={selectedDocuments}
                onSelectionChange={e => {setSelectedDocuments(e.value)}}
            >
                <Column selectionMode="multiple" style={{ width: "3em" }} />
                <Column
                    field='name'
                    header='Name'
                    filterPlaceholder='Search by Name'
                    filter
                    sortable
                />
                <Column
                    field='remarks'
                    header='Remarks'
                    filterPlaceholder='Search by remarks'
                    filter
                    sortable
                />
                <Column
                    field='file'
                    header='Url'
                    body={urlTemplate}
                    sortable
                />
                <Column
                className={classes.center}
                header='Actions'
                body={actionButtonsTemplate}
                /> 
            </DataTable>
            <Modal title= 'Create Documents' setVisible={setShowCreateDocuments} visible={showCreateDocumets} icon="document">
                <DocumentForm onSubmit={handleSubmit}/> 
            </Modal>
        </>
    )
}
