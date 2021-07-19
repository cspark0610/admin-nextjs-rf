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

export default class FamiliesService {
    getFamily(id){
        return authAxios.get(`${msFamily}/admin/families/${id}`)
    }
    getFamilies(){
        return authAxios.get(`${msFamily}/admin/families`).then(res => res.data).catch(err => console.log(err));
    }
    updatefamily(id, family){
        return authAxios.put(`${msFamily}/admin/families/${id}`, family)
    }
    deleteFamilies(familiesIds){
        const promises = familiesIds.map((id)=> {
            return authAxios.delete(`${msFamily}/admin/families/${id}`)
        })
        return Promise.all(promises).then(res => res.data).catch(err => console.log(err));
    }
    getReviews(id){
        return authAxios.get(`${msFamily}/families/${id}/reviews`).then(res => res.data).catch(err => console.log(err));
    }
}