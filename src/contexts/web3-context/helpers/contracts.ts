import { JsonRpcProvider, JsonRpcSigner } from 'ethers'
import {
  Abi,
  type Account,
  type Chain,
  Client,
  getContract,
  GetContractReturnType,
  type Transport,
} from 'viem'

type AbstractFactoryClass = {
  connect: (address: string, provider: JsonRpcProvider | JsonRpcSigner) => unknown
  createInterface: () => unknown
}

type AbstractFactoryClassReturnType<F extends AbstractFactoryClass> = {
  contractInstance: ReturnType<F['connect']>
  contractInterface: ReturnType<F['createInterface']>
}

export const createContract = <F extends AbstractFactoryClass>(
  address: string,
  provider: JsonRpcProvider | JsonRpcSigner,
  factoryClass: F,
): AbstractFactoryClassReturnType<F> => {
  const contractInstance = factoryClass.connect(address, provider) as ReturnType<F['connect']>

  const contractInterface = factoryClass.createInterface() as ReturnType<F['createInterface']>

  return {
    contractInstance,
    contractInterface,
  }
}

export const createContractInstance = <
  A extends Abi,
  Acc extends Account | undefined = Account | undefined,
>(
  address: `0x${string}`,
  abi: A,
  client: Client<Transport, Chain, Acc>,
): GetContractReturnType<A, Client<Transport, Chain, Account>> => {
  return getContract({
    address,
    abi,
    client: client as Client<Transport, Chain, Account>,
  })
}
