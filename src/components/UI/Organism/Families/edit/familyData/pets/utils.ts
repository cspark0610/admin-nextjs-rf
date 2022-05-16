// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Type',
    sortable: false,
    field: 'type.name',
  },
  {
    filter: false,
    field: 'name',
    header: 'Name',
    sortable: false,
  },
  {
    filter: false,
    field: 'race',
    header: 'Breed',
    sortable: false,
  },
  {
    field: 'age',
    filter: false,
    header: 'Age',
    sortable: false,
  },
]
