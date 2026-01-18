export interface ILogin {
  uid: string
  username: string
  email: string
  role: string
  photo?: string
}

export interface IPayloadLogin {
  uid?: string
  username: string
  password: string
}

export interface IResponseLogin {
  status: number
  success: boolean
  message: string
  token: string
  user: ILogin
}

export interface IResponseTokenValidation {
  valid: boolean
  status: number
  role: string
}

export interface PayloadChangePassword {
  userId: number
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
