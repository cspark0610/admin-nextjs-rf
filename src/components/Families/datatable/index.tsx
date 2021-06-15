import React,{useState, useRef} from 'react'
//components
import { DataTable} from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/MultiSelect';
//styles
import classes from 'styles/Families/Datatable.module.scss'


export default function Datatable() {
    const [selectedFamilies, setSelectedFamilies] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedStatus, setSelectedStatus] = useState(null);
    const dt = useRef(null);
    const data = [
        {
            name: 'Thompson',
            type: 'single parent',
            status:'active',
            location: 'Toronto',
            mainMembers: 'Jason Smith',
            familyMembers: '4',
            localManagers: 'Steve Jobs'
        },
        {
            name: 'Brown',
            type: 'single parent',
            status:'active',
            location: 'Toronto',
            mainMembers: 'Jason Smith',
            familyMembers: '4',
            localManagers: 'Steve Jobs'
        },
        {
            name: 'Chung',
            type: 'couple',
            status:'active',
            location: 'Toronto',
            mainMembers: 'Jason Smith',
            familyMembers: '4',
            localManagers: 'Steve Jobs'
        },
        
    ]
    
    
    //--- Status ------------------------------------------------------------

    const statuses = [
        'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'active'
    ];
    const onStatusChange = (e) => {
        dt.current.filter(e.value, 'status', 'equals');
        setSelectedStatus(e.value);
    }
    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }
    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>
            </React.Fragment>
        );
    }
    const statusFilter = <Dropdown value={selectedStatus} options={statuses} onChange={onStatusChange} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
   
    //End status -----------------------------------------------------------------

    const actionBodyTemplate = () => {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>
        );
    }
    
    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);
    }
    const columns = [
        {field: 'name', header: 'Name', filterPlaceholder:"Search by name"},
        {field: 'type', header: 'Type', filterPlaceholder:"Search by type"},
        {field: 'location', header: 'Location', filterPlaceholder:"Search by location"},
        {field: 'mainMembers', header: 'Main members', filterPlaceholder:"Search by main member"},
        {field: 'familyMembers', header: 'Family members', filterPlaceholder:"Search by member"},
        {field: 'localManagers', header: 'Local managers', filterPlaceholder:"Search by local manager"}
    ];
    const [selectedColumns, setSelectedColumns] = useState(columns);
    const columnComponents = selectedColumns.map(col=> {
        return <Column key={col.field} field={col.field} header={col.header} filter sortable filterPlaceholder={col.filterPlaceholder}/>;
    });
    const renderHeader = () => {
        return (
            <div className={`${classes.table_header} table-header`}>
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global search" />
                    </span>
                    <MultiSelect value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{width:'18em'}}/>
                </div>
               
               <div className={classes.button_group}>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-button-rounded"/>
                <Button label="New" icon="pi pi-plus" className="p-button-rounded"/>
               </div>
            </div>
        );
    }
    const header = renderHeader()

    return (
        <DataTable
            ref={dt} 
            className={`${classes.datatable} p-datatable-lg`}
            rowHover 
            emptyMessage="No families found" value={data}
            header={header}
            globalFilter={globalFilter}
            selection={selectedFamilies} 
            onSelectionChange={e => setSelectedFamilies(e.value)} >
                <Column selectionMode="multiple" style={{width:'3em'}}/>
                {columnComponents}
                <Column field='status' header='Status' sortable body={statusBodyTemplate} filter filterElement={statusFilter} />
                <Column body={actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
        </DataTable>
    )
}
