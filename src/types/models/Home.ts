// types
import { GenericDataType } from './Generic'
import { PictureDataType } from './Family'

export type StudentRoomDataType = {
  _id?: string
  roomNumber?: number
  type?: GenericDataType | null
  floor?: GenericDataType | null
  bedType?: GenericDataType | null
  availability?: string[] | Date[]
  bathType?: GenericDataType | null
  photos?: (PictureDataType | File)[]
  aditionalFeatures?: GenericDataType[]
  bathroomLocation?: 'IN_THE_ROOM' | 'OUTSIDE_OF_THE_ROOM'
}

export type HomeDataType = {
  _id?: string
  video?: string
  address?: string
  [key: string]: any
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
  photoGroups?: { name: string; photos: (File | PictureDataType)[] }[]
  houseRooms?: { amount?: number; roomType?: GenericDataType; _id?: string }[]
}

export type UpdateHomeFilesType = {
  video?: File
  studentRooms?: { photos?: { picture: File | string }[] }[]
  photoGroups?: { name: string; photos: (File | PictureDataType)[] }
}
