import Axios from 'axios'

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

export const axios = Axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })
