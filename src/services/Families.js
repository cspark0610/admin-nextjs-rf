import axios from 'axios'

const apiUrl = 'https://qafands.centriadev.com/api/v1/'
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxwY29yZG92ZXNAZ21haWwuY29tIiwiaWF0IjoxNjIzNzkzMTQzfQ.QiF7Z8z45ONOdLKrkqxcQXWHxS4TiCQw7y7q3NyeL0g'

const authAxios = axios.create({
    baseURL:apiUrl,
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})

export default class FamiliesService {
    getFamilies(){
        return authAxios.get('admin/families').then(res => res.data).catch(err => console.log(err));
    }
    deleteFamilies(familiesIds){
        const promises = familiesIds.map((id)=> {
            return authAxios.delete(`admin/families/${id}`)
        })
        return Promise.all(promises).then(res => res.data).catch(err => console.log(err));
    }
}