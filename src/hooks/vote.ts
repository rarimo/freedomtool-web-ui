import { BN } from '@distributedlab/tools'
import { parseUnits } from 'ethers'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents } from '@/enums'
import { ProposalStatus } from '@/enums/proposals'
import { bus, ErrorHandler, formatDateTime } from '@/helpers'
import { useIpfsLoading, useLoading, useProposalState } from '@/hooks'
import { getVotesCount, parseProposalFromContract } from '@/pages/CreateVote/helpers'
import { IVoteIpfs } from '@/pages/CreateVote/types'

export function useVote(id?: string) {
  const { t } = useTranslation()
  const { balance } = useWeb3Context()
  const {
    addFundsToProposal,
    getProposalInfo,
    isError: contractError,
    isLoading: isContractLoading,
  } = useProposalState({ shouldFetchProposals: false })

  const [amount, setAmount] = useState<string>('0')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const topUpVoteContract = async () => {
    setIsSubmitting(true)
    try {
      if (!id) return
      await addFundsToProposal(BigInt(id), parseUnits(amount, 18))
      bus.emit(BusEvents.success, { message: t('vote.success-msg') })
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      setIsSubmitting(false)
      setAmount('0')
    }
  }

  const isEnoughBalance = useMemo(() => {
    if (!amount || isNaN(Number(amount))) return false
    try {
      const amountBn = BN.fromRaw(amount)
      return amountBn.lte(BN.fromBigInt(balance || 0n))
    } catch {
      return false
    }
  }, [amount, balance])

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
    isSubmitting,
    topUpVoteContract,
    setAmount,
    amount,
    isEnoughBalance,
    proposal,
    proposalMetadata,
  }
}
