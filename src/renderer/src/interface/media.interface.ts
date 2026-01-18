export interface IMedia {
  id: number
  uuid: string
  url: string
  type: string
  created_at: Date
  updated_at: Date
}
export interface IResponseMedia {
  id: number
  filename: string
  mimetype: string
  visibility: string
  created_at: string
  updated_at: string
  preview_url: string
}
