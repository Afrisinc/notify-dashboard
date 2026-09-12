export type NotificationChannel = 'email' | 'sms' | 'push' | 'in-app' | 'whatsapp'
export type NotificationStatus = 'delivered' | 'failed' | 'pending'
export type NotificationPeriod = 'today' | 'yesterday' | '7d' | '30d' | '6m' | 'custom'

export interface NotificationLogItem {
  id: string
  client: string
  to: string
  template: string
  channel: NotificationChannel
  status: NotificationStatus
  latency: string
  time: string
}

export interface NotificationsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: NotificationLogItem[]
  meta: {
    limit: number
    offset: number
    total: number
    rangeStart: string
    rangeEnd: string
  }
}

export interface NotificationStatsData {
  totalSent: number
  delivered: number
  failed: number
  pending: number
  rangeStart: string
  rangeEnd: string
}

export interface NotificationStatsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: NotificationStatsData
}

export interface DateRangeParams {
  period?: NotificationPeriod
  dateFrom?: string
  dateTo?: string
}

export interface GetNotificationsParams extends DateRangeParams {
  limit?: number
  offset?: number
  search?: string
  channel?: NotificationChannel
  status?: NotificationStatus
}

export type GetNotificationStatsParams = DateRangeParams
