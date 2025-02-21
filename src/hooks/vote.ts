import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { BusEvents } from '@/enums'
import { ProposalStatus } from '@/enums/proposals'
import { bus, ErrorHandler, formatDateTime } from '@/helpers'
import { useCheckVoteAmount, useIpfsLoading, useLoading, useProposalState } from '@/hooks'
import { getVotesCount, parseProposalFromContract } from '@/pages/CreateVote/helpers'
import { IVoteIpfs } from '@/pages/CreateVote/types'

export function useVote(id?: string) {
  const { t } = useTranslation()
  const {
    addFundsToProposal,
    getProposalInfo,
    isError: contractError,
    isLoading: isContractLoading,
  } = useProposalState({ shouldFetchProposals: false })

  const { checkVoteAmount, isCalculating, setAmount, amountRef } = useCheckVoteAmount()

  const { data: proposal, isLoading: isProposalLoading } = useLoading(null, async () => {
    if (!id) return null
    const proposalFromContract = await getProposalInfo(Number(id))
    if (proposalFromContract) {
      return parseProposalFromContract(proposalFromContract)
    }
    return null
  })

  const {
    data: proposalMetadata,
    isLoading: metadataLoading,
    isLoadingError: metadataError,
  } = useIpfsLoading<IVoteIpfs>(proposal?.cid as string)

  const {
    data: voteCount,
    isLoading: isVoteCountLoading,
    isLoadingError: isCountLoadingError,
  } = useLoading(
    null,
    async () => {
      if (!id) return
      const response = await getVotesCount(id)
      return response.data.vote_count || 0
    },
    { silentError: true },
  )

  const topUpVoteContract = useCallback(async () => {
    try {
      if (!id) return
      await addFundsToProposal(id, amountRef.current)
      bus.emit(BusEvents.success, { message: t('vote.success-msg') })
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      setAmount(0n)
    }
  }, [addFundsToProposal, amountRef, id, setAmount, t])

  const voteDetails = useMemo(() => {
    if (!proposal) return []
    const { duration, startTimestamp, status } = proposal

    return [
      {
        title: t('vote.remaining-votes'),
        description: voteCount,
      },
      {
        title: t('vote.status'),
        description: ProposalStatus[status],
      },
      {
        title: t('vote.start-date'),
        description: formatDateTime(startTimestamp),
      },
      {
        title: t('vote.end-date'),
        description: formatDateTime(startTimestamp + duration),
      },
    ]
  }, [t, voteCount, proposal])

  const isLoading =
    isProposalLoading ||
    metadataLoading ||
    isContractLoading ||
    !proposal ||
    !proposalMetadata ||
    isVoteCountLoading
  const isError = contractError || metadataError || isCountLoadingError

  return {
    isLoading,
    isError,
    voteDetails,
    topUpVoteContract,
    proposal,
    proposalMetadata,
    checkVoteAmount,
    isCalculating,
  }
}
