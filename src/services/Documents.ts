// main tools
import { axios } from 'lib/InitializeAxiosConfig'
import { DocumentDataType } from 'types/models/Documents'

// services
import { BaseService } from './base'

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
    data: DocumentDataType
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

  static async bulkDeleteFamilyDocument(token: string, docIds: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/documents/bulk-delete?ids=${docIds.join()}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }
}
