import { AppKitNetwork } from '@reown/appkit/networks'

import { config } from '@/config'
import { Icons } from '@/enums'

export type NetworkName = 'mainnet' | 'testnet'

export interface NetworkConfig {
  chainId: number
  name: string
  networkName: NetworkName
  rpcUrl: string
  explorerUrl: string
  appKitChain: AppKitNetwork
  bridgeUrl?: string
  minPollFunding: string
  currencyIcon: Icons
}

const qAppKitChain: AppKitNetwork = {
  id: 35443,
  name: 'Q Testnet',
  caipNetworkId: 'eip155:35443',
  chainNamespace: 'eip155',
  nativeCurrency: {
    decimals: 18,
    name: 'Q',
    symbol: 'Q',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.qtestnet.org/'],
    },
  },
  contracts: {
    // Add the contracts here
  },
}

const gnosisAppKitChain: AppKitNetwork = {
  id: 100,
  name: 'Gnosis',
  caipNetworkId: 'eip155:100',
  chainNamespace: 'eip155',
  nativeCurrency: {
    decimals: 18,
    name: 'xDAI',
    symbol: 'xDAI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.gnosischain.com/'],
    },
  },
  contracts: {
    // Add the contracts here
  },
}

export const networkConfigsMap: Record<NetworkName, NetworkConfig> = {
  mainnet: {
    chainId: 100,
    name: 'Gnosis',
    networkName: 'mainnet',
    rpcUrl: 'https://rpc.gnosischain.com/',
    explorerUrl: 'https://gnosisscan.io',
    appKitChain: gnosisAppKitChain,
    bridgeUrl: 'https://bridge.gnosischain.com',
    minPollFunding: '1',
    currencyIcon: Icons.Xdai,
  },
  testnet: {
    chainId: 35443,
    name: 'Q Testnet',
    networkName: 'mainnet',
    rpcUrl: 'https://rpc.qtestnet.org/',
    explorerUrl: 'https://explorer.qtestnet.org',
    appKitChain: qAppKitChain,
    minPollFunding: '0.0005',
    currencyIcon: Icons.Ethereum,
  },
}

export const getNetworkByChainId = (chainId: number): NetworkConfig | undefined => {
  return Object.values(networkConfigsMap).find(config => config.chainId === chainId)
}

export const NETWORK_NAME: NetworkName = config.ENV === 'development' ? 'testnet' : 'mainnet'

const networkConfig = networkConfigsMap[NETWORK_NAME] ?? networkConfigsMap.mainnet
export const NATIVE_CURRENCY = networkConfig.appKitChain.nativeCurrency.symbol
export const NETWORK_DISPLAY_NAME = networkConfig.name
export const BRIDGE_URL = networkConfig.bridgeUrl
export const POLL_CREATION_MIN_FUNDING = networkConfig.minPollFunding
export const NATIVE_CURRENCY_ICON = networkConfig.currencyIcon
