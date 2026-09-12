import { apiClient } from './api.service'
import type {
  NotificationsResponse,
  NotificationStatsResponse,
  GetNotificationsParams,
  GetNotificationStatsParams,
} from '../types'

export const notificationsService = {
  getAll: async (params?: GetNotificationsParams): Promise<NotificationsResponse> => {
    const response = await apiClient.get<NotificationsResponse>('/api/v1/notifications', {
      params,
    })
    return response.data
  },

  getStats: async (params?: GetNotificationStatsParams): Promise<NotificationStatsResponse> => {
    const response = await apiClient.get<NotificationStatsResponse>('/api/v1/notifications/stats', {
      params,
    })
    return response.data
  },
}
