import { time } from '@distributedlab/tools'
import { AbiCoder } from 'ethers'
import { stringToHex } from 'viem'

import { api } from '@/api/clients'
import { MAX_UINT32 } from '@/constants'
import { ApiServicePaths } from '@/enums'
import { CreatePollSchema } from '@/pages/CreatePoll/createPollSchema'
import { INationality, IParsedProposal, IUploadData, IVoteIpfs } from '@/types'
import { ProposalsState } from '@/types/contracts/ProposalState'

export const prepareAcceptedOptionsToIpfs = (questions: CreatePollSchema['questions']) =>
  questions.map(question => ({
    title: question.text,
    variants: question.options.map(option => option.text),
  }))

// The array [3, 7] indicates that there are
// [0b11, 0b111] -> 2 and 3 choices per options correspondingly available.
export const prepareAcceptedOptionsToContract = (questions: CreatePollSchema['questions']) => {
  return questions.map(question => {
    const optionsCount = question.options.length
    const bitMask = (1 << optionsCount) - 1
    return bitMask
  })
}

export const uploadToIpfs = (vote: IVoteIpfs) => {
  return api.post<IUploadData>(`${ApiServicePaths.Ipfs}/v1/public/upload`, {
    body: {
      data: {
        type: 'upload_json',
        attributes: {
          metadata: vote,
        },
      },
    },
  })
}

export const getVotesCount = (id: string) => {
  return api.get<{ vote_count: number }>(
    `${ApiServicePaths.ProofVerificationRelayer}/v2/count-remaining-votes/${id}`,
  )
}

/**
 * Predicts the token amount based on the number of votes.
 * @param params - Object containing vote count and optional proposal ID.
 * @returns An object with the predicted token amount.
 */
export async function predictVoteParams(params: {
  type: 'vote_predict_amount'
  votesCount: string
  proposalId?: number
}): Promise<{ amount_predict: string }>

/**
 * Predicts the number of votes based on the token amount.
 * @param params - Object containing the token amount and optional proposal ID.
 * @returns An object with the predicted vote count.
 */
export async function predictVoteParams(params: {
  type: 'vote_predict_count_tx'
  amount: string
  proposalId?: number
}): Promise<{ count_tx_predict: string }>

// Implementation
export async function predictVoteParams(
  params:
    | { type: 'vote_predict_amount'; votesCount: string; proposalId?: number }
    | { type: 'vote_predict_count_tx'; amount: string; proposalId?: number },
) {
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
  minAge?: number | null
  nationalities: INationality[]
  uniqueness: boolean
  startTimestamp: number
}) => {
  const { minAge, startTimestamp, nationalities, uniqueness } = config

  const formattedNationalities = nationalities
    .flatMap(({ codes }) => codes)
    .map(code => stringToHex(code))

  const identityCreationTimestampUpperBound = time(startTimestamp).subtract(1, 'hour').timestamp
  const uniquenessFlag = uniqueness ? 1 : MAX_UINT32

  const birthDateUpperbound = stringToHex(
    time()
      .subtract(minAge ? minAge : 1, minAge ? 'years' : 'day')
      .format('YYMMDD'),
  )

  const expirationDateLowerBound = stringToHex(time(startTimestamp).format('YYMMDD'))

  const params = [
    formattedNationalities,
    identityCreationTimestampUpperBound,
    uniquenessFlag,
    birthDateUpperbound,
    expirationDateLowerBound,
  ]

  const abiCoder = AbiCoder.defaultAbiCoder()

  return abiCoder.encode(['tuple(uint256[],uint256,uint256,uint256,uint256)'], [params])
}
