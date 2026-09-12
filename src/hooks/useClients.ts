import { useQuery } from '@tanstack/react-query'
import { clientsService } from '../services'
import type { GetClientsParams, GetClientsStatsParams } from '../types'

export const useClients = (params?: GetClientsParams) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const response = await clientsService.getAll(params)
      return response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.getById(id),
    enabled: !!id,
  })
}

export const useClientStats = (params?: GetClientsStatsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['clients', 'stats', params],
    queryFn: async () => {
      const response = await clientsService.getStats(params)
      return response.data
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds - matches the server-side cache TTL
    retry: 1,
  })
}
