import axios from 'axios'

const msUsers = 'ms-users' 
export default class AuthService {
  static login(data){
    return axios.post(`http://localhost:5050/api/v1/admin/users/signInAdmin`,data).then(res => res.data).catch(err => console.log(err))
  }
}