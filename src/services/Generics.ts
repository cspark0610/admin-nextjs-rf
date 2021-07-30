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
} 