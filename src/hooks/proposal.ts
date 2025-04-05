import { time } from '@distributedlab/tools'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { VOTE_QR_BASE_URL, ZERO_DATE } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { ProposalStatus } from '@/enums/proposals'
import {
  ErrorHandler,
  formatCountry,
  formatSex,
  generateQrCodeUrl,
  getVotesCount,
  hexToAscii,
  parseProposalFromContract,
} from '@/helpers'
import { useIpfsLoading, useLoading, useProposalState } from '@/hooks'
import { IPollDetails } from '@/pages/Vote/components/PollDetails'
import { ProposalMetadata } from '@/types'

export function useProposal(id?: string) {
  const { t } = useTranslation()
  const { getProposalInfo } = useProposalState()
  const { address } = useWeb3Context()

  const {
    data: proposal,
    isLoading: isProposalLoading,
    isLoadingError: isProposalLoadingError,
  } = useLoading(null, async () => {
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
  } = useIpfsLoading<ProposalMetadata>(proposal?.cid as string)

  const {
    data: remainingVotesCount,
    isLoading: isRemainingVotesCountLoading,
    isLoadingError: isRemainingVotesCountLoadingError,
  } = useLoading(
    null,
    async () => {
      try {
        if (!id) return
        const response = await getVotesCount(id)
        return response.data.vote_count || 0
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        return 0
      }
    },
    { silentError: true },
  )

  const formattedStartDate = time(proposal?.startTimestamp).format('MM/DD/YYYY HH:mm')
  const formattedEndDate = time((proposal?.startTimestamp ?? 0) + (proposal?.duration ?? 0)).format(
    'MM/DD/YYYY HH:mm',
  )

  const isLoading =
    isProposalLoading ||
    metadataLoading ||
    !proposal ||
    !proposalMetadata ||
    isRemainingVotesCountLoading

  const isError = metadataError || isRemainingVotesCountLoadingError || isProposalLoadingError

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

  const criterias = useMemo(() => {
    const _criterias = proposal?.votingWhitelistData

    // Countries as a criteria string if exists -> ["Ukraine, Georgia"]
    const formattedNationalitiesArray = _criterias?.nationalities
      ? [
          ...new Set(
            _criterias.nationalities.map(country => formatCountry(country, { withFlag: true })),
          ),
        ]
      : null

    const birthDateUpperboundAge =
      _criterias?.birthDateUpperbound && _criterias.birthDateUpperbound !== ZERO_DATE
        ? time().diff(time(hexToAscii(_criterias.birthDateUpperbound), 'YYMMDD'), 'year')
        : null

    const birthDateLowerBoundAge =
      _criterias?.birthDateLowerbound && _criterias.birthDateLowerbound !== ZERO_DATE
        ? time().diff(time(hexToAscii(_criterias.birthDateLowerbound), 'YYMMDD'), 'year')
        : null

    const formattedSex = formatSex(_criterias?.sex)

    return {
      formattedNationalitiesArray,
      birthDateUpperboundAge,
      birthDateLowerBoundAge,
      formattedSex,
    }
  }, [proposal?.votingWhitelistData])

  const pollDetails = useMemo<IPollDetails[]>(() => {
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
        description: `${participantsAmount}/${remainingVotesCount}`,
      },
    ]
  }, [proposal, t, formattedStartDate, formattedEndDate, participantsAmount, remainingVotesCount])

  return {
    isLoading,
    isError,

    criterias,

    pollDetails,
    proposal,
    proposalMetadata,
    isTopUpAllowed,
    qrCodeUrl,

    formattedStartDate,
    formattedEndDate,

    participantsAmount,
    remainingVotesCount,
  }
}
