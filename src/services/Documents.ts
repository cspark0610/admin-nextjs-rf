import authAxios from './getClient'

const msFamily = 'ms-fands' 
export default class DocumentService{
   static getFamilyDocuments(id){
        return authAxios.get(`${msFamily}/admin/families/${id}/documents`).then(res => res.data).catch(err => console.log(err))
   } 
}