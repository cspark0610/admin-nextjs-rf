import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const authAxios = axios.create({
    baseURL:apiUrl, 
    headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
    }
})

export const publicAxios = axios.create({
    baseURL:apiUrl,
})

export const authAxiosFormData = axios.create({
    baseURL:apiUrl, 
    headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        'Content-Type': 'multipart/form-data'
    }
})
