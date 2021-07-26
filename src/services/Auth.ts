import authAxios from './getClient'

const msUsers = 'ms-users' 

export default class AuthService {
  static login(data){
    return authAxios.post(`${msUsers}/users/signIn`,data).then(res => res.data).catch(err => console.log(err))
  }
}