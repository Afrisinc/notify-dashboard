import { apiClient } from './api.service'
import type { Client, ClientsResponse, GetClientsParams, ClientsStatsResponse, GetClientsStatsParams } from '../types'

export const clientsService = {
  getAll: async (params?: GetClientsParams): Promise<ClientsResponse> => {
    const response = await apiClient.get<ClientsResponse>('/api/v1/clients', {
      params,
    })
    return response.data
  },

  getById: async (id: number): Promise<Client> => {
    const response = await apiClient.get<Client>(`/api/v1/clients/${id}`)
    return response.data
  },

  getStats: async (params?: GetClientsStatsParams): Promise<ClientsStatsResponse> => {
    const response = await apiClient.get<ClientsStatsResponse>('/api/v1/clients/stats', { params })
    return response.data
  },

  // Add more methods as needed (create, update, delete)
}
