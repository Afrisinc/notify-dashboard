import { apiClient } from './api.service'
import type { CreditTransactionsResponse, GetCreditTransactionsParams } from '../types/credit-transaction.types'

export const creditTransactionService = {
  getTransactions: async (params?: GetCreditTransactionsParams): Promise<CreditTransactionsResponse> => {
    const response = await apiClient.get<CreditTransactionsResponse>('/admin/internal/platform/credit-transactions', {
      params,
    })
    return response.data
  },
}
