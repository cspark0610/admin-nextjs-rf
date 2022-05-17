import { ReviewDataType } from 'types/models/Review'
import { BaseService } from './base'
import { axios } from 'lib/InitializeAxiosConfig'
import { SetStateType } from 'types'

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

  static createReview(
    token: string,
    familyId: string,
    data: ReviewDataType,
    setProgress: SetStateType<number>
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${familyId}/reviews`,
      method: 'POST',
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

  static updateReview(
    token: string,
    familyId: string,
    reviewId: string,
    data: ReviewDataType,
    setProgress: SetStateType<number>
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/families/${familyId}/reviews/${reviewId}`,
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
