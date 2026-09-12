import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mailAliasService } from '../services'
import type { AddMailAliasPayload, UpdateMailAliasPayload } from '../types'

const aliasesKey = ['mail-aliases']

export const useMailAliases = () => {
  return useQuery({
    queryKey: aliasesKey,
    queryFn: () => mailAliasService.list(),
    staleTime: 30 * 1000,
    retry: 1,
  })
}

export const useAddMailAlias = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddMailAliasPayload) => mailAliasService.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aliasesKey })
    },
  })
}

export const useUpdateMailAlias = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ localPart, payload }: { localPart: string; payload: UpdateMailAliasPayload }) =>
      mailAliasService.update(localPart, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aliasesKey })
    },
  })
}

export const useDeleteMailAlias = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (localPart: string) => mailAliasService.delete(localPart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aliasesKey })
    },
  })
}
