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
   static getOwners(token, id){
        return axios({
           url :`${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/members`,
           method: 'GET',
           headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          } 
        }).then(res => res.data).catch(err => console.log(err))
   }
   static createDocuments(token, familyId ,body) {
     return axios({
           url :`${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${familyId}/documents`,
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
           url :`${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/documents/${documentId}`,
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
           url :`${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/documents/${documentId}`,
           method: 'DELETE',
           headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          }
        })}
   static bulkdeleteDocuments(token, documentIds :string[]) {
     return axios({
           url :`${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/documents/bulk-delete?ids=${documentIds.join(',')}`,
           method: 'DELETE',
           headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          }
        })
     }
}