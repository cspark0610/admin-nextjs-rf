// main tools
import { axios } from 'lib/InitializeAxiosConfig'

// setvices
import { BaseService } from './base'

// types
import { FamilyDataType } from 'types/models/Family'

export class FamiliesService extends BaseService {
  /**
   * handle get all users
   */
  static async getFamilies(token: string, populate?: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families${
        populate ? `?populate=${populate.join()}` : ''
      }`,
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
   * handle delete many users
   */
  static async deleteMany(token: string, ids: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/bulk-delete?ids=${ids.join()}`,
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
   * handle create family
   */
  static async createFamily(token: string, data: FamilyDataType) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families`,
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
   * handle update family
   */
  static async updatefamily(token: string, id: string, data: FamilyDataType) {
    return axios({
      url: `/${this.getFandsUrl()}/admin/families/${id}`,
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res)
      .catch((err) => err)

    // return this.request(token, family, `/admin/families/${id}`, "PUT");
  }

  // static getFamily(token: string, id: string) {
  //   return this.request(token, null, `/admin/families/${id}/home`, "GET");
  // }

  // //this is a multipart request
  // static updateFamilyFormData(token: string, id: string, family: any) {
  //   return axios({
  //     url: `${
  //       process.env.NEXT_PUBLIC_API_URL
  //     }/${this.getFandsUrl()}/admin/families/${id}`,
  //     method: "PUT",
  //     data: family,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => res.data)
  //     .catch((err) => {
  //       console.error(err);
  //       if (err.response.status === 401) {
  //         signOut({ callbackUrl: "/login?reason=expiredSession" });
  //       }
  //     });
  // }

  // static updateFamilyVideo(
  //   token: string,
  //   id: string,
  //   data: any,
  //   setProgress: any
  // ) {
  //   return axios({
  //     url: `${
  //       process.env.NEXT_PUBLIC_API_URL
  //     }/${this.getFandsUrl()}/admin/families/${id}/video`,
  //     method: "PATCH",
  //     data,
  //     onUploadProgress: (p) => setProgress((p.loaded / p.total) * 100),
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => {
  //       setProgress(0);
  //       return res.data;
  //     })
  //     .catch((err) => {
  //       setProgress(0);
  //       console.error(err);
  //     });
  // }

  // static updateFamilyPictures(
  //   token: string,
  //   familyId: string,
  //   data: any,
  //   setProgress: any
  // ) {
  //   return axios({
  //     url: `${
  //       process.env.NEXT_PUBLIC_API_URL
  //     }/${this.getFandsUrl()}/admin/families/${familyId}`,
  //     method: "PUT",
  //     data,
  //     onUploadProgress: (p) => {
  //       setProgress((p.loaded / p.total) * 100);
  //     },
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // }

  // /**
  //  *
  //  * Home CRUD
  //  *
  //  */

  // static createHome(token: string, id: string, data: any) {
  //   return this.request(token, data, `/admin/families/${id}/home`, "POST");
  // }

  // static updateFamilyHome(token: string, id: string, familyHome: any) {
  //   return this.request(token, familyHome, `/admin/families/${id}/home`, "PUT");
  // }

  // /**
  //  *
  //  * Users CRUD
  //  *
  //  */

  // static getUsers(token: string) {
  //   return this.request(token, null, `/admin/users`, "GET");
  // }

  // static getUser(token: string, email: string) {
  //   return this.request(token, null, `/admin/users/${email}`, "GET");
  // }

  // static importFamilies(token: string, data: any) {
  //   return this.request(token, data, `/admin/families/import`, "POST");
  // }

  // // ExportCSV

  // static exportFamiliesToCsv(token: string, ids: string[]) {
  //   return this.request(
  //     token,
  //     null,
  //     `/admin/families/export/csv?families=${ids.join(",")}`,
  //     "GET"
  //   );
  // }
}
