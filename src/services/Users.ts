import authAxios from './getClient'

const msUsers = 'ms-users' 
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