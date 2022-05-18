// types
import { LabelsBody } from 'components/UI/Molecules/Datatable/templates'
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Type',
    sortable: false,
    field: 'type.name',
    body: (item) => LabelsBody({ ...item.type, key: 'name' }),
  },
  {
    filter: false,
    field: 'name',
    header: 'Name',
    sortable: false,
    body: (item) => LabelsBody({ ...item, key: 'name' }),
  },
  {
    filter: false,
    field: 'race',
    header: 'Breed',
    sortable: false,
    body: (item) => LabelsBody({ ...item, key: 'race' }),
  },
  {
    field: 'age',
    filter: false,
    header: 'Age',
    sortable: false,
    body: (item) => LabelsBody({ ...item, key: 'age' }),
  },
]
