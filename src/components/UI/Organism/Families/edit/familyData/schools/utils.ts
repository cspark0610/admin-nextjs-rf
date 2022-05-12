// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// bodies
import { GenericMultiDataBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    header: 'Type',
    field: 'school.name',
    filterPlaceholder: 'Search by school',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'school' }),
  },
  {
    filter: false,
    field: 'transports',
    header: 'Transports',
    body: (item) => GenericMultiDataBody({ ...item, generic: 'transports' }),
  },
]
