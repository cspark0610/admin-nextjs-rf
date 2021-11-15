import { useRef, useState, useContext } from 'react'
//components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { FamilyContext } from 'context/FamilyContext'
//styles
import classes from 'styles/Families/Datatable.module.scss'

interface Props {
  name: string
  content: any
  columns: any
  defaultSortField: string
  create?: () => void
  edit?: (param: any) => void
  onDelete?: (params: any) => void
  deleteMany?: any
}
const Table: React.FC<Props> = ({
  name,
  content,
  columns,
  create,
  edit,
  onDelete,
  deleteMany,
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedContent, setSelectedContent] = useState(null)
  const [deletedItem, setDeletedItem] = useState(null)
  const toast = useRef(null)
  const dt = useRef()
  const editItem = (rowData) => {
    edit(rowData)
  }

  const { activeUserType } = useContext(FamilyContext)

  const handleDelete = (rowData) => {
    onDelete(rowData)
  }

  const renderHeader = () => {
    return (
      <div className={`${classes.table_header} table-header`}>
        <div>
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText
              type='search'
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder='Global search'
            />
          </span>
        </div>
        {activeUserType !== 'Reader' && (
          <div className={classes.button_group}>
            <Button
              label='Delete'
              icon='pi pi-trash'
              className='p-button-danger p-button-rounded'
              onClick={() => deleteMany(selectedContent)}
            />
            <Button
              label='New'
              icon='pi pi-plus'
              className='p-button-rounded'
              onClick={() => {
                create()
              }}
            />
          </div>
        )}
      </div>
    )
  }
  const header = renderHeader()
  const actionBodyTemplate = (rowData) => {
    return (
      <div className={classes.actions_field}>
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-outlined p-mr-2'
          onClick={() => editItem(rowData)}
        />
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-outlined'
          onClick={() => handleDelete(rowData)}
        />
      </div>
    )
  }
  const columnComponents = columns.map((col) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        sortable={false}
        body={(item, key) => {
          if (key.field === 'aditionalFeatures') {
            const formatedAditionalFeatures = item[key.field].map(
              (item) => item?.name
            )
            return formatedAditionalFeatures.join(', ')
          } else return item[key.field]
        }}
      />
    )
  })
  return (
    <div className='datatable-responsive-demo'>
      <div className='card'>
        <DataTable
          className='p-datatable-responsive-demo'
          ref={dt}
          value={content || []}
          rowHover
          header={header}
          selection={selectedContent}
          globalFilter={globalFilter}
          onSelectionChange={(e) => setSelectedContent(e.value)}
          emptyMessage={`No ${name} found`}
        >
          <Column selectionMode='multiple' style={{ width: '3em' }} />
          {columnComponents}
          {activeUserType !== 'Reader' && (
            <Column
              className={classes.center}
              header='Actions'
              body={actionBodyTemplate}
            ></Column>
          )}
        </DataTable>
      </div>
      <Toast ref={toast} />
    </div>
  )
}
export default Table
