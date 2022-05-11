// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'name',
    header: 'Name',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'remarks',
    header: 'Description',
    filterPlaceholder: 'Search by remark',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    filter: false,
    field: 'file',
    header: 'File url',
  },
  {
    header: 'Owner',
    field: 'owner.firstName',
    filterPlaceholder: 'Search by owner name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    header: 'Family',
    field: 'family.name',
    filterPlaceholder: 'Search by family name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
]
