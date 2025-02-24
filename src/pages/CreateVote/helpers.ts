import { api } from '@/api/clients'
import { ApiServicePaths } from '@/enums'
import { ProposalsState } from '@/types/contracts/ProposalState'

import { ICreateVote, IParsedProposal, IUploadData, IVoteIpfs } from './types'

export const prepareAcceptedOptionsToIpfs = (questions: ICreateVote['questions']) =>
  questions.map(question => ({
    title: question.text,
    variants: question.options.map(option => option.text),
  }))

// The array [3, 7] indicates that there are
// [0b11, 0b111] -> 2 and 3 choices per options correspondingly available.
export const prepareAcceptedOptionsToContract = (questions: ICreateVote['questions']) => {
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

export const predictVoteAmount = (votesCount: number, proposalId?: string) => {
  return api.post<{ amount_predict: string }>(
    `${ApiServicePaths.ProofVerificationRelayer}/v2/predict`,
    {
      body: {
        data: {
          type: 'vote_predict_amount',
          attributes: {
            count_tx: votesCount,
            voting_id: proposalId,
            ...(proposalId && { voting_id: proposalId }),
          },
        },
      },
    },
  )
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
