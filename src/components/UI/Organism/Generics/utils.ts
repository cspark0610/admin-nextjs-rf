// body
import { GenericDateBody } from 'components/UI/Molecules/Datatable/templates'

// types
import { ColumnFilterMatchModeType, ColumnProps } from 'primereact/column'
import { CreateWorkshop } from './templates/workshops'
import { CreateProvince } from './templates/provinces'
import { CreateService } from './templates/services'
import { CreateSchool } from './templates/schools'
import { CreateCity } from './templates/cities'

export const schema: ColumnProps[] = [
  {
    header: 'Id',
    field: '_id',
    filterPlaceholder: 'Search by id',
  },
  {
    field: 'name',
    header: 'Name',
    filterPlaceholder: 'Search by name',
  },
  {
    field: 'createdAt',
    header: 'Created at',
    filterPlaceholder: 'Search by date',
    filterMatchMode: 'contains' as ColumnFilterMatchModeType,
    body: (item) => GenericDateBody({ ...item, key: 'createdAt' }),
  },
]

export const modelNames = [
  {
    name: 'Academic courses',
    model: 'academicCourse',
    url: 'academic-courses',
  },
  { name: 'Bed types', model: 'bedType', url: 'bed-types' },
  { name: 'Cities', model: 'city', url: 'cities', body: CreateCity },
  { name: 'Communities', model: 'community', url: 'communities' },
  { name: 'Countries', model: 'country', url: 'countries' },
  {
    name: 'Cultural activities',
    model: 'culturalActivity',
    url: 'cultural-activities',
  },
  { name: 'Diets', model: 'diet', url: 'diets' },
  {
    name: 'Family relationships',
    model: 'familyRelationship',
    url: 'family-relationships',
  },
  { name: 'Family Rules', model: 'familyRule', url: 'family-rules' },
  { name: 'Genders', model: 'gender', url: 'genders' },
  { name: 'Home types', model: 'homeType', url: 'home-types' },
  {
    name: 'Host relationships',
    model: 'hostsRelationship',
    url: 'hosts-relationships',
  },
  { name: 'Interests', model: 'interest', url: 'interests' },
  { name: 'Labels', model: 'label', url: 'labels' },
  { name: 'Languages', model: 'language', url: 'languages' },
  { name: 'Meal plans', model: 'mealPlan', url: 'meal-plans' },
  { name: 'Nationalities', model: 'nationality', url: 'nationalities' },
  { name: 'Nearby services', model: 'nearbyService', url: 'nearby-services' },
  { name: 'Occupations', model: 'occupation', url: 'occupations' },
  { name: 'Pet types', model: 'petType', url: 'pet-types' },
  { name: 'Programs', model: 'program', url: 'programs' },
  {
    name: 'Provinces',
    model: 'province',
    url: 'provinces',
    body: CreateProvince,
  },
  { name: 'Room types', model: 'roomType', url: 'room-types' },
  {
    name: 'Room features',
    model: 'additionalRoomFeature',
    url: 'additional-room-features',
  },
  { name: 'Room location', model: 'floor', url: 'floors' },
  { name: 'Room privacity', model: 'roomPrivacity', url: 'room-privacity' },
  // { name: 'Schools', model: 'school', url: 'schools', body: CreateSchool },
  { name: 'Services', model: 'service', url: 'services' },
  { name: 'Situation', model: 'situation', url: 'situations' },
  { name: 'Transports', model: 'transport', url: 'transports' },
  {
    name: 'Workshops',
    model: 'workshop',
    url: 'workshops',
    body: CreateWorkshop,
  },
]
