import axios from 'axios'

const msUsers = 'ms-users'
export default class AuthService {
  static login(data) {
    return axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/${msUsers}/admin/users/signInAdmin`,
        data
      )
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }
  static refreshToken(data) {
    return axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/${msUsers}/admin/users/refresh_token`,
        data
      )
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }
}
