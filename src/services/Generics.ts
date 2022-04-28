// main tools
import axios from 'axios'

// services
import { BaseService } from './base'

// types
import { GenericDataType } from 'types/models/Generic'

export class GenericsService extends BaseService {
  /**
   * handle get all generics by modelNames
   */
  static getAllByModelnames(token: string, modelname: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/all?modelNames=${modelname.join()}`,
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
   * handle create by modelName
   */
  static create(token: string, modelname: string, data: GenericDataType) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}`,
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
   * handle update by modelName and id
   */
  static update(
    token: string,
    modelname: string,
    id: string,
    data: GenericDataType
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}/${id}`,
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

  /**
   * handle delete by modelName and id
   */
  static delete(token: string, modelname: string, id: string) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}/${id}`,
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
   * handle delete many by modelName and ids
   */
  static deleteMany(token: string, modelname: string, ids: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}/bulk-delete?ids=${ids.join()}`,
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
