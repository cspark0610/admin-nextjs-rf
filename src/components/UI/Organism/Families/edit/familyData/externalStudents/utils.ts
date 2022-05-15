// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// bodies
import { GenericDateBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'name',
    header: 'Name',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    header: 'Gender',
    field: 'gender.name',
    filterPlaceholder: 'Search by gender',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'gender' }),
  },
  {
    field: 'stayingSince',
    header: 'Staying since',
    filterPlaceholder: 'Search by since date',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'stayingSince' }),
  },
  {
    field: 'stayingUntil',
    header: 'Staying until',
    filterPlaceholder: 'Search by until date',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'stayingUntil' }),
  },
  {
    header: 'Nationality',
    field: 'nationality.name',
    filterPlaceholder: 'Search by nationality',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'nationality' }),
  },
]
