import axios from 'axios'

const msFamily = 'ms-fands'

export default class GenericsService{
  static getAll(token, params: string[]){
    return axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/generics/all?modelNames=${params.toString()}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.data).catch(err => console.log(err))
  }

  static getGeneric(token, generic){
    return axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/generics/${generic}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.data).catch(err => console.log(err))
  }

  static create(token, generic, data){
    return axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/generics/${generic}`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.data).catch(err => console.log(err))
  }

  static update(token, generic, genericId, data){
    return axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/generics/${generic}/${genericId}`,
        method: 'PUT',
        data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.data).catch(err => console.log(err))
  }

  static delete(token, generic, genericId){
    return axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/generics/${generic}/${genericId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.data).catch(err => console.log(err))
  }

  static deleteMany(token, generic, data){
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/generics/${generic}/bulk-delete?ids=${data.join(',')}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data).catch(err => console.log(err))
  }
} 