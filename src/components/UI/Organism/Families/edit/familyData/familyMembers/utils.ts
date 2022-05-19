// bodies
import {
  LabelsBody,
  GenericAgeBody,
  GenericMultiDataBody,
  FamilyMembersSituationBody,
} from 'components/UI/Molecules/Datatable/templates'

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
    header: 'Age',
    sortable: false,
    field: 'birthDate',
    body: (item) => GenericAgeBody({ ...item, key: 'birthDate' }),
  },
  {
    filter: false,
    sortable: false,
    field: 'situation',
    header: 'Search by situation',
    body: FamilyMembersSituationBody,
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
    body: (item) => LabelsBody({ ...item.familyRelationship, key: 'name' }),
  },
]
