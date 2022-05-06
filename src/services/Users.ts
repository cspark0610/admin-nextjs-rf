// main tools
import { axios } from 'lib/InitializeAxiosConfig'

// services
import { BaseService } from './base'

// types
import { UserDataType } from 'types/models/User'

export class UsersService extends BaseService {
  /**
   * handle get all users
   */
  static async getUsers(token: string) {
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
  static async getUser(token: string, id: string) {
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
   * handle create user
   */
  static async createUser(token: string, data: UserDataType) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users`,
      method: 'POST',
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
   * handle update user data by id
   */
  static async updateUser(token: string, id: string, data: UserDataType) {
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
   * handle delete many users
   */
  static async deleteMany(token: string, ids: string[]) {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users/bulk-delete?ids=${ids.join()}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * get all users with status
   * local coordinator
   */
  static async getLocalCoordinators(token: string) {
    return axios({
      url: `${this.getUsersUrl()}/admin/users/coordinators`,
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
}
