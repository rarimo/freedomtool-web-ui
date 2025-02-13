interface JwtPayload {
  sub: string
  exp: number
  type: string
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}
