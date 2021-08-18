import React, { useRef, useState } from 'react'
//components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
//styles
import classes from "styles/Families/Datatable.module.scss";

// interface ColumnsType {
//     field: string,
//     header: string,
//     filterPlaceholder: string
// }
interface Props {
  name: string,
  content: any,
  columns: any,
  defaultSortField: string,
  create?: () => void,
  edit?: (param:any)=> void
  onDelete?: (params: any) => void
  deleteMany?: any
}
const Table: React.FC<Props> = ({ name, defaultSortField, content, columns, create, edit, onDelete, deleteMany }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedContent, setSelectedContent] = useState(null)
  const [deletedItem, setDeletedItem] = useState(null)
  const toast = useRef(null)
  const dt = useRef()
  const editItem = (rowData) => {
    edit(rowData)
  }
  const showWarn = () => {
    toast.current.show({severity:'warn', summary: 'Warn Message', detail:'You need to select a record', life: 3000});
  }
  // const confirmDeleteItem = async (rowData) => {
  //   await setDeletedItem(rowData)
  //   if(selectedContent){
  //     await confirmDialog({
  //           message: 'Do you want to delete this record?',
  //           header: 'Delete Confirmation',
  //           icon: 'pi pi-info-circle',
  //           acceptClassName: 'p-button-danger',
  //           accept: handleDelete,
  //           reject: ()=> {}
  //           })
  //     }else if(!selectedContent){
  //       showWarn()
  //     };
  // }

  const handleDelete = (rowData) => {
    onDelete(rowData)
  }


  // const handleDelete= () => {
  //     onDelete(deletedItem)
  // };
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
            onClick={() => deleteMany(selectedContent)}
          />
          <Button label="New" icon="pi pi-plus" className="p-button-rounded" onClick={() => {create()}} />
        </div>
      </div>
    );
  };
  const header = renderHeader();
  const actionBodyTemplate = (rowData) => {
    return (
      <div className={classes.actions_field}>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-mr-2" onClick={() => editItem(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined" onClick={() => handleDelete(rowData)} />
      </div>
    );
  }
  const columnComponents = columns.map((col, index) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        filter
        filterMatchMode="contains"
        sortable
        filterPlaceholder={col.filterPlaceholder} />
    )
  })
  return (
    <div className="datatable-responsive-demo">
      <div className="card">
        <DataTable
          className="p-datatable-responsive-demo"
          ref={dt}
          value={content || []}
          rowHover
          header={header}
          selection={selectedContent}
          globalFilter={globalFilter}
          onSelectionChange={(e) => setSelectedContent(e.value)}
          emptyMessage={`No ${name} found`}
          sortField={defaultSortField}
          sortOrder={1}
          defaultSortOrder={1}
        >
          <Column selectionMode="multiple" style={{ width: "3em" }} />
          {columnComponents}
          <Column className={classes.center} header="Actions" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
      <Toast ref={toast} />
    </div>
  )
}
export default Table