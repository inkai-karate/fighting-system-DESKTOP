import type { IDepartement } from './departement.interface'
import type { IMedia } from './media.interface'
import { IStudentExamSession } from './studentExamSession.interface'
import type { IUser } from './user.interface'

export interface IStudent {
  id: number
  uuid: string
  nis: string
  nisn: string
  user_id: number
  full_name: string
  gender: string
  birth_place: string
  birth_date: Date
  address: string
  phone: string
  email: string
  department_id: number
  status: number
  created_at: Date
  updated_at: Date
  deleted_at: Date
  create_by: string
  update_by: string
  photo: IMedia[]
  department: IDepartement
  user: IUser
  studentExamSessions: IStudentExamSession[]
}

export interface IPayloadStudent {
  full_name: string
  nisn: string
  nis: string
  gender: string
  birth_place: string
  birth_date: string
  address: string
  phone: string
  email: string
  department_id: string
  password: string
}
