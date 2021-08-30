import axios from 'axios'

const msFamily = 'ms-fands'

export default class InternalObservationsService{
    static createObservations(token, id, data){
        return axios({
            url: `http://localhost:5000/ms-fands/api/v1/admin/families/${id}/internal-observations`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            data
        })
    }
    static updateObservation(token, familyId, observationId){
        return axios({
            url: `http://localhost:5000/ms-fands/api/v1/admin/families/${familyId}/internal-observations/${observationId} `,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
        }).then(res => res.data).catch(err => console.log(err))
    }
    static deleteObservation(token, familyId, observationId){
        return axios({
            url: `http://localhost:5000/ms-fands/api/v1/admin/families/${familyId}/internal-observations/${observationId} `,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
        }).then(res => res.data).catch(err => console.log(err))
    }
} 