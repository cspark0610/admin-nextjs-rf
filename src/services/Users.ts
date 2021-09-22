import axios from 'axios'

const msUsers = 'ms-users' 
export default class UsersService {
  static getUsers(token){
    return axios({
      url: `http://localhost:5050/ms-users/api/v1/admin/users`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.error(err))
  }

  static createUser(token, data){
    return axios({
      url: `http://localhost:5050/ms-users/api/v1/admin/users`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.error(err))
  }

  static updateUser(token, userId, data){
    return axios({
      url: `http://localhost:5050/ms-users/api/v1/admin/users/${userId}`,
      method: 'PATCH',
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.error(err))
  }

  static deleteUser(token, userId){
    return axios({
      url: `http://localhost:5050/ms-users/api/v1/admin/users/${userId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.error(err))
  }

  static deleteMany(token, data){
    return axios({
      url: `http://localhost:5050/ms-users/api/v1/admin/users/bulk-delete?ids=${data.join(',')}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.error(err))
  }
}