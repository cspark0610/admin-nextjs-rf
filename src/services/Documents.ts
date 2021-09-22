import axios from 'axios'

const msFamily = 'ms-fands' 
export default class DocumentService{
   static getFamilyDocuments(token, id){
      return axios({
         url: `http://localhost:5000/ms-fands/api/v1/admin/families/${id}/documents`,
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         }
       }).then(res => res.data).catch(err => console.error(err))
   } 
   static getOwners(token, id){
        return axios({
           url :`http://localhost:5000/ms-fands/api/v1/admin/families/${id}/members`,
           method: 'GET',
           headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          } 
        }).then(res => res.data).catch(err => console.error(err))
   }
   static createDocuments(token, familyId ,body) {
     return axios({
           url :`http://localhost:5000/ms-fands/api/v1/admin/families/${familyId}/documents`,
           method: 'POST',
           headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
          data: body 
        }).then(res => res.data)
     }
   static updateDocuments(token, documentId ,body) {
     return axios({
           url :`http://localhost:5000/ms-fands/api/v1/admin/documents/${documentId}`,
           method: 'PUT',
           headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
          data: body 
        })
     }
   static deleteDocuments(token, documentId) {
     return axios({
           url :`http://localhost:5000/ms-fands/api/v1/admin/documents/${documentId}`,
           method: 'DELETE',
           headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          }
        })}
   static bulkdeleteDocuments(token, documentIds :string[]) {
     return axios({
           url :`http://localhost:5000/ms-fands/api/v1/admin/documents/bulk-delete?ids=${documentIds.join(',')}`,
           method: 'DELETE',
           headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          }
        })
     }
}