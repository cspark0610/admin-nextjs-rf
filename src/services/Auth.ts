import axios from 'axios'

type loginData = { email: string; password: string }
type refreshData = { refresh_token: string }

export default class AuthService {
  private static msUsers = 'ms-users/api/v1'

  static login = (data: loginData) => {
    return axios
      .post(`/${this.msUsers}/admin/users/sign-in-admin`, data)
      .then((res) => res)
      .catch((err) => err)
  }
  static refreshToken = (data: refreshData) => {
    return axios
      .post(`/${this.msUsers}/admin/users/refresh_token`, data)
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }
}
