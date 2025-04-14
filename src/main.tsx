import '@/locales'
import 'react-advanced-cropper/dist/style.css'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork, defineChain } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { http } from 'viem'

import { config } from '@/config'
import { NETWORK_NAME, networkConfigsMap } from '@/constants'

import App from './App'
import { Web3ContextProviderWrapper } from './contexts/web3-context'

const network = networkConfigsMap[NETWORK_NAME]
const activeNetwork = defineChain({
  id: network.chainId,
  caipNetworkId: `eip155:${network.chainId}`,
  chainNamespace: 'eip155',
  name: network.name,
  nativeCurrency: {
    decimals: 18,
    name: 'RMO',
    symbol: 'RMO',
  },
  rpcUrls: {
    default: {
      http: [network.rpcUrl],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: network.explorerUrl },
  },
})

const projectId = config.REOWN_ID

const networks: [AppKitNetwork] = [activeNetwork]
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  transports: {
    [activeNetwork.id]: http(activeNetwork.rpcUrls.default.http[0]),
  },
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  themeVariables: {
    '--w3m-z-index': 1500,
  },
  allowUnsupportedChain: false,
  enableEIP6963: false,
  features: {
    // TODO: find out how to disable Smart Accounts
    smartSessions: false,
    email: false,
    socials: false,
  },
  enableWalletGuide: false,
  allWallets: 'SHOW',
  featuredWalletIds: [],
})

const root = createRoot(document.getElementById('root') as Element)

root.render(
  <StrictMode>
    <Web3ContextProviderWrapper>
      <App />
    </Web3ContextProviderWrapper>
  </StrictMode>,
)
