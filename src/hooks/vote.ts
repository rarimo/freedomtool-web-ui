import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useWeb3Context } from '@/contexts/web3-context'
import { ProposalStatus } from '@/enums/proposals'
import { formatDateTime } from '@/helpers'
import { useIpfsLoading, useLoading, useProposalState } from '@/hooks'
import { getVotesCount, parseProposalFromContract } from '@/pages/CreateVote/helpers'
import { IVoteIpfs } from '@/pages/CreateVote/types'

export function useVote(id?: string) {
  const { t } = useTranslation()
  const { getProposalInfo } = useProposalState({ shouldFetchProposals: false })
  const { address } = useWeb3Context()

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
    isProposalLoading || metadataLoading || !proposal || !proposalMetadata || isVoteCountLoading
  const isError = metadataError || isCountLoadingError

  const isTopUpAllowed =
    [ProposalStatus.Started, ProposalStatus.Waiting].includes(proposal?.status as ProposalStatus) &&
    address

  return {
    isLoading,
    isError,
    voteDetails,
    proposal,
    proposalMetadata,
    isTopUpAllowed,
  }
}
