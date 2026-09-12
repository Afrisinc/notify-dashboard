import { apiClient } from './api.service'
import type { TemplatesResponse, TemplateStatsResponse, GetTemplatesParams } from '../types'

export const templatesService = {
  getAll: async (params?: GetTemplatesParams): Promise<TemplatesResponse> => {
    const response = await apiClient.get<TemplatesResponse>('/api/v1/templates', {
      params,
    })
    return response.data
  },

  getStats: async (): Promise<TemplateStatsResponse> => {
    const response = await apiClient.get<TemplateStatsResponse>('/api/v1/templates/stats')
    return response.data
  },
}
