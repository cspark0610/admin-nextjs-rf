import React, { useState, useEffect, useContext, useRef } from 'react'
import Link from 'next/link'
//components
import Table from 'components/UI/Organism/Table'
import Modal from 'components/UI/Molecules/Modal'
import DocumentForm from 'components/Families/modals/DocumentForm'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
//Api
import FamiliesService from 'services/Families'
//styles
import classes from "styles/Families/Datatable.module.scss";
//context
import { FamilyContext } from 'context/FamilyContext'
//services
import DocumentService from 'services/Documents'
import { useSession } from 'next-auth/client'

export default function DocumentsForm() {
  const { family, activeUserType } = useContext(FamilyContext)
  const toast = useRef(null);
  const dt = useRef(null)
  const [showCreateDocumets, setShowCreateDocuments] = useState(false)
  const [showEditDocuments, setShowEditDocuments] = useState(false)
  const [session,] = useSession()
  const [globalFilter, setGlobalFilter] = useState('')

  const [documents, setDocuments] = useState([])
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [editableDocument, setEditableDocument] = useState(null)

  const getDocuments = () => {
    DocumentService.getFamilyDocuments(session?.token, family._id)
      .then(res => {
        setDocuments(res)
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    (async () => {
      getDocuments()
    })()
    return () => { }
  }, [session])

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success Message', detail: msg, life: 3000 });
  }
  const showError = () => {
    toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'An error has ocurred', life: 3000 });
  }
  const handleCreate = (success: boolean) => {
    setShowCreateDocuments(false)
    if (success) {
      showSuccess('Document successfully created')
      getDocuments()

    } else {
      showError()
    }
  }
  const createDocuments = () => {
    setShowCreateDocuments(true)
  }
  const confirmDeleteDocuments = (documents) => {
    if (selectedDocuments.length) {
      confirmDialog({
        message: 'Do you want to delete these records?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept: () => { bulkDeleteDocuments() },
        reject: () => { }
      });
    } else {
      alert("you need to select items to delete")
    }

  }
  const handleEdit = (document) => {
    setEditableDocument(document)
    setShowEditDocuments(true)
  }
  const editDocuments = (data, id) => {
    setShowEditDocuments(false)
    DocumentService.updateDocuments(session?.token, id, data)
      .then(() => {
        showSuccess('Documents successfully updated')
      })
      .then(() => {
        getDocuments()
      })
      .catch(err => {
        showError()
        console.error(err)
      })
  }
  const deleteDocument = (document) => {
    DocumentService.deleteDocuments(session?.token, document._id)
      .then(() => {
        if (document.owner?.kind === 'Host') {
            const ownerId = document.owner.id
            const mainMembersId = family.mainMembers.map(mainMember => mainMember._id)
            const hostIndex = mainMembersId.indexOf(ownerId)
            if (hostIndex === 0) {
              if (document.isDeclaration) {
                FamiliesService.updatefamily(session?.token, family._id, {
                  isPrimaryHostDeclarationVerified: false
                })
              }
              if (document.isPoliceCheck) {
                FamiliesService.updatefamily(session?.token, family._id, {
                  isPrimaryHostPoliceCheckVerified: false
                })
              }
            }
            if (hostIndex === 1) {
              if (document.isDeclaration) {
                FamiliesService.updatefamily(session?.token, family._id, {
                  isSecondaryHostDeclarationVerified: false
                })
              }
              if (document.isPoliceCheck) {
                FamiliesService.updatefamily(session?.token, family._id, {
                  isSecondaryHostPoliceCheckVerified: false
                })
              }
            }
          }
        showSuccess('Document successfully deleted')
      })
      .then(() => {
        getDocuments()
      })
      .catch(() => {
        showError()
      })
  }
  const confirmDeleteDocument = (document) => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => { deleteDocument(document) },
      reject: () => { }
    });
  }
  const bulkDeleteDocuments = () => {
    const ids = selectedDocuments.map(doc => doc._id)
    DocumentService.bulkdeleteDocuments(session?.token, ids)
      .then(() => {
        showSuccess('Documents successfully deleted')
        getDocuments()
      })
      .catch(err => {
        console.error(err)
        showError()
      })
  }
  const urlTemplate = (rowData) => {
    return (
      <div className={classes.link}>
        <Link href={rowData.file}>
          <a download target="_blank">
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
        {activeUserType !== 'Reader' &&
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
              onClick={() => { createDocuments() }}
            />
          </div>
        }
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
  // const filterTemplate = (placeholder:string) => <InputText placeholder={placeholder} type="search"/>
  return (
    <>
      <h1>Documents</h1>
      <div className="datatable-responsive-demo">
        <div className="card">
          <DataTable
            className={`${classes.datatable} p-datatable-lg p-datatable-responsive-demo`}
            ref={dt}
            rowHover
            header={renderHeader()}
            emptyMessage='No documents found'
            globalFilter={globalFilter}
            value={documents}
            selection={selectedDocuments}
            onSelectionChange={e => { setSelectedDocuments(e.value) }}
            sortField='name'
            sortOrder={1}
            defaultSortOrder={1}
          >
            <Column selectionMode="multiple" style={{ width: "3em" }} />
            <Column
              field='name'
              header='Name'
              // filterElement={filterTemplate('Search by name')}
              filterPlaceholder='Search by Name'
              filter
              sortable
            />
            <Column
              field='remarks'
              header='Description'
              // filterElement={filterTemplate('Search by remarks')}
              filterPlaceholder='Search by description'
              filter
              sortable
            />
            <Column
              field='file'
              header='Url'
              body={urlTemplate}
              sortable
            />
            {activeUserType !== 'Reader' &&
              <Column
                className={classes.center}
                header='Actions'
                body={actionButtonsTemplate}
              />
            }
          </DataTable>
        </div>
      </div>
      <Toast ref={toast} />
      <Modal title='Create Documents' setVisible={setShowCreateDocuments} visible={showCreateDocumets} icon="document">
        <DocumentForm onSubmit={handleCreate} />
      </Modal>
      <Modal title='Edit Document' setVisible={setShowEditDocuments} visible={showEditDocuments} icon="document">
        <DocumentForm data={editableDocument} onSubmit={editDocuments} />
      </Modal>
    </>
  )
}
