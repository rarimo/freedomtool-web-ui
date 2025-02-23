import { BigNumberish, randomBytes } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { DEFAULT_PAGE_LIMIT } from '@/api/clients'
import { config } from '@/config'
import { useWeb3Context } from '@/contexts/web3-context'
import { createContract, ErrorHandler } from '@/helpers'
import { ZERO_PROPOSAL_SMT } from '@/pages/CreateVote/constants'
import { IProposalWithId } from '@/pages/CreateVote/types'
import { ProposalState__factory } from '@/types/contracts'
import { ProposalsState } from '@/types/contracts/ProposalState'

import { useLoading } from './loading'
import { useProposalMultiPageLoading } from './proposal-multi-page-loading'

interface UseProposalStateOptions {
  shouldFetchProposals?: boolean
}

const LAST_VALID_PROPOSAL_ID = 1

export const useProposalState = ({ shouldFetchProposals = true }: UseProposalStateOptions) => {
  const { contractConnector } = useWeb3Context()

  const contract = useMemo(() => {
    if (!contractConnector) return null
    return createContract(config.PROPOSAL_STATE_CONTRACT, contractConnector, ProposalState__factory)
  }, [contractConnector])

  const [lastProposalId, setLastProposalId] = useState<number | null>(null)
  const [loadedProposals, setLoadedProposals] = useState<Set<number>>(new Set())

  const { data: _lastProposalId } = useLoading(
    null,
    async () => {
      const id = await contract?.contractInstance.lastProposalId()
      const parsedId = Number(id)

      return parsedId >= 0 ? parsedId : 0
    },
    { silentError: true, loadOnMount: true },
  )

  const fetchProposals = useCallback(
    async (page: number, pageLimit: number) => {
      if (!lastProposalId) return []

      const startId = lastProposalId - (page - 1) * pageLimit
      const endId = Math.max(startId - pageLimit + 1, LAST_VALID_PROPOSAL_ID)
      const ids: number[] = []

      // Unique proposal ids
      for (let id = startId; id >= endId; id--) {
        if (!loadedProposals.has(id)) {
          ids.push(id)
        }
      }

      if (ids.length === 0) return []

      // If the proposal contains invalid data, getProposalInfo will throw an error.
      // However, if the proposal with the given ID doesn't exist,
      // it will return a valid but empty proposal.
      const proposalsData = await Promise.allSettled(
        ids.map(async id => {
          try {
            const proposal = await contract?.contractInstance.getProposalInfo(id)
            return { id, proposal }
          } catch (error) {
            ErrorHandler.process(error)
            return { id, proposal: null }
          }
        }),
      )

      const successfulProposals = proposalsData
        .filter(
          (result): result is PromiseFulfilledResult<IProposalWithId> =>
            // Filtering out rejected values and empty proposals (with empty SMT)
            result.status === 'fulfilled' && result.value.proposal?.[0] !== ZERO_PROPOSAL_SMT,
        )
        .map(result => result.value)

      const newLoadedProposals = new Set(loadedProposals)
      successfulProposals.forEach(proposal => newLoadedProposals.add(proposal.id))
      setLoadedProposals(newLoadedProposals)

      if (successfulProposals.length > LAST_VALID_PROPOSAL_ID) {
        setLastProposalId(successfulProposals[successfulProposals.length - 1].id)
      }

      return successfulProposals
    },
    [contract, lastProposalId, loadedProposals],
  )

  const {
    data: proposals,
    loadingState: proposalsLoadingState,
    hasNext: hasNextProposals,
    loadNext: loadNextProposals,
    reload: reloadProposals,
  } = useProposalMultiPageLoading<IProposalWithId>(fetchProposals, {
    loadOnMount: Boolean(shouldFetchProposals && contract && lastProposalId),
    loadArgs: [lastProposalId],
    pageLimit: DEFAULT_PAGE_LIMIT,
  })

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

  useEffect(() => {
    if (lastProposalId === null && _lastProposalId !== null) {
      setLastProposalId(_lastProposalId)
    }
  }, [_lastProposalId, lastProposalId])

  return {
    proposals,
    proposalsLoadingState,
    hasNextProposals,
    loadNextProposals,
    reloadProposals,

    createProposal,
    addFundsToProposal,
    getProposalInfo,
  }
}
