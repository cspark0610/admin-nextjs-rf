import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const accessToken = process.env.NEXT_PUBLIC_TOKEN
const msUsers = 'ms-users' 
const authAxios = axios.create({
    baseURL:apiUrl, 
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})

export default class UsersService {
  static getUsers(){
    return authAxios.get(`${msUsers}/admin/users`).then(res => res.data).catch(err => console.log(err))
  }

  static createUser(data){
    return authAxios.post(`${msUsers}/admin/users/createUser`, data).then(res => res.data).catch(err => console.log(err))
  }

  static updateUser(userId, data){
    return authAxios.patch(`${msUsers}/admin/users/${userId}`, data).then(res => res.data).catch(err => console.log(err))
  }

  static deleteUser(userId){
    return authAxios.delete(`${msUsers}/admin/users/${userId}`).then(res => res.data).catch(err => console.log(err))
  }
}