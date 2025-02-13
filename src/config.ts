import packageJson from '../package.json'

export type Config = {
  ENV: 'development' | 'production'
  BUILD_VERSION: string

  API_URL: string
  APP_HOST_URL: string

  REOWN_ID: string
}

export const config: Config = {
  ENV: import.meta.env.VITE_ENV,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  APP_HOST_URL: import.meta.env.VITE_APP_HOST_URL,
  API_URL: import.meta.env.VITE_API_URL,

  REOWN_ID: import.meta.env.VITE_REOWN_ID,
}
