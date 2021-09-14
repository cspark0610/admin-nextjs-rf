import axios from 'axios'

const msFamily = 'ms-fands'
export default class FamiliesService {
  static createFamily(token, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static createHome(token, id, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/home`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static getFamily(token, id) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static exportFamiliesToCsv(token, ids) {
    return axios({
      url: `${
        process.env.NEXT_PUBLIC_API_URL
      }/${msFamily}/admin/families/export/csv?families=${ids.join(',')}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static getFamilies(token) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static updatefamily(token, id, family) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}`,
      method: 'PUT',
      data: family,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static updateFamilyFormData(token, id, family) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}`,
      method: 'PUT',
      data: family,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static updateFamilyVideo(token, id, data) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/video`,
      method: 'PATCH',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static updateFamilyHome(token, id, familyHome) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/home`,
      method: 'PUT',
      data: familyHome,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static deleteFamilies(token, familiesIds) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/bulk-delete`,
      method: 'POST',
      data: familiesIds,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static updateFamilyPictures(token, familyId, data, setProgress) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${familyId}`,
      method: 'PUT',
      data,
      onUploadProgress: (p) => {
        setProgress((p.loaded / p.total) * 100)
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
  }

  static getUsers(token) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/users`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }

  static getUser(token, email) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/users/${email}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err))
  }
}
