import axios from 'axios'

const msUsers = 'ms-users' 
export default class UsersService {
  static getUsers(token){
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msUsers}/admin/users`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.log(err))
  }

  static createUser(token, data){
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msUsers}/admin/users`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.log(err))
  }

  static updateUser(token, userId, data){
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msUsers}/admin/users/${userId}`,
      method: 'PATCH',
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.log(err))
  }

  static deleteUser(token, userId){
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msUsers}/admin/users/${userId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.log(err))
  }

  static deleteMany(token, data){
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msUsers}/admin/users/bulk-delete?ids=${data.join(',')}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.log(err))
  }
}