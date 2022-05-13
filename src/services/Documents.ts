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
    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/${familyId}`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async updateFamilyDocument(
    token: string,
    docId: string,
    data: DocumentDataType
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/${docId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      data,
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

  static async bilkDeleteFamilyDocument(token: string, docIds: string[]) {
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
