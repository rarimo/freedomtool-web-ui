import { BN } from '@distributedlab/tools'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NATIVE_CURRENCY, ZERO_DATE } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { ProposalStatus } from '@/enums/proposal'
import {
  calculateAgeDiffFromBirthDateBound,
  formatAmountShort,
  formatCountry,
  formatSex,
  formatUtcDateTime,
  getProposals,
  parseProposalFromContract,
} from '@/helpers'
import { useLoading, useProposalState } from '@/hooks'
import { PollDetailsProps } from '@/pages/Poll/components/PollDetails'

export function useProposal(id?: string) {
  const { t } = useTranslation()
  const { getProposalInfo } = useProposalState()
  const { address } = useWeb3Context()
  const [isRestricted, setIsRestricted] = useState(false)

  const {
    data: proposal,
    isLoading: isProposalLoading,
    isLoadingError: isProposalLoadingError,
  } = useLoading(
    null,
    async () => {
      if (!id) return null
      const proposalFromContract = await getProposalInfo(Number(id))

      const { data: proposals } = await getProposals({
        query: {
          filter: {
            creator: address,
            proposal_id: id,
          },
        },
      })

      if (address && proposals?.[0]?.owner !== address) {
        setIsRestricted(true)
        return null
      }

      if (!address) return null

      if (proposalFromContract) {
        const parsedContractProposal = parseProposalFromContract(proposalFromContract)

        return {
          metadata: proposals?.[0]?.metadata,
          parsed: proposals?.[0],
          fromContract: parsedContractProposal,
        }
      }

      return null
    },
    {
      loadArgs: [address],
    },
  )

  const formattedStartDate = formatUtcDateTime(proposal?.parsed?.start_timestamp ?? 0)
  const formattedEndDate = formatUtcDateTime(proposal?.parsed?.end_timestamp ?? 0)

  const isLoading = isProposalLoading || (!proposal && !isRestricted && !isProposalLoadingError)

  const isTopUpAllowed =
    [ProposalStatus.Started, ProposalStatus.Waiting].includes(
      proposal?.fromContract.status as ProposalStatus,
    ) && address

  const participantsAmount = useMemo(() => {
    if (proposal?.fromContract.voteResults) {
      return Math.max(
        ...proposal.fromContract.voteResults.map(results =>
          results.reduce((sum, value) => sum + Number(value), 0),
        ),
        0,
      )
    }

    return 0
  }, [proposal])

  const criteria = useMemo(() => {
    const whitelistData = proposal?.fromContract.votingWhitelistData

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
            proposal?.fromContract.startTimestamp,
          )
        : null

    const maxAge =
      whitelistData?.birthDateLowerbound && whitelistData.birthDateLowerbound !== ZERO_DATE
        ? calculateAgeDiffFromBirthDateBound(
            whitelistData.birthDateLowerbound,
            proposal?.fromContract.startTimestamp,
          )
        : null

    const formattedSex = formatSex(whitelistData?.sex)

    return {
      formattedNationalitiesArray,
      minAge,
      maxAge,
      formattedSex,
    }
  }, [proposal])

  const pollDetails = useMemo<PollDetailsProps[]>(() => {
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
    ]
  }, [proposal, t, formattedStartDate, formattedEndDate])

  const balanceDetails = useMemo(() => {
    if (!proposal) return []
    return [
      {
        title: t('poll.total-spent'),
        description: `${formatAmountShort(
          BN.fromBigInt(proposal.parsed?.total_balance ?? 0).sub(
            BN.fromBigInt(proposal.parsed?.remaining_balance ?? 0),
          ),
        )} ${NATIVE_CURRENCY} / ${formatAmountShort(proposal.parsed?.total_balance ?? 0)} ${NATIVE_CURRENCY}`,
      },
    ]
  }, [proposal, t])

  const isAlive = [ProposalStatus.Waiting, ProposalStatus.Started].includes(
    proposal?.fromContract?.status as ProposalStatus,
  )

  return {
    isRestricted,
    isLoading,
    isError: isProposalLoadingError,

    isAlive,

    criteria,

    pollDetails,
    balanceDetails,

    proposal,
    isTopUpAllowed,
    proposalMetadata: proposal?.metadata,

    formattedStartDate,
    formattedEndDate,

    participantsAmount,
    remainingVotesCount: proposal?.parsed?.remaining_votes_count ?? 0,
  }
}
