// types
import { GenericDataType } from './Generic'

export type StudentRoomDataType = {
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
  houseRooms?: { amount?: number; roomType?: GenericDataType }[]
}
