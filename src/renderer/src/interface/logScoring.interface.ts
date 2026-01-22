export interface ILogScoring {
  id: number
  match_id: number
  action: string
  time: string
  point: number
  red_score: number
  blue_score: number
  description: string
  created_at: Date
}

export interface IPayloadLogScoring {
  match_id: number
  action: string
  time_seconds: string | number
  point: number
  red_score: number
  blue_score: number
  description?: string
  warnings_red: Record<string, boolean>
  warnings_blue: Record<string, boolean>
}
