import axios from 'axios'

const msFamily = 'ms-fands' 
export default class ReviewsService{
   static getReviewsFromAFamily(token, id){
         return axios({
            url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/families/${id}/reviews`,
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
         }).then(res => res.data).catch(err => console.log(err))
   } 
   static createReview(token, id, data){
         return axios({
            url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/families/${id}/reviews`,
            method: 'POST',
            data,
            headers: {
               "Content-Type": "multipart/form-data",
               'Authorization': `Bearer ${token}`
            },
            })
   }
}