// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// bodies
import {
  GenericDateBody,
  GenericMultiDataBody,
} from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    header: 'Name',
    field: 'firstName',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    header: 'Gender',
    field: 'gender.name',
    filterPlaceholder: 'Search by gender',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'gender' }),
  },
  {
    field: 'birthDate',
    header: 'Birthdate',
    filterPlaceholder: 'Search by birthdate',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'birthDate' }),
  },
  {
    field: 'situation.name',
    header: 'Search by situation',
    filterPlaceholder: 'Search by situation',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'situation' }),
  },
  {
    filter: false,
    field: 'spokenLanguages',
    header: 'Spoken languages',
    body: (item) =>
      GenericMultiDataBody({ ...item, generic: 'spokenLanguages' }),
  },
  {
    header: 'Family relationship',
    field: 'familyRelationship.name',
    filterPlaceholder: 'Search by family relationship',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'familyRelationship' }),
  },
]
