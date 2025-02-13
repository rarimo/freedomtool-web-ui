import { AbiCoder, ParamType } from 'ethers'

const encoder = new AbiCoder()
const messageProofInputs = {
  components: [
    {
      components: [
        {
          internalType: 'uint256[2]',
          name: 'a',
          type: 'uint256[2]',
        },
        {
          internalType: 'uint256[2][2]',
          name: 'b',
          type: 'uint256[2][2]',
        },
        {
          internalType: 'uint256[2]',
          name: 'c',
          type: 'uint256[2]',
        },
      ],
      internalType: 'struct VerifierHelper.ProofPoints',
      name: 'identityProof',
      type: 'tuple',
    },
    {
      internalType: 'bytes',
      name: 'signature',
      type: 'bytes',
    },
  ],
  internalType: 'struct AbstractAccount.MessageProof',
  name: 'proof_',
  type: 'tuple',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encodeMessageProof(messageProofStruct: any) {
  return encoder.encode([ParamType.from(messageProofInputs)], [messageProofStruct])
}

export function isMetamaskInstalled() {
  // TODO: check if this is the correct way to check if Metamask is installed
  return Boolean(window.ethereum)
}
