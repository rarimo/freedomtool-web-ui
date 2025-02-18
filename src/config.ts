import packageJson from '../package.json'

export type Config = {
  ENV: 'development' | 'production'
  BUILD_VERSION: string

  API_URL: string
  APP_HOST_URL: string

  IPFS_NODE_URL: string

  PROPOSAL_STATE_CONTRACT: string
  BIO_PASSPORT_VOTING_CONTRACT: string

  REOWN_ID: string
}

export const config: Config = {
  ENV: import.meta.env.VITE_ENV,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  APP_HOST_URL: import.meta.env.VITE_APP_HOST_URL,
  API_URL: import.meta.env.VITE_API_URL,

  IPFS_NODE_URL: import.meta.env.VITE_IPFS_NODE_URL,

  PROPOSAL_STATE_CONTRACT: import.meta.env.VITE_PROPOSAL_STATE_CONTRACT,
  BIO_PASSPORT_VOTING_CONTRACT: import.meta.env.VITE_BIO_PASSPORT_VOTING_CONTRACT,

  REOWN_ID: import.meta.env.VITE_REOWN_ID,
}
