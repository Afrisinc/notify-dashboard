export type SecurityRange = '24h' | '7d' | '30d'
export type LoginEventType = 'login_event' | 'login_failure'
export type LoginStatus = 'success' | 'failed'

export interface TopIP {
  ip: string
  attempts: number
}

export interface FailedLogin {
  id: string
  email: string
  ip: string
  timestamp: string
  reason: string
}

export interface SecurityOverviewResponse {
  failedLogins24h: number
  tokenIssuanceCount: number
  suspiciousActivity: boolean
  topIPs: TopIP[]
  failedLogins: FailedLogin[]
}

export interface LoginEvent {
  id: string
  type: LoginEventType
  userId: string
  email: string
  name: string
  phone: string
  status: LoginStatus
  ip: string
  reason?: string
  createdAt: string
}

export interface LoginEventsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface LoginEventsResponse {
  data: LoginEvent[]
  pagination: LoginEventsPagination
}

export interface SecurityOverviewParams {
  range?: SecurityRange
  limit?: number
  failed_login_limit?: number
}

export interface LoginEventsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'asc' | 'desc'
}
