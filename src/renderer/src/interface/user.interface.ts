import type { IMedia } from './media.interface'

export interface IUser {
  id: number
  username: string
  name: string
  email: string
  phone: string
  description: string
  status: string
  profile_picture: string
  created_at: Date
  deleted_at: Date
  updated_at: Date
  update_by: string
  delete_by: string
  profile_picture_media: IMedia
}
export interface IPayloadUser {
  name: string
  username: string
  password: string
  password_confirmation: string
  email: string
  phone: string
  description: string
  profile_picture?: string // file name dari hasil upload
}
export interface IPayloadUpdateUser {
  name: string
  phone: string
  description: string
  profile_picture_media?: IMedia | null
  profile_picture?: string
  username?: string
  email?: string
  status?: string
}
