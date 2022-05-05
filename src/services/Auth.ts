import axios from 'axios'
import { BaseService } from './base'

type loginData = { email: string; password: string }
type refreshData = { refresh_token: string }

export default class AuthService extends BaseService {
  /**
   * handle login
   */
  static login = async (data: loginData) => {
    return axios
      .post(`/${this.getUsersUrl()}/admin/users/sign-in-admin`, data)
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * handle refresh token
   */
  static refreshToken = (data: refreshData) => {
    return axios
      .post(`/${this.getUsersUrl()}/admin/users/refresh_token`, data)
      .then((res) => res)
      .catch((err) => err)
  }
}
