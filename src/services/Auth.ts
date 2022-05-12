import { BaseService } from './base'
import { axios } from 'lib/InitializeAxiosConfig'

type loginData = { email: string; password: string }
type refreshData = { refresh_token: string }

export class AuthService extends BaseService {
  /**
   * handle login
   */
  static login = async (data: loginData) => {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users/sign-in-admin`,
      method: 'POST',
      data,
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * handle refresh token
   */
  static refreshToken = async (data: refreshData) => {
    return axios({
      url: `/${this.getUsersUrl()}/admin/users/refresh`,
      method: 'POST',
      data,
    })
      .then((res) => res)
      .catch((err) => err)
  }
}
