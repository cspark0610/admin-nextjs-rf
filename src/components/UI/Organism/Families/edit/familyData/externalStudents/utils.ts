// bodies
import {
  GenericDateBody,
  GenericAgeBody,
} from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'name',
    filter: false,
    header: 'Name',
    sortable: false,
  },
  {
    filter: false,
    sortable: false,
    header: 'Gender',
    field: 'gender.name',
  },
  {
    filter: false,
    header: 'Age',
    sortable: false,
    field: 'birthDate',
    body: (item) => GenericAgeBody({ ...item, key: 'birthDate' }),
  },
  {
    filter: false,
    sortable: false,
    field: 'stayingSince',
    header: 'Staying since',
    body: (item) => GenericDateBody({ ...item, key: 'stayingSince' }),
  },
  {
    filter: false,
    sortable: false,
    field: 'stayingUntil',
    header: 'Staying until',
    body: (item) => GenericDateBody({ ...item, key: 'stayingUntil' }),
  },
  {
    filter: false,
    sortable: false,
    header: 'Nationality',
    field: 'nationality.name',
  },
]
