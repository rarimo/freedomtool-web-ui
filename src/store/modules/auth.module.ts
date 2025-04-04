import { FetcherRequest, FetcherRequestBody, HTTP_METHODS } from '@distributedlab/fetcher'

import { api } from '@/api/clients'
import { authorizeUser, refreshJwt } from '@/api/modules/auth'
import { config } from '@/config'
import { createStore, ErrorHandler } from '@/helpers'
import { parseJwt } from '@/helpers/jwt'

type AuthState = {
  accessToken: string
  refreshToken: string
}

const [authStore, useAuthState] = createStore(
  'oauth-v3',
  {
    accessToken: '',
    refreshToken: '',
  } as AuthState,
  state => ({
    get isAuthorized() {
      return Boolean(state.accessToken)
    },
  }),
  state => ({
    async signIn(addr: string, signature: string) {
      const { access_token, refresh_token } = await authorizeUser(addr, signature)

      state.accessToken = access_token.token
      state.refreshToken = refresh_token.token

      this.addAuthInterceptor()
    },
    signOut() {
      state.accessToken = ''
      state.refreshToken = ''

      api.clearInterceptors()
    },
    verifyToken(address: string) {
      const parsedJwt = parseJwt(state.accessToken)

      if (!parsedJwt || parsedJwt.sub.toLowerCase() !== address.toLowerCase()) {
        this.signOut()
        return
      }

      this.addAuthInterceptor()
    },
    addAuthInterceptor() {
      let isRefreshing = false
      const failedQueue: (() => Promise<void>)[] = []
      const retryFailedRequests = async () => {
        while (failedQueue.length > 0) {
          // Fetch requests again in the same order with actual data
          const callback = failedQueue.shift()
          if (callback) {
            try {
              await callback()
            } catch (error) {
              ErrorHandler.processWithoutFeedback(error)
              this.signOut()
            }
          }
        }
      }

      async function retryRequest(request: FetcherRequest) {
        const { url, method, body, headers } = request
        const updatedResponse = await api.fetcher.request({
          endpoint: url.replace(config.API_URL, ''),
          method: method as HTTP_METHODS,
          body: body as FetcherRequestBody,
          headers: {
            ...headers,
            Authorization: `Bearer ${state.accessToken}`,
          },
        })

        return updatedResponse
      }

      api.addInterceptor({
        request: async config => {
          config.headers = {
            Authorization: `Bearer ${state.accessToken}`,
            ...config.headers,
          }
          return config
        },
        response: async response => {
          if (response.status === 401) {
            const originalRequest: FetcherRequest = response.request
            const authHeader = (response.request.headers as Record<string, string>)['Authorization']
            // 401 on refresh token
            if (authHeader === `Bearer ${state.refreshToken}`) {
              this.signOut()
              window.location.reload()
              failedQueue.length = 0
            }

            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push(async () => {
                  try {
                    const updatedResponse = await retryRequest(originalRequest)
                    resolve(updatedResponse)
                  } catch (err) {
                    reject(err)
                  }
                })
              })
            }

            isRefreshing = true

            try {
              const { access_token, refresh_token } = await refreshJwt(state.refreshToken)
              state.accessToken = access_token.token
              state.refreshToken = refresh_token.token

              return await retryRequest(originalRequest)
            } finally {
              await retryFailedRequests()
              isRefreshing = false
            }
          }

          return response
        },
      })
    },
  }),
)

export { authStore, useAuthState }
