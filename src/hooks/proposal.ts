import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ZERO_DATE } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { ProposalStatus } from '@/enums/proposal'
import {
  calculateAgeDiffFromBirthDateBound,
  ErrorHandler,
  formatCountry,
  formatSex,
  formatUtcDateTime,
  getVotesCount,
  parseProposalFromContract,
} from '@/helpers'
import { useIpfsLoading, useLoading, useProposalState } from '@/hooks'
import { IPollDetails } from '@/pages/Poll/components/PollDetails'
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
    isLoading: isMetadataLoading,
    isLoadingError: isMetadataError,
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

  const formattedStartDate = formatUtcDateTime(proposal?.startTimestamp ?? 0)
  const formattedEndDate = formatUtcDateTime(
    (proposal?.startTimestamp ?? 0) + (proposal?.duration ?? 0),
  )

  const isLoading =
    isProposalLoading ||
    isMetadataLoading ||
    !proposal ||
    !proposalMetadata ||
    isRemainingVotesCountLoading

  const isError = isMetadataError || isRemainingVotesCountLoadingError || isProposalLoadingError

  const isTopUpAllowed =
    [ProposalStatus.Started, ProposalStatus.Waiting].includes(proposal?.status as ProposalStatus) &&
    address

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

  const criteria = useMemo(() => {
    const whitelistData = proposal?.votingWhitelistData

    // Countries as a criteria string if exists -> ["Ukraine, Georgia"]
    const formattedNationalitiesArray = whitelistData?.nationalities
      ? [
          ...new Set(
            whitelistData.nationalities.map(country => formatCountry(country, { withFlag: true })),
          ),
        ]
      : null

    const minAge =
      whitelistData?.birthDateUpperbound && whitelistData.birthDateUpperbound !== ZERO_DATE
        ? calculateAgeDiffFromBirthDateBound(
            whitelistData.birthDateUpperbound,
            proposal?.startTimestamp,
          )
        : null

    const maxAge =
      whitelistData?.birthDateLowerbound && whitelistData.birthDateLowerbound !== ZERO_DATE
        ? calculateAgeDiffFromBirthDateBound(
            whitelistData.birthDateLowerbound,
            proposal?.startTimestamp,
          )
        : null

    const formattedSex = formatSex(whitelistData?.sex)

    return {
      formattedNationalitiesArray,
      minAge,
      maxAge,
      formattedSex,
    }
  }, [proposal?.votingWhitelistData, proposal?.startTimestamp])

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
        description: `${participantsAmount}/${remainingVotesCount ?? 0 + participantsAmount}`,
      },
    ]
  }, [proposal, t, formattedStartDate, formattedEndDate, participantsAmount, remainingVotesCount])

  return {
    isLoading,
    isError,

    criteria,

    pollDetails,
    proposal,
    proposalMetadata,
    isTopUpAllowed,

    formattedStartDate,
    formattedEndDate,

    participantsAmount,
    remainingVotesCount,
  }
}
