export type AnalyticsPeriod = 'today' | '7d' | '30d' | '90d' | '6m' | 'custom'

export interface GetAnalyticsParams {
  period?: AnalyticsPeriod
  dateFrom?: string
  dateTo?: string
}

export interface AnalyticsKpi {
  value: string
  delta: string
  deltaUp: boolean
}

export interface AnalyticsKpis {
  totalSent: AnalyticsKpi
  avgDeliveryRate: AnalyticsKpi
  avgOpenRate: AnalyticsKpi
  avgClickRate: AnalyticsKpi
}

export interface DeliveryVolumeBucket {
  label: string
  delivered: number
  failed: number
  bounced: number
}

export interface SuccessRateBreakdown {
  delivered: number
  failed: number
  bounced: number
}

export interface EngagementBucket {
  label: string
  opens: number
  clicks: number
  unsubscribes: number
}

export interface TopClient {
  accountId: string
  name: string
  plan: string
  sent: number
}

export interface AnalyticsOverview {
  kpis: AnalyticsKpis
  deliveryVolume: DeliveryVolumeBucket[]
  successRate: SuccessRateBreakdown
  emailEngagement: EngagementBucket[]
  topClients: TopClient[]
  rangeStart: string
  rangeEnd: string
}

export interface AnalyticsOverviewResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: AnalyticsOverview
}
