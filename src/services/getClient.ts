import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const accessToken = process.env.NEXT_PUBLIC_TOKEN

export default axios.create({
    baseURL:apiUrl, 
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})
