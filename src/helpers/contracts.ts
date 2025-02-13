import { JsonRpcProvider, JsonRpcSigner } from 'ethers'

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
