import { apiClient } from './api.service'
import type { ApiResponse, PlatformEmailSettings, UpdatePlatformEmailSettingsPayload } from '../types'

export const platformSettingsService = {
  getEmailSettings: async (): Promise<PlatformEmailSettings> => {
    const response = await apiClient.get<ApiResponse<PlatformEmailSettings>>('/api/admin/platform-email-settings')
    return response.data.data
  },

  updateEmailSettings: async (payload: UpdatePlatformEmailSettingsPayload): Promise<PlatformEmailSettings> => {
    const response = await apiClient.put<ApiResponse<PlatformEmailSettings>>(
      '/api/admin/platform-email-settings',
      payload
    )
    return response.data.data
  },
}
