// body
import { GenericDateBody } from 'components/UI/Molecules/Datatable/templates'

// filters
import { TypeFilter } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    header: 'Name',
    field: 'firstName',
    filterPlaceholder: 'Search by name',
  },
  {
    field: 'lastName',
    header: 'Last Name',
    filterPlaceholder: 'Search by last name',
  },
  {
    field: 'email',
    header: 'Email',
    filterPlaceholder: 'Search by email',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'userType',
    header: 'Type of User',
    filterElement: TypeFilter,
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
  {
    field: 'createdAt',
    header: 'Created at',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'createdAt' }),
  },
]
