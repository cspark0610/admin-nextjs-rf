// main tools
import axios from 'axios'

// setvices
import { BaseService } from './base'

// types
import { GenericDataType } from 'types/models/Generic'

export class ObservationsService extends BaseService {
  /**
   * handle get all Observations
   */
  static async getObservations(token: string, familyId: string) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${familyId}/internal-observations`,
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
   * handle create Observations
   */
  static async createObservations(
    token: string,
    familyId: string,
    data: GenericDataType
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${familyId}/internal-observations`,
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
   * handle update Observations
   */
  static async updateObservations(
    token: string,
    familyId: string,
    data: GenericDataType,
    ObservationsId: string
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${familyId}/internal-observations/${ObservationsId}`,
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
   * handle delete Observations
   */
  static async deleteObservations(
    token: string,
    familyId: string,
    ObservationsId: string
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${familyId}/internal-observations/${ObservationsId}`,
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
