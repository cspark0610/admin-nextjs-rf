import axios from 'axios'

const msFamily = 'ms-fands' 
export default class Home{
   static updateHomeVideo(token, id, data){
      console.log('TOKEN', token)
      return axios({
         url: `http://localhost:5000/ms-fands/api/v1/admin/families/${id}/home/video`,
         method: 'PATCH',
         headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
          data
       }).then(res => res.data).catch(err => console.log(err))
   } 
}