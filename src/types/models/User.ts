import { UserTypes } from 'utils/commons'

export type UserDataType = {
  id?: string
  _id?: string
  labels?: any[]
  email?: string
  roles?: string[]
  isLogin?: boolean
  password?: string
  lastName?: string
  updatedAt?: string
  isActive?: boolean
  createdAt?: string
  firstName?: string
  isVerified?: boolean
  confirmPassword?: string
  userType?: keyof typeof UserTypes | null
}
