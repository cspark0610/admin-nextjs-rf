// bodies
import { GenericDateBody, LabelsBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Name',
    sortable: false,
    field: 'firstName',
    body: (item) => LabelsBody({ ...item, key: 'firstName' }),
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
    body: (item) => LabelsBody({ ...item.occupation, key: 'name' }),
  },
]
