import type { IBracket } from './bracket.interface'
import { IEvent } from './event.interface'
import type { IMatch } from './match.interface'
import type { IMedia } from './media.interface'
import type { IParticipant } from './participant.interface'

export interface IEventUserDetail extends IEvent {
  user_matches: IMatch[]
  banner: IMedia[]
  participants: IParticipant[]
  brackets: IBracket[]
  user: IParticipant
  user_statistics: IEventUserStatistics
}

export interface IEventUserStatistics {
  total_matches: number
  finished_matches: number
  won_matches: number
  upcoming_matches: number
  ongoing_matches: number
  win_rate: number
}
