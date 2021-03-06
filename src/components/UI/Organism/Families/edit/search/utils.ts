// types
import {
  LabelsBody,
  GenericDateBody,
  CopyClipboardBody,
} from 'components/UI/Molecules/Datatable/templates'
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
    field: 'url',
    filter: false,
    header: 'Family shareable URLs',
    body: (item) => CopyClipboardBody({ ...item, key: 'url' }),
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    header: 'Password',
    field: 'plainPassword',
    filterPlaceholder: 'Search by remark',
    body: (item) => CopyClipboardBody({ ...item, key: 'plainPassword' }),
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'expiresIn',
    header: 'Expiration date',
    filterPlaceholder: 'Search by date',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'expiresIn' }),
  },
]
