// filters
import {
  LabelsBody,
  ScoreFilter,
  StatusFilter,
  FamilyTypeFilter,
  LocalCoordinatorFilter,
} from 'components/UI/Molecules/Datatable/templates'

// bodies
import {
  FamilyUserBody,
  FamilyMembersBody,
  FamilyLocationBody,
} from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: (ColumnProps & { defaultHidden?: boolean })[] = [
  {
    field: 'name',
    header: 'Hosts',
    filterPlaceholder: 'Search by name',
    body: (item) => LabelsBody({ ...item, key: 'name' }),
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
  },
  {
    header: 'Status',
    filterElement: StatusFilter,
    field: 'familyInternalData.status',
    filterPlaceholder: 'Search by score',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    body: (item) => LabelsBody({ ...item.familyInternalData, key: 'status' }),
  },
  {
    defaultHidden: true,
    header: 'Kind of family',
    filterElement: FamilyTypeFilter,
    field: 'familyInternalData.type',
    filterPlaceholder: 'Search by type',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    body: (item) => LabelsBody({ ...item.familyInternalData, key: 'type' }),
  },
  {
    header: 'Score',
    defaultHidden: true,
    field: 'familyScore',
    filterElement: ScoreFilter,
    filterPlaceholder: 'Search by type',
    body: (item) => LabelsBody({ ...item, key: 'familyScore' }),
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
  },
  {
    filter: false,
    field: 'home',
    header: 'Location',
    body: FamilyLocationBody,
  },
  {
    defaultHidden: true,
    field: 'familyMembers',
    body: FamilyMembersBody,
    header: 'Number of aditional family members',
    filterPlaceholder: 'Search by number of aditional family members',
  },
  {
    header: 'Local Coordinator',
    filterElement: LocalCoordinatorFilter,
    filterPlaceholder: 'Search by local coordinator',
    field: 'familyInternalData.localManager.firstName',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    body: (item) =>
      LabelsBody({ ...item.familyInternalData.localManager, key: 'firstName' }),
  },
  {
    header: 'User',
    field: 'user.email',
    body: FamilyUserBody,
    filterPlaceholder: 'Search by user email',
  },
]
