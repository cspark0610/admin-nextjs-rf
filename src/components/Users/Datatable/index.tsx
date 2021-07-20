import { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from 'primereact/multiselect';
import { confirmDialog } from 'primereact/confirmdialog'
import CreateUserForm from 'components/Users/CreateForm/';
import classes from "styles/Families/Datatable.module.scss";
import UsersService from 'services/Users'

const columns = [
  {
    field: 'first_name',
    header: 'Name',
    filterPlaceholder: 'Search by name'
  },
  {
    field: 'last_name',
    header: 'Last Name',
    filterPlaceholder: 'Search by last name'
  },
  {
    field: 'email',
    header: 'Email',
    filterPlaceholder: 'Search by email'
  }
]

const Datatable = () => {
  const toast = useRef(null);
  const dt = useRef(null);
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [globalFilter, setGlobalFilter] = useState("");
  const [users, setUsers] = useState([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState(null)

  const getUsers = () => {
    UsersService.getUsers()
      .then(response => setUsers(response))
      .catch(error => console.error(error))
  }

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
  };

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
          <MultiSelect
            value={selectedColumns}
            options={columns}
            optionLabel="header"
            onChange={onColumnToggle}
            style={{ width: "18em" }}
          />
        </div>

        <div className={classes.button_group}>
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger p-button-rounded"
            onClick={() => {}}
          />
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-rounded"
            onClick={() => setShowCreateDialog(true)}  
          />
        </div>
      </div>
    );
  };

  const createDialogHeader = () => (
    <div className='d-flex'>
      <i className="pi pi-users" />
      <h1>Create User</h1>
      <Button
        icon="pi pi-times"
        className="p-button-rounded"
        onClick={() => setShowCreateDialog(false)}  
      />
    </div>
  )

  const editDialogHeader = () => (
    <div className='d-flex'>
      <i className="pi pi-users" />
      <h1>Edit User</h1>
      <Button
        icon="pi pi-times"
        className="p-button-rounded"
        onClick={() => {
          setShowEditDialog(false)
          setSelectedUser(null)
        }}  
      />
    </div>
  )

  const confirmDeleteDialog = data => {
    confirmDialog({
        message: `Are you sure you want to delete ${data?.first_name} ${data?.last_name}`,
        header: 'Confirm Delete User',
        icon: 'pi pi-exclamation-triangle',
        accept: () => handleDeleteUser(data),
        reject: () => {
          setSelectedUser(null)
        }
    });
  }

  const handleEdit = props => {
    setShowEditDialog(true)
    setSelectedUser(props)
  }

  const handleCreateUser = data => {
    let verify = true

    Object.values(data).forEach(value => {
      if(value === '') verify = false
    })

    if(verify){
      UsersService.createUser(data)
        .then(response => {
          toast.current.show({severity: 'success', summary: 'User Created!'});
          setShowCreateDialog(false)
          getUsers()
        })
        .catch(error => {
          console.error(error)
          toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`});
          setShowCreateDialog(false)
        })
    }
  }

  const handleEditUser = data => {
    UsersService.updateUser(selectedUser._id, data)
      .then(response => {
        toast.current.show({severity: 'success', summary: 'User Updated!'});
        setShowEditDialog(false)
        setSelectedUser(null)
        getUsers()
      })
      .catch(error => {
        console.error(error)
        toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`});
        setShowEditDialog(false)
        setSelectedUser(null)
      })
  }

  const handleDeleteUser = (data) => {
    UsersService.deleteUser(data._id)
      .then(response => {
        toast.current.show({severity: 'success', summary: 'User Deleted!'});
        setShowEditDialog(false)
        getUsers()
      })
      .catch(error => {
        console.error(error)
        toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`});
        setShowEditDialog(false)
      })
  }

  const actionButtonsTemplate = props => (
    <div className={`${classes.table_header} table-header`}>
      <div className={classes.button_group}>
        <Button
          icon="pi pi-pencil"
          onClick={() => handleEdit(props)}
        />
        <Button
          icon="pi pi-trash"
          onClick={() => confirmDeleteDialog(props)}
        />
      </div>
    </div>
  )

  useEffect(() => {
    getUsers()
  }, [setUsers])

  return (
    <>
      <Dialog
        draggable={false}
        header={createDialogHeader}
        visible={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
      >
        <CreateUserForm 
          onSubmit={handleCreateUser}
          context="NEW"
        />
      </Dialog>
      <Dialog
        draggable={false}
        header={editDialogHeader}
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
      >
        <CreateUserForm
          onSubmit={handleEditUser}
          data={selectedUser}
          context="UPDATE"
        />
      </Dialog>
      <Toast ref={toast} />
      <DataTable
        ref={dt}
        className={`${classes.datatable} p-datatable-lg`}
        rowHover
        emptyMessage="No users found"
        value={users}
        header={renderHeader()}
        globalFilter={globalFilter}
        selection={selectedUsers}
        onSelectionChange={(e) => setSelectedUsers(e.value)}
      >
        <Column selectionMode="multiple" style={{ width: "3em" }} />
        {
          selectedColumns.map(column => (
            <Column key={column.field} { ...column } filter sortable/> 
          ))
        }
        <Column
          header='Actions'
          body={actionButtonsTemplate}
        /> 
      </DataTable>
    </>
  )
}

export default Datatable