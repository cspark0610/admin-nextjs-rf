// types
import { GenericDataType } from './Generic'

export type StudentRoomDataType = {
  photos?: any[]
  roomNumber?: number
  type?: GenericDataType
  floor?: GenericDataType
  bedType?: GenericDataType
  bathType?: GenericDataType
  availability?: string[] | Date[]
  aditionalFeatures?: GenericDataType[]
  bathroomLocation?: 'IN_THE_ROOM' | 'OUTSIDE_OF_THE_ROOM'
}

export type HomeDataType = {
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
  houseRooms?: { amount?: number; roomType?: GenericDataType }[]
}
