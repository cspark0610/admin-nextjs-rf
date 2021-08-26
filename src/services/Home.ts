import axios from 'axios'

const msFamily = 'ms-fands' 
export default class Home{
   static updateHomeVide(token, id, data){
      return axios({
         url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/home`,
         method: 'PUT',
         headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
          data
       }).then(res => res.data).catch(err => console.log(err))
   } 
}