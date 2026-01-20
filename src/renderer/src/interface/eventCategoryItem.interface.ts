import type { IEventCategory } from './eventCategory.interface'

export interface IEventCategoryItem {
  id: number
  uuid: string
  event_category_id: number
  name: string
  gender: string
  description: string
  event_category: IEventCategory
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: Date
  update_by: Date
}
