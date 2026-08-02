import { apiClient } from './api.service'
import type {
  SecurityOverviewResponse,
  LoginEventsResponse,
  SecurityOverviewParams,
  LoginEventsParams,
} from '../types/security.types'

export const securityService = {
  getOverview: async (params?: SecurityOverviewParams): Promise<SecurityOverviewResponse> => {
    const response = await apiClient.get<SecurityOverviewResponse>('/admin/internal/platform/security/overview', {
      params,
    })
    return response.data
  },

  getLoginEvents: async (params?: LoginEventsParams): Promise<LoginEventsResponse> => {
    const response = await apiClient.get<LoginEventsResponse>('/admin/internal/platform/security/loginevents', {
      params,
    })
    return response.data
  },
}
