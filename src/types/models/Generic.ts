export type GenericDataType = {
  date?: Date
  _id?: string
  name?: string
  type?: string
  city?: string
  email?: string
  content?: string
  remarks?: string
  country?: string
  province?: string
  latitude?: number
  courses?: string[]
  firstName?: string
  community?: string
  longitude?: number
  createdAt?: string
  icon?: string | File
  isFreeComment?: boolean
  author?: GenericDataType
}

export type UseGenericsModelsDataType = {
  academicCourse: GenericDataType[]
  bedType: GenericDataType[]
  city: GenericDataType[]
  community: GenericDataType[]
  country: GenericDataType[]
  culturalActivity: GenericDataType[]
  diet: GenericDataType[]
  familyRelationship: GenericDataType[]
  familyRule: GenericDataType[]
  gender: GenericDataType[]
  homeType: GenericDataType[]
  hostsRelationship: GenericDataType[]
  interest: GenericDataType[]
  label: GenericDataType[]
  language: GenericDataType[]
  mealPlan: GenericDataType[]
  nationality: GenericDataType[]
  nearbyService: GenericDataType[]
  occupation: GenericDataType[]
  petType: GenericDataType[]
  program: GenericDataType[]
  province: GenericDataType[]
  roomType: GenericDataType[]
  additionalRoomFeature: GenericDataType[]
  floor: GenericDataType[]
  roomPrivacity: GenericDataType[]
  school: GenericDataType[]
  service: GenericDataType[]
  situation: GenericDataType[]
  transport: GenericDataType[]
  workshop: GenericDataType[]
}
