import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const accessToken = process.env.NEXT_PUBLIC_TOKEN
const msFamily = 'ms-fands' 
const authAxios = axios.create({
    baseURL:apiUrl, 
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})

export default class ReviewsService{
   static getReviewsFromAFamily(id){
        return authAxios.get(`${msFamily}/families/${id}/reviews`).then(res => res.data).catch(err => console.log(err))
   } 
}