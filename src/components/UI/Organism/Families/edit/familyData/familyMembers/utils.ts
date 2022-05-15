// bodies
import {
  GenericDateBody,
  GenericMultiDataBody,
} from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Name',
    field: 'firstName',
  },
  {
    filter: false,
    header: 'Gender',
    field: 'gender.name',
  },
  {
    filter: false,
    field: 'birthDate',
    header: 'Birthdate',
    body: (item) => GenericDateBody({ ...item, key: 'birthDate' }),
  },
  {
    filter: false,
    field: 'situation.name',
    header: 'Search by situation',
  },
  {
    filter: false,
    field: 'spokenLanguages',
    header: 'Spoken languages',
    body: (item) =>
      GenericMultiDataBody({ ...item, generic: 'spokenLanguages' }),
  },
  {
    filter: false,
    header: 'Family relationship',
    field: 'familyRelationship.name',
  },
]
