import { useQuery } from '@tanstack/react-query'
import { templatesService } from '../services/templates.service'
import type { GetTemplatesParams } from '../types'

export const useTemplates = (params?: GetTemplatesParams) => {
  return useQuery({
    queryKey: ['templates', params],
    queryFn: async () => {
      const response = await templatesService.getAll(params)
      return response
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  })
}

export const useTemplateStats = () => {
  return useQuery({
    queryKey: ['templates', 'stats'],
    queryFn: async () => {
      const response = await templatesService.getStats()
      return response.data
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  })
}
