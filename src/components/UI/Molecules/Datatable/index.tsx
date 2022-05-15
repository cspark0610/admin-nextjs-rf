// main tools
import { useState } from 'react'

// components
import { headerDatatable } from './header'
import { DatatableSkeleton } from './skeleton'

// prime components
import { DataTable as PrimeDatatable } from 'primereact/datatable'
import { Column } from 'primereact/column'

// styles
import classes from 'styles/UI/Molecules/datatable.module.scss'

// types
import { DataTableProps as PrDatatableProps } from 'primereact/datatable'
import { ColumnProps } from 'primereact/column'
import { Icon } from 'react-bootstrap-icons'
import { FC } from 'react'

interface DataTableProps extends PrDatatableProps {
  schema: ColumnProps[]
  actions?: {
    [key: string]: { action: () => void; icon?: Icon; danger?: boolean }
  }
}

export const DataTable: FC<DataTableProps> = ({
  schema,
  actions,
  ...props
}) => {
  const [columnSelection, setColumnSelection] = useState(schema)
  const [filters, setFilters] = useState('')

  /**
   * dinamic column template
   */
  const dynamicColumns = columnSelection.map((col: ColumnProps) => (
    <Column
      filter
      sortable
      {...col}
      key={col.field}
      excludeGlobalFilter
      showFilterMenu={false}
      showClearButton={false}
      style={{ minWidth: '12rem' }}
      headerClassName={classes.colHeader}
      filterHeaderClassName={classes.colHeader}
    />
  ))

  return (
    <>
      {schema ? (
        <PrimeDatatable
          rows={10}
          paginator
          {...props}
          editMode='row'
          breakpoint='960px'
          filterDisplay='row'
          globalFilter={filters}
          responsiveLayout='stack'
          className={classes.datatable}
          emptyMessage='No results found'
          header={
            props.globalFilterFields &&
            headerDatatable({
              schema,
              actions,
              setFilters,
              columnSelection,
              setColumnSelection,
            })
          }>
          {props.selection && (
            <Column
              selectionMode='multiple'
              headerClassName={classes.colHeader}
              filterHeaderClassName={classes.colHeader}
            />
          )}
          {dynamicColumns}
          {props.onRowEditChange && (
            <Column
              rowEditor
              bodyClassName={classes.body}
              headerClassName={classes.colHeader}
              filterHeaderClassName={classes.colHeader}
            />
          )}
        </PrimeDatatable>
      ) : (
        <DatatableSkeleton />
      )}
    </>
  )
}
