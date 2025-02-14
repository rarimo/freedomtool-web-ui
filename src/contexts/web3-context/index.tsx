import { AppKitNetwork } from '@reown/appkit/networks'
import { useAppKitAccount, useAppKitEvents, useAppKitNetwork } from '@reown/appkit/react'
import {
  JsonRpcProvider,
  JsonRpcSigner,
  Network,
  TransactionReceipt,
  TransactionRequest,
} from 'ethers'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { type Account, type Chain, type Client, type Transport } from 'viem'
import {
  Connector,
  useConnect,
  useConnections,
  useConnectorClient,
  UseConnectReturnType,
  useDisconnect,
  WagmiProvider,
} from 'wagmi'

import { getNetworkByChainId, NETWORK_NAME, NetworkConfig, networkConfigsMap } from '@/constants'
import { wagmiAdapter } from '@/main'
import QueryProvider from '@/query'

import { clientToProvider, clientToSigner } from './helpers/providers'

export type Web3ProviderContext<A extends Account | undefined = Account | undefined> = {
  connectManager: UseConnectReturnType

  client: Client<Transport, Chain, A> | null

  address: string | ''
  chain: string | number | null
  isConnected: boolean
  isInitialized: boolean

  isCorrectNetwork: boolean
  contractConnector: JsonRpcProvider | null
  rawProviderSigner: JsonRpcSigner | null
  connect: (connector: Connector) => Promise<void>
  disconnect: () => Promise<void>

  balance: string
  setBalance: (balance: string) => void

  safeSwitchChain: (chain: AppKitNetwork) => void
  signAndSendTx: (tx: TransactionRequest) => Promise<TransactionReceipt | null>

  getNetworkConfig: () => NetworkConfig
}

const web3ProviderContext = createContext<Web3ProviderContext>({
  connectManager: {} as UseConnectReturnType,
  client: null,

  address: '',
  chain: null,
  isConnected: false,
  isInitialized: false,

  isCorrectNetwork: false,
  contractConnector: null,
  rawProviderSigner: null,

  balance: '0',
  setBalance: () => {},

  connect: async () => {},
  disconnect: async () => {},

  safeSwitchChain: () => {},
  signAndSendTx: async () => ({}) as TransactionReceipt,

  getNetworkConfig: () => ({}) as NetworkConfig,
})

export const useWeb3Context = () => {
  return useContext(web3ProviderContext)
}

export const Web3ContextProviderWrapper = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryProvider>
        <Web3ContextProvider>{children}</Web3ContextProvider>
      </QueryProvider>
    </WagmiProvider>
  )
}

const Web3ContextProvider = ({ children }: PropsWithChildren) => {
  const [balance, setBalance] = useState<string>('0')
  const [isInitialized, setIsInitialized] = useState(false)
  const [rawProviderSigner, setRawProviderSigner] = useState<JsonRpcSigner | null>(null)

  const connectManager = useConnect()
  const { isConnected, address, status } = useAppKitAccount()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const appKitEvent = useAppKitEvents()
  const { disconnectAsync } = useDisconnect()
  const connections = useConnections()

  const connect = useCallback(
    async (connector: Connector) => {
      await connectManager.connectAsync({ connector })
    },
    [connectManager],
  )

  // Disconnect any social login
  useEffect(() => {
    const disconnectIdAuth = async () => {
      const idAuthConnection = connections.find(connection => {
        return connection.connector.id === 'ID_AUTH'
      })
      if (!idAuthConnection) return
      await idAuthConnection.connector?.disconnect()
      window.location.reload()
    }
    disconnectIdAuth()
  }, [connections])

  const { data: walletClient } = useConnectorClient({ config: wagmiAdapter.wagmiConfig })
  if (walletClient) {
    // TODO: take a look if it works
    walletClient.pollingInterval = 10_000
  }

  const client = useMemo(() => {
    return walletClient as Client<Transport, Chain, Account>
  }, [walletClient])

  const contractConnector = useMemo(() => {
    if (!client) {
      const networkConfig = networkConfigsMap[NETWORK_NAME]
      const network = new Network(networkConfig.name, networkConfig.chainId)
      return new JsonRpcProvider(networkConfig.rpcUrl, network, {
        staticNetwork: true,
      })
    }
    return clientToProvider(client)
  }, [client])

  useEffect(() => {
    const setSigner = async () => {
      if (client?.account) {
        setRawProviderSigner(await clientToSigner(client as Client<Transport, Chain, Account>))
      }
    }
    setSigner()
  }, [client])

  const isCorrectNetwork = useMemo((): boolean => {
    const correctNetwork = networkConfigsMap[NETWORK_NAME]

    return chainId === correctNetwork.chainId
  }, [chainId])

  const safeSwitchChain = useCallback(
    (chain: AppKitNetwork) => {
      switchNetwork(chain)
    },
    [switchNetwork],
  )

  const signAndSendTx = useCallback(
    async (tx: TransactionRequest) => {
      const signer = await clientToSigner(client)
      const txResponse = await signer.sendTransaction(tx)

      return txResponse.wait()
    },
    [client],
  )

  const getNetworkConfig = useCallback(() => {
    if (!client?.chain.id) return networkConfigsMap[NETWORK_NAME]

    const networkName = getNetworkByChainId(client.chain.id)

    return networkName || networkConfigsMap[NETWORK_NAME]
  }, [client?.chain?.id])

  useEffect(() => {
    if (appKitEvent?.data.event === 'INITIALIZE') {
      setIsInitialized(true)
    }
  }, [appKitEvent, status])

  return (
    <web3ProviderContext.Provider
      value={{
        connectManager,

        client,

        address: address ?? '',
        chain: chainId ?? '',
        isConnected,
        isInitialized,

        isCorrectNetwork,

        connect,
        disconnect: disconnectAsync,

        balance,
        setBalance,

        safeSwitchChain,
        signAndSendTx,

        contractConnector,
        rawProviderSigner,

        getNetworkConfig,
      }}
    >
      {children}
    </web3ProviderContext.Provider>
  )
}
