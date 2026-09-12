import axios from 'axios'
import { apiClient } from './api.service'
import type { ApiResponse, MailAlias, AddMailAliasPayload, UpdateMailAliasPayload } from '../types'

function unwrap(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { resp_msg?: string } | undefined)?.resp_msg
    throw new Error(message || fallback)
  }
  throw error instanceof Error ? error : new Error(fallback)
}

export const mailAliasService = {
  list: async (): Promise<MailAlias[]> => {
    try {
      const response = await apiClient.get<ApiResponse<MailAlias[]>>('/api/admin/mail-aliases')
      return response.data.data
    } catch (error) {
      return unwrap(error, 'Failed to load mail aliases')
    }
  },

  add: async (payload: AddMailAliasPayload): Promise<MailAlias> => {
    try {
      const response = await apiClient.post<ApiResponse<MailAlias>>('/api/admin/mail-aliases', payload)
      return response.data.data
    } catch (error) {
      return unwrap(error, 'Failed to create mail alias')
    }
  },

  update: async (localPart: string, payload: UpdateMailAliasPayload): Promise<MailAlias> => {
    try {
      const response = await apiClient.patch<ApiResponse<MailAlias>>(
        `/api/admin/mail-aliases/${encodeURIComponent(localPart)}`,
        payload
      )
      return response.data.data
    } catch (error) {
      return unwrap(error, 'Failed to update mail alias')
    }
  },

  delete: async (localPart: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/admin/mail-aliases/${encodeURIComponent(localPart)}`)
    } catch (error) {
      unwrap(error, 'Failed to delete mail alias')
    }
  },
}
