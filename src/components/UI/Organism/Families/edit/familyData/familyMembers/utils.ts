// bodies
import {
  GenericAgeBody,
  GenericMultiDataBody,
} from 'components/UI/Molecules/Datatable/templates'

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
    header: 'Age',
    sortable: false,
    field: 'birthDate',
    body: (item) => GenericAgeBody({ ...item, key: 'birthDate' }),
  },
  {
    filter: false,
    sortable: false,
    field: 'situation.name',
    header: 'Search by situation',
  },
  {
    filter: false,
    sortable: false,
    field: 'spokenLanguages',
    header: 'Spoken languages',
    body: (item) =>
      GenericMultiDataBody({ ...item, generic: 'spokenLanguages' }),
  },
  {
    filter: false,
    sortable: false,
    header: 'Family relationship',
    field: 'familyRelationship.name',
  },
]
