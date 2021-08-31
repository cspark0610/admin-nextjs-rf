import React, { useState, useRef, useEffect, useContext } from 'react'
import Link from 'next/link'
//components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
//styles
import classes from 'styles/Families/Datatable.module.scss'
import FamiliesService from 'services/Families'
//utils
import formatName from 'utils/formatName'
import { useSession } from 'next-auth/client'

import { exportCsv as ExportCsv } from 'utils/exportCsv'
import FiltersModal from '../modals/FiltersModal'

import { FamilyContext } from 'context/FamilyContext'
import CreateFamilyModal from '../modals/CreateFamilyModal'

const columns = [
  { field: 'name', header: 'Name', filterPlaceholder: 'Search by name' },
  { field: 'type', header: 'Type', filterPlaceholder: 'Search by type' },
  {
    field: 'location',
    header: 'Location',
    filterPlaceholder: 'Search by location',
  },
  {
    field: 'familyMembers',
    header: 'Number of aditional family members',
    filterPlaceholder: 'Search by number of aditional family members',
  },
  {
    field: 'localManager',
    header: 'Local Coordinator',
    filterPlaceholder: 'Search by local coordinator',
  },
]

export default function Datatable() {
  const { resetFamily } = useContext(FamilyContext)
  const [selectedFamilies, setSelectedFamilies] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showCreateFamilyModal, setshowCreateFamilyModal] = useState(false)
  const dt = useRef(null)
  const [families, setFamilies] = useState([])
  const toast = useRef(null)
  const [session, loading] = useSession()

  const getFamilies = async () => {
    try {
      const data = await FamiliesService.getFamilies(session?.token)
      setFamilies(
        data.map((family) => {
          return {
            ...family,
            name: formatName(family.mainMembers),
            location: family.location
              ? `${family.location.province}, ${family.location.city}`
              : 'No assigned',
            localManager: family.localManager
              ? family.localManager.name
              : 'No assigned',
            status: family.status ? family.status : 'no status',
          }
        })
      )
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getFamilies()
    return () => {}
  }, [session])

  useEffect(() => resetFamily(), [])

  //--- Status ------------------------------------------------------------
  const statuses = [
    'unqualified',
    'qualified',
    'new',
    'Low',
    'renewal',
    'Active',
  ]
  const onStatusChange = (e) => {
    dt.current.filter(e.value, 'status', 'equals')
    setSelectedStatus(e.value)
  }
  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>
  }
  const statusBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className={`customer-badge status-${rowData.status}`}>
          {rowData.status}
        </span>
      </React.Fragment>
    )
  }
  const statusFilter = (
    <Dropdown
      value={selectedStatus}
      options={statuses}
      onChange={onStatusChange}
      itemTemplate={statusItemTemplate}
      placeholder='Select a Status'
      className='p-column-filter filter_dropdown'
      showClear
    />
  )

  //End status -----------------------------------------------------------------

  const actionBodyTemplate = (rowData) => {
    return (
      <Link href={`/families/${rowData.id}`}>
        <a>
          <Button
            type='button'
            icon='pi pi-pencil'
            className='p-button-rounded p-button-outlined p-mr-2'
          ></Button>
        </a>
      </Link>
    )
  }

  const onColumnToggle = (event) => {
    let selectedColumns = event.value
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    )
    setSelectedColumns(orderedSelectedColumns)
  }

  const insert = (arr, index, newItem) => [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index),
  ]

  const [selectedColumns, setSelectedColumns] = useState(columns)
  const columnComponents = insert(
    selectedColumns.map((col) => {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          filterMatchMode='contains'
          filter
          sortable
          filterPlaceholder={col.filterPlaceholder}
        />
      )
    }),
    2,
    <Column
      field='status'
      header='Status'
      sortable
      body={statusBodyTemplate}
      filter
      filterElement={statusFilter}
    />
  )

  const getFamiliesIds = (families) => {
    return families.map((family) => family.id)
  }
  const deleteFamilies = async () => {
    await FamiliesService.deleteFamilies(session?.token, {
      ids: getFamiliesIds(selectedFamilies),
    })
  }
  const accept = () => {
    deleteFamilies()
      .then((response) => {
        getFamilies()
        toast.current.show({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Families  successfully deleted',
          life: 3000,
        })
      })
      .catch((error) => console.error(error))
  }

  const confirmDelete = () => {
    if (selectedFamilies) {
      confirmDialog({
        message: 'Do you want to delete this family?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
      })
    }
  }

  const handleExportCsv = async () => {
    if (selectedFamilies.length > 0) {
      setExportLoading(true)
      await FamiliesService.exportFamiliesToCsv(
        session?.token,
        selectedFamilies.map((family) => family.id)
      )
        .then((response) => {
          setExportLoading(false)

          ExportCsv(response)

          toast.current.show({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Families successfully exported!',
            life: 3000,
          })
        })
        .catch((error) => {
          setExportLoading(false)
          toast.current.show({
            severity: 'danger',
            summary: 'Error',
            detail: 'An error has ocurred',
            life: 3000,
          })
          console.error(error)
        })
    } else {
      alert('You need to select the families to export')
    }
  }

  const handleCreateFamily = () => setshowCreateFamilyModal(true)

  const renderHeader = () => {
    return (
      <div className={`${classes.table_header} table-header`}>
        <div className={classes.table_header__inputs}>
          <span
            className='p-input-icon-left'
            style={{ minWidth: 'fit-content', width: '100% !important' }}
          >
            <i className='pi pi-search' />
            <InputText
              type='search'
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder='Global search'
            />
          </span>
          <MultiSelect
            value={selectedColumns}
            options={columns}
            optionLabel='header'
            onChange={onColumnToggle}
            style={{ width: '100%' }}
            selectedItemTemplate={(item) => (item ? `${item?.name}, ` : '')}
          />
        </div>

        <div className={classes.button_group}>
          <Button
            label='Search'
            icon='pi pi-search'
            className='p-button-text export-button'
            onClick={() => setShowFilterModal(true)}
          />
          <Button
            label='Export CSV'
            icon='pi pi-file'
            loading={exportLoading}
            className='p-button-link export-button'
            onClick={handleExportCsv}
          />
          <Button
            label='Delete'
            icon='pi pi-trash'
            className='p-button-danger p-button-rounded'
            onClick={() => confirmDelete()}
          />
          <Button
            label='New'
            icon='pi pi-plus'
            className='p-button-rounded'
            onClick={() => handleCreateFamily()}
          />
        </div>
      </div>
    )
  }
  const header = renderHeader()

  return (
    <>
      <FiltersModal
        visible={showFilterModal}
        setVisible={setShowFilterModal}
        setFamilies={setFamilies}
      />
      <CreateFamilyModal
        isOpen={showCreateFamilyModal}
        setIsOpen={setshowCreateFamilyModal}
      />
      <Toast ref={toast} />
      <div className='datatable-responsive-demo'>
        <div className='card'>
          <DataTable
            ref={dt}
            className={`${classes.datatable} p-datatable-lg p-datatable-responsive-demo`}
            rowHover
            emptyMessage='No families found'
            value={families || []}
            header={header}
            globalFilter={globalFilter}
            selection={selectedFamilies}
            sortField='name'
            sortOrder={1}
            defaultSortOrder={1}
            onSelectionChange={(e) => setSelectedFamilies(e.value)}
          >
            <Column selectionMode='multiple' style={{ width: '3em' }} />
            {columnComponents}
            <Column
              body={actionBodyTemplate}
              headerStyle={{ width: '8em', textAlign: 'center' }}
              bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
            />
          </DataTable>
        </div>
      </div>
    </>
  )
}
