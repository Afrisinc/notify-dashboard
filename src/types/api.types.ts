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
