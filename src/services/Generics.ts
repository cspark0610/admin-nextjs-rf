import authAxios from './getClient'

const msFamily = 'ms-fands'

export default class GenericsService{
    getAll(params: string[]){
        return authAxios.get(`${msFamily}/generics/all?modelNames=${params.toString()}`).then(res => res.data).catch(err => console.log(err));    
    }
} 