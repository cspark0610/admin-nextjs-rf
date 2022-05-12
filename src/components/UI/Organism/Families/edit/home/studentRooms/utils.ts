// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'type.name',
    header: 'Room Type',
    filterPlaceholder: 'Search by room type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'roomPrivacity' }),
  },
  {
    header: 'Bath Type',
    field: 'bathType.name',
    filterPlaceholder: 'Search by bath type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'roomPrivacity' }),
  },
  {
    header: 'Bed Type',
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
