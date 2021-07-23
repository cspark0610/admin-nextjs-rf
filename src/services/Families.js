import authAxios from './getClient'

const msFamily = 'ms-fands'
export default class FamiliesService {
    getFamily(id){
        return authAxios.get(`${msFamily}/admin/families/${id}`).then(res => res.data).catch(err => console.log(err))
    }
    getFamilies(){
        return authAxios.get(`${msFamily}/admin/families`).then(res => res.data).catch(err => console.log(err));
    }
    static updatefamily(id, family){
        return authAxios.put(`${msFamily}/admin/families/${id}`, family);
    }
    updateFamilyHome(id, familyHome){
        return authAxios.put(`${msFamily}/admin/families/${id}/home?`, familyHome);
    }
    deleteFamilies(familiesIds){
        const promises = familiesIds.map((id)=> {
            return authAxios.delete(`${msFamily}/admin/families/${id}`)
        })
        return Promise.all(promises).then(res => res.data).catch(err => console.log(err));
    }
}