// main tools
import { axios } from 'lib/InitializeAxiosConfig'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

// services
import { BaseService } from './base'

// types
import { GenericDataType } from 'types/models/Generic'

export class GenericsService extends BaseService {
  /**
   * handle get all generics by modelNames
   */
  static async getAllByModelnames(token: string, modelname: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/all?modelNames=${modelname.join()}`,
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
   * handle create by modelName
   */
  static async create(token: string, modelname: string, data: GenericDataType) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}`,
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
   * handle update by modelName and id
   */
  static async update(
    token: string,
    modelname: string,
    id: string,
    data: GenericDataType
  ) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}/${id}`,
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
   * handle delete by modelName and id
   */
  static async delete(token: string, modelname: string, id: string) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}/${id}`,
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
   * handle delete many by modelName and ids
   */
  static async deleteMany(token: string, modelname: string, ids: string[]) {
    return axios({
      url: `/${this.getFandsUrl()}/generics/${modelname}/bulk-delete?ids=${ids.join()}`,
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

export const useGenerics = () => {
  const { data: session, status } = useSession()
  const [floors, setFloors] = useState<GenericDataType[]>([])
  const [services, setServices] = useState<GenericDataType[]>([])
  const [bedTypes, setBedTypes] = useState<GenericDataType[]>([])
  const [roomTypes, setRoomTypes] = useState<GenericDataType[]>([])
  const [homeTypes, setHomeTypes] = useState<GenericDataType[]>([])
  const [roomPrivacity, setRoomPrivacity] = useState<GenericDataType[]>([])
  const [nearbyServices, setNearbyServices] = useState<GenericDataType[]>([])
  const [additionalRoomFeatures, setAdditionalRoomFeatures] = 
    useState<GenericDataType[]>([])

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          [
            'floor',
            'service',
            'bedType',
            'homeType',
            'roomType',
            'nearbyService',
            'roomPrivacity',
            'additionalRoomFeature',
          ]
        )

        setFloors(data.floor)
        setServices(data.service)
        setBedTypes(data.bedType)
        setHomeTypes(data.homeType)
        setRoomTypes(data.roomType)
        setRoomPrivacity(data.roomPrivacity)
        setNearbyServices(data.nearbyService)
        setAdditionalRoomFeatures(data.additionalRoomFeature)
      })()
    }
  }, [status, session])

  return {
    floors,
    services,
    bedTypes,
    roomTypes,
    homeTypes,
    roomPrivacity,
    nearbyServices,
    additionalRoomFeatures,
  }
}