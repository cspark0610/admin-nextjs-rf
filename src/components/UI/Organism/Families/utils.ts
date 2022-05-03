// filters
import {
  TypeFilter,
  StatusFilter,
  HostsNameTemplare,
  LocalCoordinatorFilter,
} from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    header: 'Hosts',
    field: 'mainMembers',
    body: HostsNameTemplare,
    filterPlaceholder: 'Search by name',
  },
  {
    header: 'Status',
    filterElement: StatusFilter,
    field: 'familyInternalData.status',
    filterPlaceholder: 'Search by score',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
  {
    header: 'Type',
    filterElement: TypeFilter,
    field: 'familyInternalData.type',
    filterPlaceholder: 'Search by type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
  {
    field: 'familyMembers.length',
    header: 'Number of aditional family members',
    filterPlaceholder: 'Search by number of aditional family members',
  },
  {
    field: 'localManager',
    header: 'Local Coordinator',
    filterElement: LocalCoordinatorFilter,
    filterPlaceholder: 'Search by local coordinator',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
]
