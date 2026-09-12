import { apiClient } from './api.service'
import type { AnalyticsOverviewResponse, GetAnalyticsParams } from '../types'

export const analyticsService = {
  getOverview: async (params?: GetAnalyticsParams): Promise<AnalyticsOverviewResponse> => {
    const response = await apiClient.get<AnalyticsOverviewResponse>('/api/v1/analytics', { params })
    return response.data
  },
}
