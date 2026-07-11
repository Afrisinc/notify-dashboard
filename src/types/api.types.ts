export interface ApiError {
  message: string
  code?: number
  details?: unknown
}

export interface ApiResponse<T> {
  success: boolean
  resp_msg: string
  resp_code: number
  data: T
}

// Dashboard Types
export interface StatCard {
  value: string
  label: string
  sub: string
  trend: string | null
  trendUp: boolean | null
  icon: string
}

export interface DashboardStats {
  messagesSent: StatCard
  deliveryRate: StatCard
  activeClients: StatCard
  templates: StatCard
}

export interface NotificationVolumeItem {
  day: string
  email: number
  sms: number
  push: number
}

export interface ChannelBreakdownItem {
  label: string
  value: number
  color: string
}

export interface RecentActivityItem {
  client: string
  channel: 'email' | 'sms' | 'push' | 'in-app'
  count: number
  status: 'delivered' | 'failed' | 'pending'
  time: string
}

export interface SystemHealthItem {
  label: string
  status: string
  ok: boolean
}

export interface DashboardData {
  stats: DashboardStats
  notificationVolume: NotificationVolumeItem[]
  channelBreakdown: ChannelBreakdownItem[]
  peakSendTime: string
  recentActivity: RecentActivityItem[]
  systemHealth: SystemHealthItem[]
  systemStatusOverall: {
    status: string
    message: string
  }
}

export interface DashboardResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: DashboardData
  meta: {
    generatedAt: string
    period: string
    timezone: string
  }
}

export interface DashboardStatsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: DashboardStats
  meta: {
    generatedAt: string
    period: string
  }
}

export interface RecentSendsPagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface RecentSendsData {
  items: RecentActivityItem[]
  pagination: RecentSendsPagination
}

export interface RecentSendsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: RecentSendsData
  meta: {
    generatedAt: string
  }
}

export interface GetDashboardParams {
  period?: '24h' | '7d' | '30d' | '90d'
  timezone?: string
}

export interface GetRecentSendsParams {
  limit?: number
  offset?: number
}
