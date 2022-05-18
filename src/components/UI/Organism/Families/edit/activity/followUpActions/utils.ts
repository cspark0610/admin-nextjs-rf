// bodies
import { GenericDateBody, LabelsBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'actionType',
    header: 'Action type',
    filterPlaceholder: 'Search by action type',
    body: (item) => LabelsBody({ ...item, key: 'actionType' }),
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    filter: false,
    field: 'comments',
    header: 'Comments',
    body: (item) => LabelsBody({ ...item, key: 'comments' }),
  },
  {
    field: 'date',
    header: 'Date',
    filterPlaceholder: 'Search by date',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'date' }),
  },
]
