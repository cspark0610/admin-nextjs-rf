// filters
import {
  GenericFilter,
  GenericExternalUrl,
} from 'components/UI/Molecules/Datatable/templates'

import { GenericDateBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'

export const schema: ColumnProps[] = [
  {
    filter: false,
    header: 'Image',
    field: 'studentPhoto',
    body: (item) => GenericExternalUrl({ ...item, key: 'studentPhoto' }),
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
    field: 'program.name',
    header: 'Program or course',
    filterPlaceholder: 'Search by programs',
    filterMatchMode: 'equals' as ColumnFilterMatchModeType,
    filterElement: (options) => GenericFilter({ ...options, key: 'program' }),
  },
  {
    field: 'date',
    header: 'Search by date',
    filterPlaceholder: 'Search by name',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'date' }),
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

export const fieldTitles = [
  { title: 'Student name', name: 'studentName' },
  { title: 'Nationality', name: 'studentNationality' },
  { title: 'Course or program', name: 'program' },
  { title: 'School', name: 'studentSchool' },
  { title: 'Date', name: 'date' },
  { title: 'Comments', name: 'feedback' },
  { title: 'Student video', name: 'studentVideo' },
  { title: 'Student photo', name: 'studentPhoto' },
]
