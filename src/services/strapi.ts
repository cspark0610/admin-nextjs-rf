import { axios } from 'lib/InitializeAxiosConfig'

export class StrapiService {
  static getMemberSituations = async () => {
    return axios({
      url: `/member-situations`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res)
      .catch((err) => err)
  }
}
