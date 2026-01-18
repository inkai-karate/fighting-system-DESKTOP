import type { ReactElement } from 'react'

export interface IPagination {
  page: number
  limit: number
}

export interface IResponseDashboard<T = unknown> {
  type: string
  message: string
  data?: T
}

export interface IReportStats {
  created?: number
  pending?: number
  approved?: number
  used?: number
  denied?: number
  completed?: number
}
export interface IBranchInfo {
  address: string
  department_string: string
  division_string: string
  id: string
  name: string
  remark: string
  ticket_prefix: string
}

export interface IDashboardData {
  ticket: IReportStats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitor?: Record<string, any>
}

export type PageType = 'title' | 'sub' | 'path'

export interface ILogData {
  id?: number
  type: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG'
  action: string
  message: string
  request?: unknown
  payload?: unknown
  params?: unknown
  response?: unknown
  meta?: unknown
  created_at: string
}

export interface IAppRoute {
  path: string
  element: ReactElement
  active: boolean
  protected: boolean
  redirectTo?: string
}

export interface ILogData {
  id?: number
  type: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG'
  action: string
  message: string
  request?: unknown
  payload?: unknown
  response?: unknown
  meta?: unknown
  created_at: string
}

export interface IAppRoute {
  path: string
  element: ReactElement
  active: boolean
  protected: boolean
  redirectTo?: string
}
export interface IDeviceConfigPC {
  hostname: string
  platform: string
}
