import { apiClient } from './api.service'
import type {
  DashboardResponse,
  DashboardStatsResponse,
  RecentSendsResponse,
  GetDashboardParams,
  GetRecentSendsParams,
} from '../types'

export const dashboardService = {
  getDashboard: async (params?: GetDashboardParams): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>('/api/v1/dashboard', {
      params,
    })
    return response.data
  },

  getStats: async (period: string = '7d'): Promise<DashboardStatsResponse> => {
    const response = await apiClient.get<DashboardStatsResponse>('/api/v1/dashboard/stats', {
      params: { period },
    })
    return response.data
  },

  getRecentSends: async (params?: GetRecentSendsParams): Promise<RecentSendsResponse> => {
    const response = await apiClient.get<RecentSendsResponse>('/api/v1/dashboard/recent-sends', {
      params,
    })
    return response.data
  },
}
