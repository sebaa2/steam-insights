import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 10000,
})

export async function searchProfile(input) {
    const response = await api.get(`/profile/search/${input}`)
    return response.data
}

export default api