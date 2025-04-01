import { time } from '@distributedlab/tools'
import { AbiCoder, hexlify } from 'ethers'
import { stringToHex } from 'viem'

import { api } from '@/api/clients'
import { ApiServicePaths } from '@/enums'
import { CreatePollSchema } from '@/pages/CreatePoll/createPollSchema'
import {
  INationality,
  IParsedProposal,
  type SEX_OPTIONS,
  VoteAmountOverload,
  VoteCountOverload,
  VoteParamsInput,
} from '@/types'
import { ProposalsState } from '@/types/contracts/ProposalState'

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

/**
 * Overload I
 *
 * Predicts the token amount based on the number of votes.
 * @param params - Object containing vote count and optional proposal ID.
 * @returns An object with the predicted token amount.
 */
export async function predictVoteParams(
  params: VoteAmountOverload,
): Promise<{ amount_predict: string }>

/**
 * Overload II
 *
 * Predicts the number of votes based on the token amount.
 * @param params - Object containing the token amount and optional proposal ID.
 * @returns An object with the predicted vote count.
 */
export async function predictVoteParams(
  params: VoteCountOverload,
): Promise<{ count_tx_predict: string }>

// Implementation
export async function predictVoteParams(params: VoteParamsInput) {
  const { type, proposalId, ...rest } = params

  let attributes: { count_tx: string } | { amount: string } | undefined

  if (type === 'vote_predict_amount' && 'votesCount' in rest) {
    attributes = { count_tx: rest.votesCount }
  }

  if (type === 'vote_predict_count_tx' && 'amount' in rest) {
    attributes = { amount: rest.amount }
  }

  const response = await api.post<{ amount_predict: string } | { count_tx_predict: string }>(
    `${ApiServicePaths.ProofVerificationRelayer}/v2/predict`,
    {
      body: {
        data: {
          type,
          attributes: {
            ...attributes,
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
): IParsedProposal => ({
  cid: proposal[2][4],
  status: Number(proposal[1]),
  startTimestamp: Number(proposal[2].startTimestamp),
  duration: Number(proposal[2].duration),
  voteResults: proposal[3],
})

export const getTotalVotesPerQuestion = (proposal: IParsedProposal, questionIndex: number) =>
  proposal.voteResults[questionIndex]?.reduce((acc, curr) => acc + curr, 0n) || 0n

export const getCountProgress = (totalCount: number, count: number) =>
  totalCount > 0 ? (count / totalCount) * 100 : 0

export const prepareVotingWhitelistData = (config: {
  maxAge?: number | null
  minAge?: number | null
  nationalities: INationality[]
  sex: (typeof SEX_OPTIONS)[number]
  startTimestamp: number
}) => {
  const { minAge, maxAge, startTimestamp, nationalities, sex: _sex } = config
  const formattedNationalities = nationalities
    .flatMap(({ codes }) => codes)
    .map(code => stringToHex(code))

  const identityCreationTimestampUpperBound = time(startTimestamp).subtract(1, 'hour').timestamp
  const identityCounterUpperBound = 1

  const birthDateUpperbound = stringToHex(
    time()
      .subtract(minAge ? minAge : 1, minAge ? 'years' : 'day')
      .format('YYMMDD'),
  )
  const birthDateLowerbound = stringToHex(time().format('YYMMDD'))

  const expirationDateLowerBound = stringToHex(time(startTimestamp).format('YYMMDD'))
  const hasSpecificSex = _sex !== 'any'
  // "male" | "female" -> "M" | "F"
  const sex = hasSpecificSex ? hexlify(_sex[0].toUpperCase()) : 0

  // Uniqueness and passport expiration should be configured for each poll
  const selector = calculateProposalSelector({
    expiration: true,
    nationalities: formattedNationalities.length > 0,
    uniqueness: true,
    minAge: Boolean(minAge),
    maxAge: Boolean(maxAge),
    sex: hasSpecificSex,
  })

  const params = [
    selector,
    formattedNationalities,
    identityCreationTimestampUpperBound,
    identityCounterUpperBound,
    sex,
    birthDateLowerbound,
    birthDateUpperbound,
    expirationDateLowerBound,
  ]

  const abiCoder = AbiCoder.defaultAbiCoder()

  return abiCoder.encode(
    ['tuple(uint256,uint256[],uint256,uint256,uint256,uint256,uint256,uint256)'],
    [params],
  )
}
