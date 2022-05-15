// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    field: 'roomNumber',
    header: 'Room number',
  },
  {
    field: 'type.name',
    header: 'Room type',
    filterPlaceholder: 'Search by room type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'roomPrivacity' }),
  },
  {
    header: 'Bath type',
    field: 'bathType.name',
    filterPlaceholder: 'Search by bath type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'roomPrivacity' }),
  },
  {
    header: 'Bed type',
    field: 'bedType.name',
    filterPlaceholder: 'Search by bed type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'bedType' }),
  },
  {
    header: 'Floor',
    field: 'floor.name',
    filterPlaceholder: 'Search by room location',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'floor' }),
  },
]
