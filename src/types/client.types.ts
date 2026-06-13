export type ClientPlan = 'FREE' | 'PAYG' | 'STARTER' | 'SCALE' | 'ENTERPRISE'
export type ClientStatus = 'active' | 'suspended' | 'trial'
export type ApiClientPlan = 'FREE' | 'STARTER' | 'SCALE' | 'ENTERPRISE' | 'PAYG'
export type ApiClientStatus = 'active' | 'suspended' | 'trial'

export interface Client {
  id: number
  name: string
  plan: ClientPlan
  email: string
  sent: string
  deliveryRate: string
  templates: number
  status: ClientStatus
  joined: string
  channels: string[]
  organizationName: string
  organizationType: string
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
  status?: ApiClientStatus
  plan?: ApiClientPlan
}
