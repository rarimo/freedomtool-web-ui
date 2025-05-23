import { BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'

import { config } from '@/config'
import { POLL_MIN_FUNDING_AMOUNT } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { createContract, extractProposalIdFromTxReceipt } from '@/helpers'
import { ProposalState__factory } from '@/types/contracts'
import { ProposalsState } from '@/types/contracts/ProposalState'

export const useProposalState = () => {
  const { contractConnector } = useWeb3Context()

  const contract = useMemo(() => {
    if (!contractConnector) return null
    return createContract(config.PROPOSAL_STATE_CONTRACT, contractConnector, ProposalState__factory)
  }, [contractConnector])

  /**
   * Create a proposal
   * @returns Proposal ID in string format or null
   */
  const createProposal = useCallback(
    async (
      proposalConfig: Omit<
        ProposalsState.ProposalConfigStruct,
        'multichoice' | 'votingWhitelistData' | 'votingWhitelist'
      > & { amount: BigNumberish; votingWhitelistData: string },
    ): Promise<string | null> => {
      if (!contract) return null
      const tx = await contract.contractInstance.createProposal(
        {
          description: proposalConfig.description,
          acceptedOptions: proposalConfig.acceptedOptions,
          startTimestamp: BigInt(proposalConfig.startTimestamp),
          duration: BigInt(proposalConfig.duration),
          multichoice: BigInt(0),
          votingWhitelist: [config.BIO_PASSPORT_VOTING_CONTRACT as string],
          votingWhitelistData: [proposalConfig.votingWhitelistData],
        },
        {
          value: proposalConfig.amount,
        },
      )

      const receipt = await tx.wait()
      return extractProposalIdFromTxReceipt(receipt)
    },
    [contract],
  )

  const calculateCreateProposalGasLimit = useCallback(
    async (
      proposalConfig: Omit<
        ProposalsState.ProposalConfigStruct,
        'multichoice' | 'votingWhitelistData' | 'votingWhitelist'
      > & { amount: BigNumberish; votingWhitelistData: string },
    ) => {
      if (!contract) return
      const gasLimit = await contract.contractInstance.createProposal.estimateGas(
        {
          description: proposalConfig.description,
          acceptedOptions: proposalConfig.acceptedOptions,
          startTimestamp: BigInt(proposalConfig.startTimestamp),
          duration: BigInt(proposalConfig.duration),
          multichoice: BigInt(0),
          votingWhitelist: [config.BIO_PASSPORT_VOTING_CONTRACT as string],
          votingWhitelistData: [proposalConfig.votingWhitelistData],
        },
        { value: POLL_MIN_FUNDING_AMOUNT },
      )

      return gasLimit
    },
    [contract],
  )

  const getProposalInfo = useCallback(
    (id: number) => {
      if (!contract) return
      return contract.contractInstance.getProposalInfo(id)
    },
    [contract],
  )

  const addFundsToProposal = useCallback(
    async (proposalId: BigNumberish, amount: BigNumberish) => {
      if (!contract) return
      const tx = await contract?.contractInstance.addFundsToProposal(proposalId, {
        value: amount,
      })
      await tx.wait()
    },
    [contract],
  )

  const calculateAddFundsToProposalGasLimit = useCallback(
    async (proposalId: BigNumberish, amount: BigNumberish) => {
      if (!contract) return
      const gasLimit = await contract.contractInstance.addFundsToProposal.estimateGas(proposalId, {
        value: amount,
      })

      return gasLimit
    },
    [contract],
  )

  return {
    createProposal,
    addFundsToProposal,
    getProposalInfo,

    calculateCreateProposalGasLimit,
    calculateAddFundsToProposalGasLimit,
  }
}
