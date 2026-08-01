import { apiClient } from './api.service'
import type {
  CreditTransactionsResponse,
  GetCreditTransactionsParams,
  InitializePaymentRequest,
  InitializePaymentResponse,
} from '../types/credit-transaction.types'

export const creditTransactionService = {
  getTransactions: async (params?: GetCreditTransactionsParams): Promise<CreditTransactionsResponse> => {
    const response = await apiClient.get<CreditTransactionsResponse>('/admin/internal/platform/credit-transactions', {
      params,
    })
    return response.data
  },

  initializePayment: async (
    payload: InitializePaymentRequest,
    adminAccountId: string
  ): Promise<InitializePaymentResponse> => {
    const response = await apiClient.post<InitializePaymentResponse>(
      '/admin/payments/initialize-for-account',
      payload,
      {
        headers: {
          'x-account-id': adminAccountId,
        },
      }
    )
    return response.data
  },
}
