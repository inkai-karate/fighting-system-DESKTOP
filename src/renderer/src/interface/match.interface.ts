import type { IParticipant } from './participant.interface'
import type { IStaff } from './staff.interface'

export interface IMatch {
  id: number
  uuid: string
  event_id: number
  bracket_id: number
  round_number: number
  match_number: number
  red_corner_id: number
  blue_corner_id: number
  next_match_id: number
  winner_id: number
  referee_id: number
  status: string
  start_time: Date
  end_time: Date
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: Date
  update_by: Date
  red_corner: IParticipant
  blue_corner: IParticipant
  referee: IStaff
}

export interface IPayloadMatch {
  red_corner_id: number
  blue_corner_id: number
  referee_id: number
  start_time: Date
  end_time: Date
}

export interface ICorner {
  id: number
  participant_id: number
  score: number
  fouls: number
}
export interface IPayloadStartMatch {
  referee_id: number
}
export interface IPayloadFinishMatch {
  winner_id: number
}
export interface IPayloadCancelMatch {
  reason: string
}
export interface IPayloadWalkoverMatch {
  winner_id: number
  reason: string
}
export interface IPayloadassignRefereeMatch {
  referee_id: number
}

export interface IMatchStats {
  total: number
  scheduled: number
  ongoing: number
  finished: number
  canceled: number
  completion_rate: number
}
