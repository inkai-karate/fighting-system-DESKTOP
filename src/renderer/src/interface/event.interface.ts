import { IBracket } from './bracket.interface'
import type { IEventCategory } from './eventCategory.interface'
import type { IMatch } from './match.interface'
import type { IMedia } from './media.interface'
import type { IParticipant } from './participant.interface'

export interface IEvent {
  id: number
  uuid: string
  name: string
  code: string
  description: string
  location: string
  start_date: Date
  end_date: Date
  organizer: string
  level: string
  status: StatusEvent
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: Date
  update_by: Date
  participants: IParticipant[]
  banner: IMedia[]
  brackets: IBracket[]
  matches: IMatch[]
  event_categories: IEventCategory[]
  _count: {
    matches: number
    brackets: number
    participants: number
  }
}

export interface IPayloadEvent {
  name: string
  location: string
  start_date: Date
  end_date: Date
  code: string
  description: string
  organizer: string
  level: string
  status: StatusEvent
}

export const StatusEvent = {
  DRAFT: 'DRAFT',
  REGISTRATION: 'REGISTRATION',
  ONGOING: 'ONGOING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED'
} as const

export type StatusEvent = (typeof StatusEvent)[keyof typeof StatusEvent]
