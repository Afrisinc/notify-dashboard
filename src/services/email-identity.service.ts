import { apiClient } from './api.service'
import type {
  ApiResponse,
  EmailDomain,
  EmailSender,
  DomainDNSRecords,
  AddEmailDomainPayload,
  AddEmailDomainResult,
  AddEmailSenderPayload,
  UpdateEmailSenderPayload,
} from '../types'

export const emailIdentityService = {
  listDomains: async (appId: string): Promise<EmailDomain[]> => {
    const response = await apiClient.get<ApiResponse<EmailDomain[]>>(`/api/apps/${appId}/email-domains`)
    return response.data.data
  },

  addDomain: async (appId: string, payload: AddEmailDomainPayload): Promise<AddEmailDomainResult> => {
    const response = await apiClient.post<ApiResponse<AddEmailDomainResult>>(
      `/api/apps/${appId}/email-domains`,
      payload
    )
    return response.data.data
  },

  getDomainRecords: async (appId: string, domainId: string): Promise<DomainDNSRecords> => {
    const response = await apiClient.get<ApiResponse<DomainDNSRecords>>(
      `/api/apps/${appId}/email-domains/${domainId}/records`
    )
    return response.data.data
  },

  verifyDomain: async (appId: string, domainId: string): Promise<EmailDomain> => {
    const response = await apiClient.post<ApiResponse<EmailDomain>>(
      `/api/apps/${appId}/email-domains/${domainId}/verify`
    )
    return response.data.data
  },

  deleteDomain: async (appId: string, domainId: string): Promise<void> => {
    await apiClient.delete(`/api/apps/${appId}/email-domains/${domainId}`)
  },

  addSender: async (appId: string, domainId: string, payload: AddEmailSenderPayload): Promise<EmailSender> => {
    const response = await apiClient.post<ApiResponse<EmailSender>>(
      `/api/apps/${appId}/email-domains/${domainId}/senders`,
      payload
    )
    return response.data.data
  },

  updateSender: async (appId: string, senderId: string, payload: UpdateEmailSenderPayload): Promise<EmailSender> => {
    const response = await apiClient.patch<ApiResponse<EmailSender>>(
      `/api/apps/${appId}/email-senders/${senderId}`,
      payload
    )
    return response.data.data
  },

  deleteSender: async (appId: string, senderId: string): Promise<void> => {
    await apiClient.delete(`/api/apps/${appId}/email-senders/${senderId}`)
  },
}
