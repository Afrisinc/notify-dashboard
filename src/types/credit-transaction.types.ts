export type TransactionType = 'topup' | 'deduction' | 'bonus' | 'refund'
export type Channel = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP'
export type AccountType = 'INDIVIDUAL' | 'ORGANIZATION'

export interface CreditTransaction {
  transactionId: string
  creditBalanceId: string
  accountId: string
  userId: string
  accountEmail: string
  accountName: string
  accountType: AccountType
  organizationId?: string
  organizationName?: string
  type: TransactionType
  amount: number
  balanceAfter: number
  description: string
  channel?: Channel
  notificationId?: string
  paymentRef?: string
  bonusPercent?: number
  paymentStatus?: string
  isCompleted: boolean
  createdAt: string
}

export interface TransactionSummary {
  totalAmount: number
  countByType: {
    topup: number
    deduction: number
    bonus: number
    refund: number
  }
  dateRange: {
    from: string
    to: string
  }
}

export interface CreditTransactionsResponse {
  success: boolean
  resp_msg: string
  resp_code: number
  data: CreditTransaction[]
  summary: TransactionSummary
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface GetCreditTransactionsParams {
  search?: string
  type?: TransactionType | string
  channel?: Channel
  accountId?: string
  minAmount?: number
  maxAmount?: number
  dateFrom?: string
  dateTo?: string
  sortBy?: 'created_at' | 'amount' | 'balance_after'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
