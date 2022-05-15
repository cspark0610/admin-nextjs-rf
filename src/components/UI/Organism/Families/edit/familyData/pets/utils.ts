// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Type',
    field: 'type.name',
  },
  {
    filter: false,
    field: 'name',
    header: 'Name',
  },
  {
    filter: false,
    field: 'race',
    header: 'Race',
  },
  {
    filter: false,
    field: 'age',
    header: 'Age',
  },
]
