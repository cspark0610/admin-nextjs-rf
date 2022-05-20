import axios from 'axios'
import { GenericDataType } from 'types/models/Generic';
import { BaseService } from './base';

export class ObservationsService extends BaseService {
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
  static async updateObservations(
    token: string,
    familyId: string,
    ObservationsId: string,
    data: GenericDataType,
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
  static async deleteObservations(
    token: string,
    familyId: string,
    ObservationsId: string,
    data: GenericDataType,
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${familyId}/internal-observations/${ObservationsId}`,
      method: 'DELETE',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }
}
