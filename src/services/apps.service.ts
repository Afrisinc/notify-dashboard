import { apiClient } from './api.service'
import type { OrgAppsData, GetOrgAppsParams } from '../types'
import type { ApiResponse } from '../types'

export const appsService = {
  getByOrganization: async (orgId: string, params?: GetOrgAppsParams): Promise<OrgAppsData> => {
    const response = await apiClient.get<ApiResponse<OrgAppsData>>(`/api/organizations/${orgId}/apps/details`, {
      params,
    })
    return response.data.data
  },
}
