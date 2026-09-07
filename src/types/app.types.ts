export type AppEnvironment = 'production' | 'staging' | 'development' | 'sandbox'
export type AppStatus = 'active' | 'inactive' | 'suspended'

export interface OrgApp {
  id: string
  name: string
  environment: AppEnvironment | string
  status: AppStatus | string
  createdAt: string
  templateCount: number
  templatesSent: number
}

export interface OrgAppsData {
  organization_id: string
  apps: OrgApp[]
  total: number
}

export interface OrgAppsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: OrgAppsData
}

export interface GetOrgAppsParams {
  search?: string
}
