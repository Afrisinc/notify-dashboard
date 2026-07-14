import { useQuery } from '@tanstack/react-query'
import { creditTransactionService } from '../services/credit-transaction.service'
import type { GetCreditTransactionsParams } from '../types/credit-transaction.types'

export const useCreditTransactions = (params?: GetCreditTransactionsParams) => {
  return useQuery({
    queryKey: ['credit-transactions', params],
    queryFn: async () => {
      const response = await creditTransactionService.getTransactions(params)
      return response
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
