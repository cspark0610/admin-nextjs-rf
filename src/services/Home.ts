// main tools
import axios from 'axios'

// services
import { BaseService } from './base'

// types
import { HomeDataType } from 'types/models/Home'

export class HomeService extends BaseService {
  static createHome(token: string, id: string, data: HomeDataType) {
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
  // static getHomePictures(token: string, id: string) {
  //   return axios({
  //     url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/picture`,
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => res.data)
  //     .catch((err) => console.error(err))
  // }

  // static updateHomeVideo(token, id, data, setProgress) {
  //   return axios({
  //     url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${id}/home/video`,
  //     method: 'PATCH',
  //     onUploadProgress: (p) => setProgress((p.loaded / p.total) * 100),
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     data,
  //   })
  //     .then((res) => {
  //       setProgress(0)
  //       return res.data
  //     })
  //     .catch((err) => {
  //       setProgress(0)
  //       console.error(err)
  //     })
  // }
}
