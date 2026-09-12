export type TemplateChannel = 'email' | 'sms' | 'push' | 'in-app' | 'whatsapp'
export type TemplateStatus = 'active' | 'draft'

export interface TemplateItem {
  id: string
  name: string
  client: string
  channel: TemplateChannel
  status: TemplateStatus
  tags: string[]
  uses: number
  updated: string
}

export interface TemplatesResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: TemplateItem[]
  meta: {
    limit: number
    offset: number
    total: number
  }
}

export interface TemplateStatsData {
  total: number
  active: number
  drafts: number
}

export interface TemplateStatsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: TemplateStatsData
}

export interface GetTemplatesParams {
  limit?: number
  offset?: number
  search?: string
  channel?: TemplateChannel
  status?: TemplateStatus
}
