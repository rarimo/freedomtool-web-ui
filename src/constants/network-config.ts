import { AppKitNetwork } from '@reown/appkit/networks'
import { base } from 'viem/chains'

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

export const networkConfigsMap: Record<NetworkName, NetworkConfig> = {
  mainnet: {
    chainId: base.id,
    name: 'Base Mainnet',
    networkName: 'mainnet',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    appKitChain: base,
  },
  testnet: {
    chainId: base.id,
    name: 'Base Mainnet',
    networkName: 'testnet',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    appKitChain: base,
  },
}

export const getNetworkByChainId = (chainId: number): NetworkConfig | undefined => {
  return Object.values(networkConfigsMap).find(config => config.chainId === chainId)
}

export const NETWORK_NAME: NetworkName = config.ENV === 'development' ? 'testnet' : 'mainnet'
