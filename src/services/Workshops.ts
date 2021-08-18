import axios from 'axios'

const msFamily = 'ms-fands'

export default class WorkshopsService{
    static assignWorkshopToFamily(token, familyId, workshopId){
        return axios({
            url: `http://localhost:5000/api/v1/admin/families/${familyId}/${workshopId}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }).then(res => res.data).catch(err => console.log(err))
    }
}