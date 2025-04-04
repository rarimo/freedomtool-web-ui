export type AuthTokensGroup = {
  id: string
  type: 'token'
  access_token: {
    token: string
    tokenType: 'access'
  }
  refresh_token: {
    token: string
    tokenType: 'access'
  }
}
