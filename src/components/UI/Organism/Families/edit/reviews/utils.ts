// filters
import { GenericFilter } from 'components/UI/Molecules/Datatable/templates'

// bodies
import { GenericDateBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Image',
    field: 'studentPhoto',
  },
  {
    header: 'Name',
    field: 'studentName',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    header: 'Nationality',
    field: 'studentNationality.name',
    filterPlaceholder: 'Search by nationality',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) =>
      GenericFilter({ ...options, key: 'nationality' }),
  },
  {
    field: 'program',
    header: 'Program or course',
    filterPlaceholder: 'Search by programs',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'program' }),
  },
  {
    field: 'family.name',
    header: 'Search by family',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    field: 'overallScore',
    header: 'Search by score',
    filterPlaceholder: 'Search by score',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    /**
     * Add custom filter and body for rate
     */
  },
]
