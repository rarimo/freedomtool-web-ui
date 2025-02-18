import { api } from '@/api/clients'
import { ApiServicePaths } from '@/enums'

import { ICreateVote, IUploadData, IVoteIpfs } from './types'

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
