import { useRef, useState, useEffect } from "react"
//components
import { Toast } from "primereact/toast"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Dialog } from "primereact/dialog"
import { MultiSelect } from 'primereact/multiselect'
import { confirmDialog } from 'primereact/confirmdialog'
import Modal from 'components/UI/Molecules/Modal'
import CreateGenericForm from 'components/Settings/CreateGenericForm'
//styles
import classes from "styles/Families/Datatable.module.scss"
//services
import UsersService from 'services/Users'
import GenericsService from 'services/Generics'
import { useSession } from "next-auth/client"

const allGenerics = [
  {
    id: 'transports',
    label: 'Transports',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      }
    ]
  },
  {
    id: 'communities',
    label: 'Communities',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      }
    ]
  },
  {
    id: 'genders',
    label: 'Genders',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      }
    ]
  },
  {
    id: 'cultural_activities',
    label: 'Cultural Activities',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
      {
        field: 'icon',
        header: 'Icon',
        sortable: false,
        filter: false
      },
    ]
  },
  {
    id: 'interests',
    label: 'Interests',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
      {
        field: 'icon',
        header: 'Icon',
        sortable: false,
        filter: false
      },
    ]
  },
  {
    id: 'nearby-services',
    label: 'Nearby Services',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'home_types',
    label: 'Home Types',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
      {
        field: 'icon',
        header: 'Icon',
        sortable: false,
        filter: false
      },
    ]
  },
  {
    id: 'pet_types',
    label: 'Pet Types',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
      {
        field: 'icon',
        header: 'Icon',
        sortable: false,
        filter: false
      },
    ]
  },
  {
    id: 'services',
    label: 'Services',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
      {
        field: 'icon',
        header: 'Icon',
        sortable: false,
        filter: false
      },
    ]
  },
  {
    id: 'cities',
    label: 'Cities',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
      {
        field: 'province.name',
        header: 'Province',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'countries',
    label: 'Countries',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'diets',
    label: 'Diets',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'family-rules',
    label: 'Family Rules',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
      {
        field: 'icon',
        header: 'Icon',
        sortable: false,
        filter: false
      },
    ]
  },
  {
    id: 'languages',
    label: 'Languages',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'nationalities',
    label: 'Nationalities',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'occupations',
    label: 'Occupations',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'provinces',
    label: 'Provinces',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  },
  {
    id: 'schools',
    label: 'Schools',
    columns: [
      {
        field: 'name',
        header: 'Name',
        filterPlaceholder: 'Search by name',
        sortable: true,
        filter: true
      },
    ]
  }
]

const Datatable = () => {
  const toast = useRef(null)
  const dt = useRef(null)
  const [session, loading] = useSession()
  
  // const [allGenerics, setAllGenerics] = useState([])
  const [generics, setGenerics] = useState([])
  const [selectedGenerics, setSelectedGenerics] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [actualGeneric, setActualGeneric] = useState(allGenerics[0])
  const [selectedGeneric, setSelectedGeneric] = useState(null)

  const getGeneric = () => {
    GenericsService.getGeneric(session?.token, actualGeneric.id)
      .then(response => {
        setGenerics(response)
      })
      .catch(error => console.error(error))
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
          <select
            value={actualGeneric.id}
            onChange={({ target }) => setActualGeneric(allGenerics.find(generic => generic.id === target.value))}
          >
            <option value=''></option>
            {
              allGenerics.map(generic => <option value={generic.id}>{generic.label}</option>)
            }
          </select>
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
    )
  }

  const confirmDeleteDialog = data => {
    confirmDialog({
        message: `Are you sure you want to delete ${data?.name} from ${actualGeneric.label}?`,
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        accept: () => handleDeleteGeneric(data),
        reject: () => {
          setSelectedGeneric(null)
        }
    })
  }

  const handleEdit = props => {
    setShowEditDialog(true)
    setSelectedGeneric(props)
  }

  const handleCreateGeneric = data => {
    GenericsService.create(session?.token, actualGeneric.id, data)
      .then(response => {
        toast.current.show({severity: 'success', summary: `${actualGeneric.label} Created!`})
        setShowCreateDialog(false)
        getGeneric()
      })
      .catch(error => {
        console.error(error)
        toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`})
        setShowCreateDialog(false)
      })
  }

  const handleEditGeneric = data => {
    GenericsService.update(session?.token, actualGeneric.id, selectedGeneric._id, data)
      .then(response => {
        toast.current.show({severity: 'success', summary: `${actualGeneric.label} Updated!`})
        setShowEditDialog(false)
        setSelectedGenerics(null)
        getGeneric()
      })
      .catch(error => {
        console.error(error)
        toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`})
        setShowEditDialog(false)
        setSelectedGenerics(null)
      })
  }

  const handleDeleteGeneric = (data) => {
    GenericsService.delete(session?.token, actualGeneric.id, data._id)
      .then(response => {
        toast.current.show({severity: 'success', summary: 'Item Deleted!'})
        getGeneric()
      })
      .catch(error => {
        console.error(error)
        toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`})
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

  // const handleDeleteMany = () => {
  //   confirmDialog({
  //       message: `Are you sure you want to delete all of these users?`,
  //       header: 'Confirm Delete Users',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         console.log('data', { ids: selectedUsers.map(user => user._id) })
  //         UsersService.deleteMany(session?.token, selectedUsers.map(user => user._id))
  //           .then(response => {
  //             toast.current.show({severity: 'success', summary: 'Users Deleted!'})
  //             // getUsers()
  //           })
  //           .catch(error => {
  //             console.error(error)
  //             toast.current.show({severity: 'error', summary: `An error occurred! ${error.message}`})
  //           })
  //       },
  //       reject: () => {}
  //   })
  // }

  useEffect(() => {
    getGeneric()
  }, [session, actualGeneric])

  return (
    <>
      <Modal
        visible={showCreateDialog}
        setVisible={setShowCreateDialog}
        title={`Create ${actualGeneric.label}`}
        icon="users"
      >
        <CreateGenericForm 
          onSubmit={handleCreateGeneric}
          fields={actualGeneric.columns.map(column => ({ id: column.field, label: column.header }))}
          context="NEW"
        />
      </Modal>
      <Modal
        visible={showEditDialog}
        setVisible={setShowEditDialog}
        title='Edit User'
        icon="users"
      >
        <CreateGenericForm
          onSubmit={handleEditGeneric}
          fields={actualGeneric.columns.map(column => ({ id: column.field, label: column.header }))}
          data={selectedGeneric}
          context="UPDATE"
        />
      </Modal>
      <Toast ref={toast} />
      <DataTable
        ref={dt}
        className={`${classes.datatable} p-datatable-lg`}
        rowHover
        emptyMessage="No generics found"
        value={generics}
        header={renderHeader()}
        globalFilter={globalFilter}
        selection={selectedGenerics}
        onSelectionChange={(e) => setSelectedGenerics(e.value)}
      >
        <Column selectionMode="multiple" style={{ width: "3em" }} />
        {
          actualGeneric.columns.map(column => (
            <Column key={column.field} { ...column } filter={column.filter} sortable={column.sortable} /> 
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