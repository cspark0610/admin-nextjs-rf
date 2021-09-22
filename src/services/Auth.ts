import axios from 'axios'

const msUsers = 'ms-users'
export default class AuthService {
  static login(data) {
    return axios
      .post(
        `http://localhost:5050/ms-users/api/v1/admin/users/signInAdmin`,
        data
      )
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }
  static refreshToken(data) {
    return axios
      .post(
        `http://localhost:5050/ms-users/api/v1/admin/users/refresh_token`,
        data
      )
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }
}
