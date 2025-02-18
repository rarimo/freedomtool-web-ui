import { BigNumberish, randomBytes } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { config } from '@/config'
import { useWeb3Context } from '@/contexts/web3-context'
import { createContract, ErrorHandler } from '@/helpers'
import { ProposalState__factory } from '@/types/contracts'
import { ProposalsState } from '@/types/contracts/ProposalState'

export const useProposalState = () => {
  const { contractConnector } = useWeb3Context()
  const [lastProposalId, setLastProposalId] = useState<number | null>(null)
  const [proposals, setProposals] = useState<ProposalsState.ProposalInfoStructOutput[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const contract = useMemo(() => {
    if (!contractConnector) return null
    return createContract(config.PROPOSAL_STATE_CONTRACT, contractConnector, ProposalState__factory)
  }, [contractConnector])

  const createProposal = useCallback(
    async (
      proposalConfig: Omit<
        ProposalsState.ProposalConfigStruct,
        'multichoice' | 'votingWhitelistData' | 'votingWhitelist'
      > & { amount: BigNumberish },
    ) => {
      if (!contract) return
      const tx = await contract.contractInstance.createProposal(
        {
          description: proposalConfig.description,
          acceptedOptions: proposalConfig.acceptedOptions,
          startTimestamp: BigInt(proposalConfig.startTimestamp),
          duration: BigInt(proposalConfig.duration),
          multichoice: BigInt(0),
          votingWhitelist: [config.BIO_PASSPORT_VOTING_CONTRACT as string],
          votingWhitelistData: [randomBytes(32)],
        },
        {
          value: proposalConfig.amount,
        },
      )

      await tx.wait()
    },
    [contract],
  )

  // TODO: Use infinite load
  const fetchProposals = useCallback(async () => {
    if (!contract || lastProposalId === null) return
    setIsLoading(true)

    try {
      const ids = []
      for (let id = lastProposalId; id > 0; id--) {
        ids.push(id)
      }

      const proposalsData = await Promise.all(
        ids.map(id => contract.contractInstance.getProposalInfo(id)),
      )

      setProposals(proposalsData)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    } finally {
      setIsLoading(false)
    }
  }, [contract, lastProposalId])

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  useEffect(() => {
    if (!contract) return

    const fetchLastProposalId = async () => {
      try {
        const id = await contract.contractInstance.lastProposalId()
        const parsedId = Number(id)

        setLastProposalId(parsedId >= 0 ? parsedId : 0)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        setLastProposalId(0)
      }
    }

    fetchLastProposalId()
  }, [contract])

  return {
    proposals,
    isLoading,
    lastProposalId,
    createProposal,
  }
}
