// main tools
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

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
  schema: (ColumnProps & { defaultHidden?: boolean })[]
  actions?: {
    [key: string]: { action: () => void; icon?: Icon; danger?: boolean }
  }
}

export const DataTable: FC<DataTableProps> = ({
  schema,
  actions,
  ...props
}) => {
  const { route, asPath } = useRouter()
  const [filters, setFilters] = useState(
    `${asPath.replace(route, '').replace('?filter=', '')}` || ''
  )
  const [columnSelection, setColumnSelection] = useState(schema)

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

  useEffect(
    () => setColumnSelection(schema.filter((col) => !col.defaultHidden)),
    [schema]
  )

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
          header={headerDatatable({
            schema,
            actions,
            setFilters,
            columnSelection,
            setColumnSelection,
            globalFilter: filters,
            filters: props.globalFilterFields,
          })}>
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
