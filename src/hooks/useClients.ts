import { useQuery } from '@tanstack/react-query'
import { clientsService } from '../services'
import type { GetClientsParams } from '../types'

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
