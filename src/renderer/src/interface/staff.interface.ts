import type { IMedia } from './media.interface'
import type { IUser } from './user.interface'

export interface IStaff {
  id: number
  uuid: string
  user_id: number
  full_name: string
  gender: string
  birth_place: string
  birth_date: Date
  address: string
  phone: string
  email: string
  position: string
  photo: IMedia[]
  user: IUser
  status: number
  created_at: Date
  updated_at: Date
  deleted_at: string
  create_by: string
  update_by: string
}

export interface IPayloadStaff {
  id?: number
  uuid?: string
  full_name: string
  gender: string
  birth_place: string
  birth_date: string
  address: string
  phone: string
  email: string
  position: string
  uuid_user: string
  username: string
  password: string
  role: IRole
}

export type IRole = 'USER' | 'ADMIN' | 'SUPERADMIN' | 'REFEREE' | 'JUDGE' | 'COMMITTEE'
