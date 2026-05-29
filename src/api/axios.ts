import axios, { type AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
