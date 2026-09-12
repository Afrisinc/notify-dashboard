import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analytics.service'
import type { GetAnalyticsParams } from '../types'

export const useAnalytics = (params?: GetAnalyticsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'overview', params],
    queryFn: async () => {
      const response = await analyticsService.getOverview(params)
      return response.data
    },
    enabled,
    staleTime: 60 * 1000, // 60 seconds - matches the server-side cache TTL
    retry: 1,
  })
}
