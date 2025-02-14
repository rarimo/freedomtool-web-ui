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

const rarimoAppKitChain: AppKitNetwork = {
  id: 42,
  name: 'dev Rarimo',
  nativeCurrency: {
    decimals: 18,
    name: 'RMO',
    symbol: 'RMO',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.evm.node2.mainnet-beta.rarimo.com/'],
    },
  },
  contracts: {
    // Add the contracts here
  },
}

export const networkConfigsMap: Record<NetworkName, NetworkConfig> = {
  mainnet: {
    chainId: 42,
    name: 'dev Rarimo',
    networkName: 'mainnet',
    rpcUrl: 'https://rpc.evm.node2.mainnet-beta.rarimo.com/',
    explorerUrl: 'https://newevmscan.mainnet-beta.rarimo.com/',
    appKitChain: rarimoAppKitChain,
  },
  testnet: {
    chainId: 42,
    name: 'dev Rarimo',
    networkName: 'mainnet',
    rpcUrl: 'https://rpc.evm.node2.mainnet-beta.rarimo.com/',
    explorerUrl: 'https://newevmscan.mainnet-beta.rarimo.com/',
    appKitChain: rarimoAppKitChain,
  },
}

export const getNetworkByChainId = (chainId: number): NetworkConfig | undefined => {
  return Object.values(networkConfigsMap).find(config => config.chainId === chainId)
}

export const NETWORK_NAME: NetworkName = config.ENV === 'development' ? 'testnet' : 'mainnet'
