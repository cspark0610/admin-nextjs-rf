import axios from 'axios'
import { signout } from 'next-auth/client'
const msFamily = 'ms-fands/api/v1'

export default class GenericsService {
  static getAll(token, params: string[]) {
    return axios({
      url: `${
        process.env.NEXT_PUBLIC_API_URL
      }/${msFamily}/admin/generics/all?modelNames=${params.toString()}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }

  static getGeneric(token, generic) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/generics/${generic}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }

  static create(token, generic, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/generics/${generic}`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }

  static createMultipart(token, generic, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/generics/${generic}`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }

  static updateMultipart(token, generic, genericId, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/generics/${generic}/${genericId}`,
      method: 'PUT',
      data,
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }

  static update(token, generic, genericId, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/generics/${generic}/${genericId}`,
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }

  static delete(token, generic, genericId) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/generics/${generic}/${genericId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }

  static deleteMany(token, generic, data) {
    return axios({
      url: `${
        process.env.NEXT_PUBLIC_API_URL
      }/${msFamily}/admin/generics/${generic}/bulk-delete?ids=${data.join(
        ','
      )}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        if(err.response.status === 401) {
          signout({ callbackUrl: '/login?reason=expiredSession' })
        }
      })
  }
}
