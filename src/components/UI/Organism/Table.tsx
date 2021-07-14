import React, { useRef, useState } from 'react'
//components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
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
  create?: () => void
}
const Table: React.FC<Props> = ({ name, content, columns, create }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedContent, SetSelectedContent] = useState(null)
  const dt = useRef()
  const editItem = (rowData) => { }
  const confirmDeleteItem = (rowData) => { }

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
            onClick={() => confirmDeleteItem(selectedContent)}
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
        <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined" onClick={() => confirmDeleteItem(rowData)} />
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
          onSelectionChange={(e) => SetSelectedContent(e.value)}
          emptyMessage={`No ${name} found`}
        >
          <Column selectionMode="multiple" style={{ width: "3em" }} />
          {columnComponents}
          <Column className={classes.center} header="Actions" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </div>
  )
}
export default Table