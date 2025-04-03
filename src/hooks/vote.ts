import { time } from '@distributedlab/tools'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { VOTE_QR_BASE_URL } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { ProposalStatus } from '@/enums/proposals'
import {
  ErrorHandler,
  generateQrCodeUrl,
  getVotesCount,
  parseProposalFromContract,
} from '@/helpers'
import { useIpfsLoading, useLoading, useProposalState } from '@/hooks'
import { IProposalMetadata } from '@/types'

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
  } = useIpfsLoading<IProposalMetadata>(proposal?.cid as string)

  const {
    data: voteCount,
    isLoading: isVoteCountLoading,
    isLoadingError: isCountLoadingError,
  } = useLoading(
    null,
    async () => {
      try {
        if (!id) return
        const response = await getVotesCount(id)
        return response.data.vote_count || 0
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        return '–'
      }
    },
    { silentError: true },
  )

  const formattedStartDate = time(proposal?.startTimestamp).format('MM/DD/YYYY HH:mm')
  const formattedEndDate = time((proposal?.startTimestamp ?? 0) + (proposal?.duration ?? 0)).format(
    'MM/DD/YYYY HH:mm',
  )

  const isLoading =
    isProposalLoading || metadataLoading || !proposal || !proposalMetadata || isVoteCountLoading
  const isError = metadataError || isCountLoadingError

  const isTopUpAllowed =
    [ProposalStatus.Started, ProposalStatus.Waiting].includes(proposal?.status as ProposalStatus) &&
    address

  const qrCodeUrl = generateQrCodeUrl(VOTE_QR_BASE_URL, {
    type: 'voting',
    proposal_id: id ?? '',
  })

  const participantsAmount = useMemo(() => {
    if (proposal?.voteResults) {
      return Math.max(
        ...proposal.voteResults.map(results =>
          results.reduce((sum, value) => sum + Number(value), 0),
        ),
        0,
      )
    }

    return 0
  }, [proposal?.voteResults])

  const voteDetails = useMemo(() => {
    if (!proposal) return []
    return [
      {
        title: t('poll.start-date'),
        description: formattedStartDate,
      },
      {
        title: t('poll.end-date'),
        description: formattedEndDate,
      },
      {
        title: t('poll.remaining-votes'),
        description: voteCount,
      },
    ]
  }, [proposal, t, formattedStartDate, formattedEndDate, voteCount])

  return {
    isLoading,
    isError,
    voteDetails,
    proposal,
    proposalMetadata,
    isTopUpAllowed,
    qrCodeUrl,

    formattedStartDate,
    formattedEndDate,

    participantsAmount,
  }
}
