// main tools
import axios from 'axios'

// services
import { BaseService } from './base'

// types
import { UserDataType } from 'types/models/User'

export class UsersService extends BaseService {
  /**
   * handle get all users
   */
  static getUsers(token: string) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * handle get user by id
   */
  static getUser(token: string, id: string) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }

  /**
   * handle get user's labels
   */
  static getUserLabels(token: string, id: string) {
    return axios({
      url: `/${this.getFandsUrl()}/user/labels/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }

  /**
   * handle create user
   */
  static createUser(token: string, data: UserDataType) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }

  /**
   * handle update user data by id
   */
  static updateUser(token: string, id: string, data: UserDataType) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users/${id}`,
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * handle delete user by id
   */
  static deleteUser(token: string, id: string) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users/${id}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }

  /**
   * handle delete many users
   */
  static deleteMany(token: string, ids: string[]) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users/bulk-delete?ids=${ids.join(
        ','
      )}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }
}
