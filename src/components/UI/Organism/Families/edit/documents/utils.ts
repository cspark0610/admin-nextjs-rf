// types
import { GenericExternalUrl, LabelsBody } from 'components/UI/Molecules/Datatable/templates'
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'name',
    header: 'Name',
    filterPlaceholder: 'Search by name',
    body: (item) => LabelsBody({ ...item, key: 'name' }),
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'remarks',
    header: 'Description',
    filterPlaceholder: 'Search by remark',
    body: (item) => LabelsBody({ ...item, key: 'remarks' }),
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    filter: false,
    field: 'file',
    header: 'File url',
    body: (item) => GenericExternalUrl({ ...item, key: 'file' }),
  },
  {
    header: 'Owner',
    field: 'owner.firstName',
    filterPlaceholder: 'Search by owner name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => LabelsBody({ ...item.owner, key: 'firstName' }),
  },
  {
    header: 'Family',
    field: 'family.name',
    filterPlaceholder: 'Search by family name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => LabelsBody({ ...item.family, key: 'name' }),
  },
]

export const kindOptions = [
  { name: 'Host', value: 'HOST' },
  { name: 'Family Member', value: 'FAMILY_MEMBER' },
  { name: 'Tenant', value: 'TENANT' },
  { name: 'Student', value: 'STUDENT' },
  { name: 'External student', value: 'EXTERNAL_STUDENT' },
]
