export interface IMeta {
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface IResponse<T = unknown, S = unknown> {
  message: string
  status_code: number
  success: boolean
  error: string
  data?: T
  meta?: IMeta
  stats?: S
}

export interface IErrorResponse {
  status_code: number
  message: string
  details?: string
  error?: string // opsional kalau ada detail error field
}
