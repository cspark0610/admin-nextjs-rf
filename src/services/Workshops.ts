import axios from 'axios'

const msFamily = 'ms-fands'

export default class WorkshopsService{
    static assignWorkshopToFamily(token, familyId, workshopId){
        return axios({
            url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${familyId}/${workshopId}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }).then(res => res.data).catch(err => console.error(err))
    }
}