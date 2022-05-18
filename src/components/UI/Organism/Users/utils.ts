// body
import { GenericDateBody, LabelsBody } from 'components/UI/Molecules/Datatable/templates'

// filters
import { TypeFilter } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    header: 'Name',
    field: 'firstName',
    filterPlaceholder: 'Search by name',
    body: (item) => LabelsBody({ ...item, key: 'firstName' }),
  },
  {
    field: 'lastName',
    header: 'Last Name',
    filterPlaceholder: 'Search by last name',
    body: (item) => LabelsBody({ ...item, key: 'lastName' }),
  },
  {
    field: 'email',
    header: 'Email',
    filterPlaceholder: 'Search by email',
    body: (item) => LabelsBody({ ...item, key: 'email' }),
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'userType',
    header: 'Type of User',
    filterElement: TypeFilter,
    body: (item) => LabelsBody({ ...item, key: 'userType' }),
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
  {
    field: 'createdAt',
    header: 'Created at',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'createdAt' }),
  },
]
