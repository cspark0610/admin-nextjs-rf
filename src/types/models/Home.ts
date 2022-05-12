// types
import { GenericDataType } from './Generic'

export type StudentRoomDataType = {
  _id?: string
  photos?: any[]
  roomNumber?: number
  type?: GenericDataType | null
  floor?: GenericDataType | null
  bedType?: GenericDataType | null
  bathType?: GenericDataType | null
  availability?: string[] | Date[]
  aditionalFeatures?: GenericDataType[]
  bathroomLocation?: 'IN_THE_ROOM' | 'OUTSIDE_OF_THE_ROOM'
}

export type StudentRoomDataTypeOnlyIds = {
  _id?: string
  photos?: any[]
  roomNumber?: number
  type?: string
  floor?: string
  bedType?: string[]
  bathType?: string[]
  availability?: string[] | Date[]
  aditionalFeatures?: string[]
  bathroomLocation?: 'IN_THE_ROOM' | 'OUTSIDE_OF_THE_ROOM'
}

export type HomeDataType = {
  _id?: string
  video?: string
  address?: string
  postalCode?: string
  description?: string
  city?: GenericDataType
  cityFreeComment?: string
  mainIntersection?: string
  country?: GenericDataType
  province?: GenericDataType
  homeType?: GenericDataType
  services?: GenericDataType[]
  nearbyServices?: GenericDataType[]
  studentRooms?: StudentRoomDataType[]
  photoGroups?: { name: string; photos: { photo: string }[] }[]
  houseRooms?: { amount?: number; roomType?: GenericDataType; _id?: string }[]
}
