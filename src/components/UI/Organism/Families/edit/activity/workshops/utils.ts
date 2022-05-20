// bodies
import { GenericDateBody, LabelsBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'name',
    header: 'Name',
    filterPlaceholder: 'Search by action type',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => LabelsBody({ ...item, key: 'name' }),
  },
  {
    field: 'date',
    header: 'Date',
    filterPlaceholder: 'Search by date',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'date' }),
  },
  {
    filter: false,
    field: 'remarks',
    header: 'Remarks',
    body: (item) => LabelsBody({ ...item, key: 'remarks' }),
  },
]
