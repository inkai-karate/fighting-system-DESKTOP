export interface IComputerDevice {
  id: number
  uuid: string
  name: string
  device_id: string
  validity_period?: Date
  description?: string
  status: number
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: string
  update_by: string
}

export interface IPayloadComputerDevice {
  device_id: string
  validity_period?: string | null
  name: string
  description: string
}
