import axios from 'axios'

const msFamily = 'ms-fands' 
export default class DocumentService{
   static getFamilyDocuments(token, id){
      return axios({
         url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/documents`,
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         }
       }).then(res => res.data).catch(err => console.log(err))
   } 
}