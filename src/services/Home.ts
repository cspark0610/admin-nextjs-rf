import axios from 'axios'

const msFamily = 'ms-fands'
export default class Home {
  static getHomePictures(token, id) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/picture`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }

  static updateHomeVideo(token, id, data, setProgress) {
    return axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/home/video`,
      method: 'PATCH',
      onUploadProgress: (p) => setProgress((p.loaded / p.total) * 100),
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      data,
    })
      .then((res) => {
        setProgress(0)
        return res.data
      })
      .catch((err) => {
        setProgress(0)
        console.error(err)
      })
  }
}
