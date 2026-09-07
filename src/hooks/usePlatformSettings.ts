import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { platformSettingsService } from '../services'
import type { UpdatePlatformEmailSettingsPayload } from '../types'

const settingsKey = ['platform-email-settings']

export const usePlatformEmailSettings = () => {
  return useQuery({
    queryKey: settingsKey,
    queryFn: () => platformSettingsService.getEmailSettings(),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}

export const useUpdatePlatformEmailSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePlatformEmailSettingsPayload) => platformSettingsService.updateEmailSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKey })
    },
  })
}
