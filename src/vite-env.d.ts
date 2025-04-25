/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string
  VITE_PORT: string
  VITE_APP_NAME: string
  VITE_APP_BUILD_VERSION: string
  VITE_NETWORK: string
  VITE_CTF_EXCHANGE_CONTRACT_ADDRESS: string
  VITE_RARIME_EXTERNAL_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.md'
