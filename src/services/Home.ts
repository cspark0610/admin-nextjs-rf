// main tools
import { axios } from 'lib/InitializeAxiosConfig'

// services
import { BaseService } from './base'

// types
import { HomeDataType, UpdateHomeFilesType } from 'types/models/Home'
import { SetStateType } from 'types'

export class HomeService extends BaseService {
  static async createHome(token: string, id: string, data: HomeDataType) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${id}/homes`,
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
  static async updateHome(
    token: string,
    id: string,
    data: HomeDataType,
    populate: string[] = []
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${id}/homes?populate=${populate.join()}`,
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
  static async getFamilyHome(
    token: string,
    id: string,
    populate: Array<string>
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${id}/homes?populate=${populate.join()}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static async updateHomefiles(
    token: string,
    id: string,
    data: UpdateHomeFilesType,
    setProgress: SetStateType<number>
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${id}/homes/files`,
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
}
