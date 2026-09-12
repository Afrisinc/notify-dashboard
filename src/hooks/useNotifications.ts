import { useQuery } from '@tanstack/react-query'
import { notificationsService } from '../services/notifications.service'
import type { GetNotificationsParams, GetNotificationStatsParams } from '../types'

export const useNotifications = (params?: GetNotificationsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await notificationsService.getAll(params)
      return response
    },
    enabled,
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    retry: 1,
  })
}

export const useNotificationStats = (params?: GetNotificationStatsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['notifications', 'stats', params],
    queryFn: async () => {
      const response = await notificationsService.getStats(params)
      return response.data
    },
    enabled,
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    retry: 1,
  })
}
