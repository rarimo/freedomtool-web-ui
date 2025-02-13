import { BrowserProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient } from 'wagmi'

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const rpcUrl = transport.url || chain.rpcUrls.default.http[0]
  // TODO: there is an issue with initial JsonRpcProvider requests
  //  batchMaxCount fixes it, but it's a workaround
  return new JsonRpcProvider(rpcUrl, network, { staticNetwork: true, batchMaxCount: 1 })
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  return provider.getSigner(account.address)
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

export async function getSignerOrProvider<A extends Account | undefined = Account | undefined>(
  client: Client<Transport, Chain, A>,
): Promise<A extends Account ? JsonRpcSigner : JsonRpcProvider> {
  if (client.account) {
    return clientToSigner(client as Client<Transport, Chain, Account>) as Promise<
      A extends Account ? JsonRpcSigner : JsonRpcProvider
    >
  }

  return clientToProvider(client) as A extends Account ? JsonRpcSigner : JsonRpcProvider
}
