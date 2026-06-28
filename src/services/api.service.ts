import axios from 'axios'
import { getToken, clearSession } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/env'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// On 401 — clear session and redirect to SSO entry point
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      window.location.replace('/')
    }
    return Promise.reject(error)
  }
)
