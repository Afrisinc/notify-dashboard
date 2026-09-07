import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { emailIdentityService } from '../services'
import type { AddEmailDomainPayload, AddEmailSenderPayload, UpdateEmailSenderPayload } from '../types'

const domainsKey = (appId: string | undefined) => ['apps', appId, 'email-domains']

export const useEmailDomains = (appId: string | undefined) => {
  return useQuery({
    queryKey: domainsKey(appId),
    queryFn: () => emailIdentityService.listDomains(appId as string),
    enabled: !!appId,
    staleTime: 60 * 1000,
    retry: 2,
  })
}

export const useAddEmailDomain = (appId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddEmailDomainPayload) => emailIdentityService.addDomain(appId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainsKey(appId) })
    },
  })
}

export const useEmailDomainRecords = (appId: string | undefined, domainId: string | undefined) => {
  return useQuery({
    queryKey: ['apps', appId, 'email-domains', domainId, 'records'],
    queryFn: () => emailIdentityService.getDomainRecords(appId as string, domainId as string),
    enabled: !!appId && !!domainId,
  })
}

export const useVerifyEmailDomain = (appId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (domainId: string) => emailIdentityService.verifyDomain(appId as string, domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainsKey(appId) })
    },
  })
}

export const useDeleteEmailDomain = (appId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (domainId: string) => emailIdentityService.deleteDomain(appId as string, domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainsKey(appId) })
    },
  })
}

export const useAddEmailSender = (appId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ domainId, payload }: { domainId: string; payload: AddEmailSenderPayload }) =>
      emailIdentityService.addSender(appId as string, domainId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainsKey(appId) })
    },
  })
}

export const useUpdateEmailSender = (appId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ senderId, payload }: { senderId: string; payload: UpdateEmailSenderPayload }) =>
      emailIdentityService.updateSender(appId as string, senderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainsKey(appId) })
    },
  })
}

export const useDeleteEmailSender = (appId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (senderId: string) => emailIdentityService.deleteSender(appId as string, senderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainsKey(appId) })
    },
  })
}
