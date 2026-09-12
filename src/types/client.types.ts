import type { AnalyticsPeriod } from './analytics.types'

export type ClientPlan = 'FREE' | 'PAYG' | 'STARTER' | 'SCALE' | 'ENTERPRISE' | 'PRO'
export type ClientStatus = 'active' | 'suspended' | 'trial'
export type OrganizationRole = 'owner' | 'member' | 'admin'

export interface Organization {
  id: number
  accountId: string
  organizationId: string | null
  name: string
  plan: ClientPlan
  role: OrganizationRole
  sent: string
  templates: number
  status: ClientStatus
  joined: string
}

export interface ClientStats {
  totalOrganizations: number
  ownedOrganizations: number
  memberOrganizations: number
  aggregatedStats: {
    sent: string
    templates: number
    deliveryRate: string
  }
}

export interface Client {
  id: string
  name: string
  email: string
  organizations: Organization[]
  stats: ClientStats
}

export interface ClientsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: Client[]
  meta: {
    limit: number
    offset: number
    total: number
  }
}

export interface GetClientsParams {
  limit?: number
  offset?: number
  search?: string
  status?: ClientStatus
  plan?: ClientPlan
}

export interface ClientsKpi {
  value: string
  delta: string
  deltaUp: boolean
}

export interface ClientsStatsData {
  activeClients: number
  newClients: ClientsKpi
  totalSent: ClientsKpi
  avgDeliveryRate: ClientsKpi
  rangeStart: string
  rangeEnd: string
}

export interface ClientsStatsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: ClientsStatsData
}

export interface GetClientsStatsParams {
  period?: AnalyticsPeriod
  dateFrom?: string
  dateTo?: string
}
