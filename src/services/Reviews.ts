import { authAxios } from './getClient'

const msFamily = 'ms-fands' 
export default class ReviewsService{
   static getReviewsFromAFamily(id){
        return authAxios.get(`${msFamily}/families/${id}/reviews`).then(res => res.data).catch(err => console.log(err))
   } 
}