import { JsonApiClientRequestOpts } from '@distributedlab/jac'
import { time } from '@distributedlab/tools'
import { toBeHex } from 'ethers'
import { decodeAbiParameters, encodeAbiParameters, stringToHex } from 'viem'

import { api } from '@/api/clients'
import { WHITELIST_DATA_ABI_TYPE, ZERO_DATE } from '@/constants'
import { ApiServicePaths } from '@/enums'
import { CreatePollSchema } from '@/pages/CreatePoll/createPollSchema'
import { DecodedWhitelistData, Nationality, ParsedProposal, Proposal, Sex } from '@/types'
import { ProposalsState } from '@/types/contracts/ProposalState'

import { hexToAscii } from './text'

export const prepareAcceptedOptionsToIpfs = (questions: CreatePollSchema['questions']) =>
  questions.map(question => ({
    title: question.text,
    variants: question.options.map(option => option.text),
  }))

export function calculateProposalSelector(opts: {
  nationalities: boolean
  uniqueness: boolean
  minAge: boolean
  maxAge: boolean
  sex: boolean
  expiration: boolean
}): string {
  // Query proof selector:
  // https://github.com/rarimo/passport-zk-circuits?tab=readme-ov-file#selector
  const flags = [
    true, // nullifier
    false, // birth date
    false, // expiration date
    false, // name
    false, // nationality
    opts.nationalities, // nationalities
    opts.sex, // sex
    false, // document number
    false, // timestamp lowerbound
    opts.uniqueness, // timestamp upperbound
    false, // identity counter lowerbound
    opts.uniqueness, // identity counter upperbound
    opts.expiration, // passport expiration lowerbound
    false, // passport expiration upperbound
    opts.maxAge, // birth date lowerbound
    opts.minAge, // birth date upperbound
    false, // verify citizenship mask as a whitelist
    false, // verify citizenship mask as a blacklist
  ]

  const bits = flags.map(value => Number(value))
  const binaryString = bits.reverse().join('')
  const hexString = BigInt(`0b${binaryString}`).toString(16).toUpperCase()

  return `0x${hexString}`
}

// The array [3, 7] indicates that there are
// [0b11, 0b111] -> 2 and 3 choices per options correspondingly available.
export const prepareAcceptedOptionsToContract = (questions: CreatePollSchema['questions']) => {
  return questions.map(question => {
    const optionsCount = question.options.length
    const bitMask = (1 << optionsCount) - 1
    return bitMask
  })
}

export const getVotesCount = (id: string) => {
  return api.get<{ vote_count: number }>(
    `${ApiServicePaths.ProofVerificationRelayer}/v2/count-remaining-votes/${id}`,
  )
}

export const getPredictedVotesCount = async (
  amount: string,
  proposalId?: string,
): Promise<{ count_tx_predict: string; amount_predict: string }> => {
  const response = await api.post<{ amount_predict: string; count_tx_predict: string }>(
    `${ApiServicePaths.ProofVerificationRelayer}/v2/predict`,
    {
      body: {
        data: {
          type: 'vote_predict_count_tx',
          attributes: {
            amount,
            ...(proposalId && { voting_id: proposalId }),
          },
        },
      },
    },
  )

  return response.data
}

export const getPredictedVotesAmount = async (
  votesCount: string,
  proposalId?: string,
): Promise<{ count_tx_predict: string; amount_predict: string }> => {
  const response = await api.post<{ amount_predict: string; count_tx_predict: string }>(
    `${ApiServicePaths.ProofVerificationRelayer}/v2/predict`,
    {
      body: {
        data: {
          type: 'vote_predict_amount',
          attributes: {
            count_tx: votesCount,
            ...(proposalId && { voting_id: proposalId }),
          },
        },
      },
    },
  )

  return response.data
}

export const parseProposalFromContract = (
  proposal: ProposalsState.ProposalInfoStructOutput,
): ParsedProposal => {
  const rawWhitelistData = proposal[2][6].toString()

  const votingWhitelistData = decodeWhitelistData(rawWhitelistData)

  return {
    cid: proposal[2][4],
    status: Number(proposal[1]),
    startTimestamp: Number(proposal[2].startTimestamp),
    duration: Number(proposal[2].duration),
    voteResults: proposal[3].map(bigIntArray => bigIntArray.map(Number)),
    votingWhitelistData,
    rawProposal: proposal,
  }
}

export const decodeWhitelistData = (whitelistDataHex: string) => {
  const _decodedData = decodeAbiParameters(
    [WHITELIST_DATA_ABI_TYPE],
    whitelistDataHex as `0x${string}`,
  )[0]

  const decodedData: DecodedWhitelistData = {
    selector: _decodedData.selector,
    nationalities: _decodedData.nationalities.map(item => hexToAscii(toBeHex(item))),
    identityCreationTimestampUpperBound: Number(_decodedData.identityCreationTimestampUpperBound),
    identityCounterUpperBound: Number(_decodedData.identityCounterUpperBound),
    sex: hexToAscii(toBeHex(_decodedData.sex)) as Sex,
    birthDateLowerbound: toBeHex(_decodedData.birthDateLowerbound),
    birthDateUpperbound: toBeHex(_decodedData.birthDateUpperbound),
    expirationDateLowerBound: hexToAscii(toBeHex(_decodedData.expirationDateLowerBound)),
  }

  return decodedData
}

export const getTotalVotesPerQuestion = (proposal: ParsedProposal, questionIndex: number) =>
  proposal.voteResults[questionIndex]?.reduce((acc, curr) => acc + curr, 0) || 0

export const getCountProgress = (count: number, totalCount: number) =>
  totalCount > 0 ? (count / totalCount) * 100 : 0

export const prepareVotingWhitelistData = (config: {
  maxAge?: number | null
  minAge?: number | null
  nationalities: Nationality[]
  sex: Sex
  startTimestamp: number
}) => {
  const { minAge, maxAge, startTimestamp, nationalities, sex: _sex } = config
  const formattedNationalities = nationalities
    .flatMap(({ codes }) => codes)
    .map(code => stringToHex(code))

  const identityCreationTimestampUpperBound = time(startTimestamp).subtract(1, 'hour').timestamp
  const identityCounterUpperBound = 1

  const birthDateUpperbound = minAge
    ? stringToHex(time().subtract(minAge, 'years').format('YYMMDD'))
    : ZERO_DATE
  const birthDateLowerbound = maxAge
    ? stringToHex(time().subtract(maxAge, 'years').format('YYMMDD'))
    : ZERO_DATE

  const expirationDateLowerBound = stringToHex(time(startTimestamp).format('YYMMDD'))
  const sex = _sex ? stringToHex(_sex) : 0

  // Uniqueness and passport expiration should be configured for each poll
  const selector = calculateProposalSelector({
    expiration: true,
    nationalities: formattedNationalities.length > 0,
    uniqueness: true,
    minAge: Boolean(minAge),
    maxAge: Boolean(maxAge),
    sex: Boolean(sex),
  })

  return encodeAbiParameters(
    [WHITELIST_DATA_ABI_TYPE],
    [
      {
        selector: BigInt(selector),
        nationalities: formattedNationalities.map(BigInt),
        identityCreationTimestampUpperBound: BigInt(identityCreationTimestampUpperBound),
        identityCounterUpperBound: BigInt(identityCounterUpperBound),
        sex: BigInt(sex),
        birthDateLowerbound: BigInt(birthDateLowerbound),
        birthDateUpperbound: BigInt(birthDateUpperbound),
        expirationDateLowerBound: BigInt(expirationDateLowerBound),
      },
    ],
  )
}

export const getProposals = async (opts?: Partial<JsonApiClientRequestOpts>) => {
  const data = await api.get<Proposal[]>(
    `${ApiServicePaths.ProofVerificationRelayer}/v2/proposals`,
    opts,
  )

  return data
}
