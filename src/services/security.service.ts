import { apiClient } from './api.service'
import type {
  SecurityOverviewResponse,
  LoginEventsResponse,
  SecurityOverviewParams,
  LoginEventsParams,
  ApiWrapper,
  LoginEventsData,
} from '../types/security.types'

export const securityService = {
  getOverview: async (params?: SecurityOverviewParams): Promise<SecurityOverviewResponse> => {
    const response = await apiClient.get<ApiWrapper<SecurityOverviewResponse>>('/admin/internal/platform/security/overview', {
      params,
    })
    return response.data.data
  },

  getLoginEvents: async (params?: LoginEventsParams): Promise<LoginEventsResponse> => {
    const response = await apiClient.get<ApiWrapper<LoginEventsData>>('/admin/internal/platform/security/loginevents', {
      params,
    })
    return response.data.data
  },
}
