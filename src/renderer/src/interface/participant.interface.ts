import type { IEventCategoryItem } from './eventCategoryItem.interface'
import type { IMedia } from './media.interface'

export interface IParticipant {
  id: number
  uuid: string
  event_id: number
  user_id: number
  full_name: string
  gender: string
  birth_place: string
  birth_date: string
  age: number
  address: string
  phone: string
  email: string
  martial_art: string
  dojo_name: string
  coach_name: string
  weight: number
  height: number
  belt_level: string
  category: IEventCategoryItem
  class_name: string
  registration_status: string
  payment_status: string
  status: number
  media: IMedia[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: Date
  update_by: Date
}

export interface IStats {
  category: string
  class: {
    category: string
    count: number
  }[]
  total: number
}

export interface IPayloadParticipant {
  name: string
  location: string
  start_date: Date
  end_date: Date
  code: string
  description: string
  organizer: string
  level: string
}
