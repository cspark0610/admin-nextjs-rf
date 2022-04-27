import { UserTypes } from 'utils/commons'

export type UserDataType = {
  _id?: string
  labels: any[]
  email?: string
  roles?: string[]
  isLogin: boolean
  lastName?: string
  updatedAt: string
  isActive: boolean
  createdAt: string
  firstName?: string
  isVerified: boolean
  userType?: typeof UserTypes
}
