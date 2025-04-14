import { AppKitNetwork } from '@reown/appkit/networks'

import { config } from '@/config'

export type NetworkName = 'mainnet' | 'testnet'

export interface NetworkConfig {
  chainId: number
  name: string
  networkName: NetworkName
  rpcUrl: string
  explorerUrl: string
  appKitChain: AppKitNetwork
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

const rarimoL2AppKitChain: AppKitNetwork = {
  id: 7368,
  name: 'Rarimo',
  caipNetworkId: 'eip155:7368',
  chainNamespace: 'eip155',
  nativeCurrency: {
    decimals: 18,
    name: 'Rarimo Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://l2.rarimo.com/'],
    },
  },
  contracts: {
    // Add the contracts here
  },
}

export const networkConfigsMap: Record<NetworkName, NetworkConfig> = {
  mainnet: {
    chainId: 7368,
    name: 'Rarimo',
    networkName: 'mainnet',
    rpcUrl: 'https://l2.rarimo.com/',
    explorerUrl: 'https://scan.rarimo.com',
    appKitChain: rarimoL2AppKitChain,
  },
  testnet: {
    chainId: 35443,
    name: 'Q Testnet',
    networkName: 'mainnet',
    rpcUrl: 'https://rpc.qtestnet.org/',
    explorerUrl: 'https://explorer.qtestnet.org',
    appKitChain: qAppKitChain,
  },
}

export const getNetworkByChainId = (chainId: number): NetworkConfig | undefined => {
  return Object.values(networkConfigsMap).find(config => config.chainId === chainId)
}

export const NETWORK_NAME: NetworkName = config.ENV === 'development' ? 'testnet' : 'mainnet'
export const NATIVE_CURRENCY = qAppKitChain.nativeCurrency.name
