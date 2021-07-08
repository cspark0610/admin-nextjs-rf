import axios from 'axios'

const accessToken = process.env.NEXT_PUBLIC_TOKEN
const authAxios = axios.create({
    baseURL:'https://wkwwg6o26j.execute-api.eu-west-2.amazonaws.com/red-leaf-qa/ms-fands/', 
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})

export default class GenericsService{
    getAll(params: string[]){
        return authAxios.get(`generics/all?modelNames=${params.toString()}`).then(res => res.data).catch(err => console.log(err));    
    }
} 