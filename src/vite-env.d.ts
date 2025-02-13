/// <reference types="vite/client" />

import { BuildMode } from '@/types'

interface ImportMetaEnv {
  VITE_MODE: BuildMode
  VITE_API_URL: string
  VITE_PORT: string
  VITE_APP_NAME: string
  VITE_APP_BUILD_VERSION: string
  VITE_NETWORK: string
  VITE_CTF_EXCHANGE_CONTRACT_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
