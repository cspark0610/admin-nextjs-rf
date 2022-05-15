// bodies
import { GenericDateBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Name',
    sortable: false,
    field: 'firstName',
  },
  {
    filter: false,
    sortable: false,
    header: 'Gender',
    field: 'gender.name',
  },
  {
    filter: false,
    sortable: false,
    field: 'birthDate',
    header: 'Birthdate',
    body: (item) => GenericDateBody({ ...item, key: 'birthDate' }),
  },
  {
    filter: false,
    sortable: false,
    header: 'Occupation',
    field: 'occupation.name',
  },
]
