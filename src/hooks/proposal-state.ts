import { BigNumberish, randomBytes } from 'ethers'
import { useCallback, useMemo, useState } from 'react'

import { config } from '@/config'
import { useWeb3Context } from '@/contexts/web3-context'
import { createContract, ErrorHandler } from '@/helpers'
import { IProposalWithId } from '@/pages/CreateVote/types'
import { ProposalState__factory } from '@/types/contracts'
import { ProposalsState } from '@/types/contracts/ProposalState'

import { useLoading } from './loading'

interface UseProposalStateOptions {
  shouldFetchProposals?: boolean
}

const PAGE_SIZE = 10

export const useProposalState = ({ shouldFetchProposals = true }: UseProposalStateOptions) => {
  const { contractConnector } = useWeb3Context()
  const [currentPage, setCurrentPage] = useState(0)

  const contract = useMemo(() => {
    if (!contractConnector) return null
    return createContract(config.PROPOSAL_STATE_CONTRACT, contractConnector, ProposalState__factory)
  }, [contractConnector])

  const {
    data: lastProposalId,
    isLoading: isLastProposalIdLoading,
    isLoadingError: isLastProposalIdLoadingError,
  } = useLoading(
    null,
    async () => {
      const id = await contract?.contractInstance.lastProposalId()
      const parsedId = Number(id)

      return parsedId >= 0 ? parsedId : 0
    },
    { silentError: true, loadOnMount: true },
  )

  const {
    data: proposals,
    reload: fetchNextPage,
    isLoading: isProposalsLoading,
    isLoadingError: isProposalsLoadingError,
  } = useLoading<IProposalWithId[] | null>(
    [],
    async () => {
      if (!lastProposalId) return []
      const startId = lastProposalId - currentPage * PAGE_SIZE
      const endId = Math.max(startId - PAGE_SIZE + 1, 1)

      const ids = []
      for (let id = startId; id >= endId; id--) {
        ids.push(id)
      }

      const proposalsData = await Promise.all(
        ids.map(async id => {
          try {
            const proposal = await contract?.contractInstance.getProposalInfo(id)
            return { id, proposal: { ...proposal } }
          } catch (error) {
            ErrorHandler.processWithoutFeedback(error)
            return null
          }
        }),
      )

      return proposalsData.filter((proposal): proposal is IProposalWithId => proposal !== null)
    },
    {
      loadArgs: [shouldFetchProposals, lastProposalId],
      loadOnMount: Boolean(shouldFetchProposals && contract),
    },
  )

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

  const getProposalInfo = useCallback(
    async (id: number) => {
      if (!contract) return
      const proposal = await contract.contractInstance.getProposalInfo(id)
      return proposal
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

  return {
    proposals,
    fetchNextPage: () => {
      setCurrentPage(prev => prev + 1)
      fetchNextPage()
    },
    isLoading: isLastProposalIdLoading || isProposalsLoading,
    isError: isProposalsLoadingError || isLastProposalIdLoadingError,
    lastProposalId,
    createProposal,
    addFundsToProposal,
    getProposalInfo,
  }
}
