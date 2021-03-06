// bodies
import { GenericMultiDataBody, LabelsBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    sortable: false,
    header: 'School',
    field: 'school.name',
    body: (item) => LabelsBody({ ...item.school, key: 'name' }),
  },
  {
    filter: false,
    sortable: false,
    field: 'transports',
    header: 'Transportation',
    body: (item) => GenericMultiDataBody({ ...item, generic: 'transports' }),
  },
]
