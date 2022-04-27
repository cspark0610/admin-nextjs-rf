// types
import { FormEvent, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { UserDataType } from './models/User'
import { GetServerSideProps } from 'next'

// models

export interface ChangeType extends ChangeEvent<HTMLInputElement> {}
export interface SubmitType extends FormEvent<HTMLFormElement> {}
export type GetSSPropsType<PropsType> = PropsType extends GetServerSideProps<
  infer Props,
  any
>
  ? Props
  : PropsType
export type SetStateType<objectType> = Dispatch<SetStateAction<objectType>>

declare module 'next-auth' {
  export interface Session {
    token: string
    user: UserDataType
    refreshToken: string
  }

  export interface User {
    token: string
    user: UserDataType
    refreshToken: string
    tokenExpiresIn: string
    refreshTokenExpiresIn: string
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    token: string
    user: UserDataType
    refreshToken: string
    tokenExpiresIn: string
    refreshTokenExpiresIn: string
  }
}
