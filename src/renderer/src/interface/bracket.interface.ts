import type { IMatch } from './match.interface'

export interface IBracket {
  id: number
  uuid: string
  name: string
  event_id: number
  category: string
  class_name: string
  total_participant: number
  bracket_type: string
  generated_at: string
  last_shuffled_at: Date
  status: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: Date
  update_by: Date
  matches: IMatch[]
}

export interface IPayloadBracket {
  event_id: number
  bracket_name: string
  category: string
  class_name: string
  bracket_type: string
  participant_ids: number[]
}

export interface IBracketProgress {
  total_matches: number
  finished_matches: number
  rounds: number
}
