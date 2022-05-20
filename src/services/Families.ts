// main tools
import { axios } from 'lib/InitializeAxiosConfig'

// setvices
import { BaseService } from './base'

// types
import {
  FamilyDataType,
  UpdateFamilyFilesType,
  FamilyPublicUrlDataType,
} from 'types/models/Family'
import { SetStateType } from 'types'
import { FilterDataType } from 'components/UI/Organism/Families/AdvancedSearch'

export class FamiliesService extends BaseService {
  /**
   * handle get all users
   */
  static async getFamilies(token: string, populate?: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families${
        populate ? `?populate=${populate.join()}` : ''
      }`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * handle delete many users
   */
  static async deleteMany(token: string, ids: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/bulk-delete?ids=${ids.join()}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * handle create family
   */
  static async createFamily(token: string, data: FamilyDataType) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  /**
   * handle update family
   */
  static async updatefamily(
    token: string,
    id: string,
    data: FamilyDataType,
    populate: string[] = []
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${id}?populate=${populate.join()}`,
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async updatefamilyfile(
    token: string,
    id: string,
    data: UpdateFamilyFilesType,
    setProgress: SetStateType<number>
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${id}/files`,
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (p) => setProgress((p.loaded / p.total) * 100),
    })
      .then((res) => {
        setProgress(0)
        return res
      })
      .catch((err) => {
        setProgress(0)
        return err
      })
  }

  static uploadFamilyJsonFile(token: string, file: FormData) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/import`,
      method: 'POST',
      data: file,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async createFamilyPublicUrl(
    token: string,
    familyId: string,
    data: FamilyPublicUrlDataType
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families-access-links/${familyId}`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async deleteManyPublicUrls(token: string, ids: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families-access-links/bulk-delete?ids=${ids.join()}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async getFamilyPublicUrls(token: string, id: string) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families-access-links/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async searchFamilies(
    token: string,
    data: { size: number; page: number; options: FilterDataType }
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/families/search`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }
  static async exportFamiliesToCsv(token: string, ids: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/export/csv?ids=${ids.join(
        ','
      )}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }
}
