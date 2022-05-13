import { BaseService } from './base'
import { axios } from 'lib/InitializeAxiosConfig'
import { DocumentDataType } from 'types/models/Documents'

export class DocumentService extends BaseService {
  static async getFamilyDocuments(token: string, id: string) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/families/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async getFamilyDocument(token: string, docId: string) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/${docId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async createFamilyDocument(
    token: string,
    familyId: string,
    data: any
  ) {
    const documentFormData = new FormData()
    documentFormData.append('file', data.file as Blob)
    documentFormData.append('name', data.name as string)
    documentFormData.append('remarks', data.remarks as string)
    documentFormData.append(
      'isPoliceCheck',
      data.isPoliceCheck.toString() as string
    )
    documentFormData.append(
      'isDeclaration',
      data.isDeclaration.toString() as string
    )
    documentFormData.append('kind', data.kindOfOwner as string)
    documentFormData.append('firstName', data.firstName as string)
    documentFormData.append('lastName', data.lastName as string)

    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/${familyId}`,
      method: 'POST',
      data: documentFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async updateFamilyDocument(token: string, docId: string, data: any) {
    const documentFormData = new FormData()
    documentFormData.append('file', data.file as Blob)
    documentFormData.append('name', data.name as string)
    documentFormData.append('remarks', data.remarks as string)
    documentFormData.append(
      'isPoliceCheck',
      data.isPoliceCheck.toString() as string
    )
    documentFormData.append(
      'isDeclaration',
      data.isDeclaration.toString() as string
    )
    documentFormData.append('kind', data.kindOfOwner as string)
    documentFormData.append('firstName', data.firstName as string)
    documentFormData.append('lastName', data.lastName as string)

    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/${docId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      data: documentFormData,
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async deleteFamilyDocument(token: string, docId: string) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/${docId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async bulkDeleteFamilyDocument(token: string, docIds: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/bulk-delete?ids=${docIds.join(
        ','
      )}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  // static getOwners(token, id) {
  //   return axios({
  //     url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/members`,
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => res.data)
  //     .catch((err) => console.error(err))
  // }
  // static createDocuments(token, familyId, body) {
  //   return axios({
  //     url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${familyId}/documents`,
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     data: body,
  //   }).then((res) => res.data)
  // }
  // static updateDocuments(token, documentId, body) {
  //   return axios({
  //     url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/documents/${documentId}`,
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     data: body,
  //   })
  // }
  // static deleteDocuments(token, documentId) {
  //   return axios({
  //     url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/documents/${documentId}`,
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  // }
  // static bulkdeleteDocuments(token, documentIds: string[]) {
  //   return axios({
  //     url: `${
  //       process.env.NEXT_PUBLIC_API_URL
  //     }/${msFamily}/admin/documents/bulk-delete?ids=${documentIds.join(',')}`,
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  // }
}
