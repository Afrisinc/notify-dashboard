import { useQuery } from '@tanstack/react-query'
import { appsService } from '../services'
import type { GetOrgAppsParams } from '../types'

export const useOrgApps = (orgId: string | undefined, params?: GetOrgAppsParams) => {
  return useQuery({
    queryKey: ['organizations', orgId, 'apps', params],
    queryFn: () => appsService.getByOrganization(orgId as string, params),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}
