import { api } from '@/api/clients'
import { AuthTokensGroup } from '@/api/modules/auth'
import { ApiServicePaths } from '@/enums'

export const authorizeUser = async (address: string, signature: string) => {
  const { data } = await api.post<AuthTokensGroup>(`${ApiServicePaths.Auth}/v1/authorize`, {
    body: {
      data: {
        id: address,
        type: 'authorize',
        attributes: { signature },
      },
    },
  })

  return data
}

export const requestChallenge = async (address: string) => {
  const { data } = await api.get<{ challenge: string }>(
    `${ApiServicePaths.Auth}/v1/authorize/${address}/challenge`,
  )
  return data.challenge
}

export const refreshJwt = async (refreshToken: string) => {
  const { data } = await api.get<AuthTokensGroup>(`${ApiServicePaths.Auth}/v1/refresh`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  })
  return data
}
