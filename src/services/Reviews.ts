import axios from 'axios'

const msFamily = 'ms-fands/api/v1'
export default class ReviewsService {
  static getReviewsFromAFamily(token, id) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/reviews`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }

  static createReview(token, id, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/families/${id}/reviews`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
  }

  static updateReview(token, familyId, reviewId, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/families/${familyId}/reviews/${reviewId}`,
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
  }

  static deleteReview(token, familyId, reviewId) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/families/${familyId}/reviews/${reviewId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  static deleteManyReviews(token, familyId, reviewIds) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/families/${familyId}/reviews/bulk-delete?ids=${reviewIds}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
