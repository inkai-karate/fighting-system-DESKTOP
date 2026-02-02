import { IEventCategoryItem } from './eventCategoryItem.interface'

export interface IEventCategory {
  id: number
  uuid: string
  name: string
  min_age: string
  max_age: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: Date
  update_by: Date
  eventCategoryItems: IEventCategoryItem[]
}
