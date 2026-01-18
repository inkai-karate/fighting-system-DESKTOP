export interface IMeta {
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface IResponse<T = unknown> {
  message: string
  status_code: number
  success: boolean
  error: string
  data?: T
  meta?: IMeta
}

export interface IErrorResponse {
  status_code: number
  message: string
  error?: Record<string, string[]> // opsional kalau ada detail error field
}
