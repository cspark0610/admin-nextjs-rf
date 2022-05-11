// filters
import { LocalCoordinatorFilter, StatusFilter, ScoreFilter } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    field: 'name',
    header: 'Hosts',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    header: 'Status',
    filterElement: StatusFilter,
    field: 'familyInternalData.status',
    filterPlaceholder: 'Search by score',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
  {
    header: 'Score ',
    field: 'familyScore',
    filterElement: ScoreFilter,
    filterPlaceholder: 'Search by type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
  {
    field: 'familyMembers.length',
    header: 'Number of aditional family members',
    filterPlaceholder: 'Search by number of aditional family members',
  },
  {
    header: 'Local Coordinator',
    filterElement: LocalCoordinatorFilter,
    filterPlaceholder: 'Search by local coordinator',
    field: 'familyInternalData.localManager.firstName',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
]
