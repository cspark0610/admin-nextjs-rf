import { useRef, useState, useEffect } from "react";
//components
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from 'primereact/multiselect';
import { confirmDialog } from 'primereact/confirmdialog'
import Modal from 'components/UI/Molecules/Modal'
import CreateUserForm from 'components/Users/CreateForm/';
//styles
import classes from "styles/Families/Datatable.module.scss";
//services
import UsersService from 'services/Users'
import { useSession } from "next-auth/client";

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
  const [session, loading] = useSession()

  const getUsers = () => {
    UsersService.getUsers(session?.token)
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
            onClick={handleDeleteMany}
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
    UsersService.createUser(session?.token, data)
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

  const handleEditUser = data => {
    UsersService.updateUser(session?.token, selectedUser._id, data)
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
    UsersService.deleteUser(session?.token, data._id)
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
      <div className={classes.actions_field}>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-outlined p-mr-2" 
          onClick={() => handleEdit(props)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-outlined" 
          onClick={() => confirmDeleteDialog(props)}
        />
      </div>
  )

  const handleDeleteMany = () => {
    confirmDialog({
        message: `Are you sure you want to delete all of these users?`,
        header: 'Confirm Delete Users',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log('data', { ids: selectedUsers.map(user => user._id) })
          UsersService.deleteMany(session?.token, selectedUsers.map(user => user._id))
            .then(response => {
              toast.current.show({severity: 'success', summary: 'Users Deleted!'});
              getUsers()
            })
            .catch(error => {
              console.error(error)
              toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`});
            })
        },
        reject: () => {}
    });
  }

  useEffect(() => {
    getUsers()
  }, [session])

  return (
    <>
      <Modal
        visible={showCreateDialog}
        setVisible={setShowCreateDialog}
        title='Create User'
        icon="users"
        >
        <CreateUserForm 
          onSubmit={handleCreateUser}
          context="NEW"
        />
      </Modal>
      <Modal
        visible={showEditDialog}
        setVisible={setShowEditDialog}
        title='Edit User'
        icon="users"
        >
          <CreateUserForm
          onSubmit={handleEditUser}
          data={selectedUser}
          context="UPDATE"
        />
      </Modal>
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
          className={classes.center}
          header='Actions'
          body={actionButtonsTemplate}
        /> 
      </DataTable>
    </>
  )
}

export default Datatable