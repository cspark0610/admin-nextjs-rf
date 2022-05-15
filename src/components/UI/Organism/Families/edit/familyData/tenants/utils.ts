// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// bodies
import { GenericDateBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    header: 'Name',
    field: 'firstName',
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
    field: 'birthDate',
    header: 'Birthdate',
    filterPlaceholder: 'Search by birthdate',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'birthDate' }),
  },
  {
    header: 'Occupation',
    field: 'occupation.name',
    filterPlaceholder: 'Search by occupation',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'occupation' }),
  },
]
