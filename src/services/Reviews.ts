import { IReview } from './../types/models/Review'
import { BaseService } from './base'
import { axios } from 'lib/InitializeAxiosConfig'

export class ReviewsService extends BaseService {
  static getReviewsFromAFamily(
    token: string,
    id: string,
    populate: string[] = []
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${id}/reviews?populate=${populate?.join()}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static getFamilyReview(token: string, familyId: string, reviewId: string) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${familyId}/reviews/${reviewId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static createReview(token: string, familyId: string, data: IReview) {
    let formData = new FormData()
    console.log(data)
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key as keyof typeof data] as string | Blob)
      }
    }
    return axios({
      url: `/${this.getFandsUrl()}/families/${familyId}/reviews`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static updateReview(
    token: string,
    familyId: string,
    reviewId: string,
    data: IReview
  ) {
    let formData = new FormData()
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key as keyof typeof data] as string | Blob)
      }
    }
    return axios({
      url: `/${this.getFandsUrl()}/families/${familyId}/reviews/${reviewId}`,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static deleteReview(token: string, familyId: string, reviewId: string) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${familyId}/reviews/${reviewId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }

  static bulkDeleteReview(
    token: string,
    familyId: string,
    reviewIds: string[]
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${familyId}/reviews/bulk-delete?ids=${reviewIds.join(
        ','
      )}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)
  }
}
