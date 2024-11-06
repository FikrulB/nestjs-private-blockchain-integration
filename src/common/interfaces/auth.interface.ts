export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface JwtPayload {
  id: string
  fullName: string
  email: string
  emailVerifiedAt: string
  accountBcAddress: string
  role: string
  status: boolean
  iat: number
  exp: number
}