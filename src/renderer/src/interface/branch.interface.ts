import type { IMedia } from './media.interface'

export interface IBranch {
  id: number
  uuid: string
  branch_name: string
  phone: string
  logo_id: string
  business_name: string
  country: string
  city: string
  province: string
  address: string
  postal_code: string
  opening_hours: string
  closing_hours: string
  description: string
  status: string
  created_at: Date
  deleted_at: Date
  updated_at: Date
  update_by: string
  logo: IMedia
  branchConfig?: IBranchConfig
}
export interface IBranchConfig {
  id: number
  uuid: string
  branch_id: string
  branch_code: string
  short_name: string
  tagline: string
  website: string
  default_event_level: string
  allow_double_elimination: boolean
  auto_generate_bracket: boolean
  max_participant_per_cat: number
  allow_same_dojo_match: boolean
  registration_fee: number
  allow_online_payment: boolean
  auto_verify_registration: boolean
  round_duration_seconds: number
  break_duration_seconds: number
  total_round: number
  point_ippon: number
  point_wazaari: number
  point_yuko: number
  send_email_notification: boolean
  send_whatsapp_notification: boolean
  timezone: string
  currency: string
  language: string
  status: number
  created_at: string
  updated_at: string
}
export interface IPayloadBranchConfig {
  branch_id: string
  branch_code: string
  short_name: string
  tagline: string
  website: string
  default_event_level: string
  allow_double_elimination: boolean
  auto_generate_bracket: boolean
  max_participant_per_cat: number
  allow_same_dojo_match: boolean
  registration_fee: number
  allow_online_payment: boolean
  auto_verify_registration: boolean
  round_duration_seconds: number
  break_duration_seconds: number
  total_round: number
  point_ippon: number
  point_wazaari: number
  point_yuko: number
  send_email_notification: boolean
  send_whatsapp_notification: boolean
  timezone: string
  currency: string
  language: string
  status: number
}

export interface IPayloadBranch {
  branch_name: string
  phone?: string
  business_name?: string
  country?: string
  city?: string
  province?: string
  address?: string
  postal_code?: string
  description?: string
  opening_hours?: string
  closing_hours?: string
}
