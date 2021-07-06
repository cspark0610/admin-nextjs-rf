import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const accessToken = process.env.NEXT_PUBLIC_TOKEN
const authAxios = axios.create({
    baseURL:apiUrl, 
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})

export default class GenericsService{
    getAll(){
        return authAxios.get(`${apiUrl}/generics/all?modelNames=languagqwees,qweqwe,interests,countries,nearbyServices,petTypes,schools`).then(res => res.data).catch(err => console.log(err));    
    }
} 