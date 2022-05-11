// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    header: 'Type',
    field: 'type.name',
    filterPlaceholder: 'Search by type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'petType' }),
  },
  {
    field: 'name',
    header: 'Name',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'race',
    header: 'Race',
    filterPlaceholder: 'Search by race',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'age',
    header: 'Age',
    filterPlaceholder: 'Search by age',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
]
