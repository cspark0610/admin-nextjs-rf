// bodies
import {
  GenericDateBody,
  GenericAgeBody,
  LabelsBody,
} from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'name',
    filter: false,
    header: 'Name',
    sortable: false,
    body: (item) => LabelsBody({ ...item, key: 'name' }),
  },
  {
    filter: false,
    sortable: false,
    header: 'Gender',
    field: 'gender.name',
    body: (item) => LabelsBody({ ...item.gender, key: 'name' }),
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
    body: (item) => LabelsBody({ ...item.nationality, key: 'name' }),
  },
]
