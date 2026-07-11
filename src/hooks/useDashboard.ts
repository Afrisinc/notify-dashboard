import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'
import type { GetDashboardParams, GetRecentSendsParams } from '../types'

export const useDashboard = (params?: GetDashboardParams) => {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: async () => {
      const response = await dashboardService.getDashboard(params)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}

export const useDashboardStats = (period: string = '7d') => {
  return useQuery({
    queryKey: ['dashboard', 'stats', period],
    queryFn: async () => {
      const response = await dashboardService.getStats(period)
      return response.data
    },
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    retry: 1,
  })
}

export const useDashboardRecentSends = (params?: GetRecentSendsParams) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-sends', params],
    queryFn: async () => {
      const response = await dashboardService.getRecentSends(params)
      return response.data
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Poll every minute
    retry: 1,
  })
}
