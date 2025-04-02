import { ProposalStatus } from '@/enums/proposals'
import { ProposalsState } from '@/types/contracts/ProposalState'

export interface IOption {
  id: string
  text: string
}

export interface IQuestion {
  id: string
  text: string
  options: IOption[]
}

export interface IQuestionIpfs {
  title: string
  variants: string[]
}

export interface IVoteIpfs {
  title: string
  description: string
  acceptedOptions: IQuestionIpfs[]
  imageCid?: string
}

export interface IUploadData {
  id: string
  type: string
  hash: string
}

export interface IProposalWithId {
  id: number
  proposal: ProposalsState.ProposalInfoStructOutput
}

export interface IParsedProposal {
  cid: string
  status: ProposalStatus
  startTimestamp: number
  duration: number
  voteResults: bigint[][]
}

export interface INationality {
  name: string
  codes: string[]
  flag: string
}

export enum Sex {
  Male = 'M',
  Female = 'F',
  Any = '',
}

export type VoteAmountOverload = {
  type: 'vote_predict_amount'
  votesCount: string
  proposalId?: string
}
export type VoteCountOverload = {
  type: 'vote_predict_count_tx'
  amount: string
  proposalId?: string
}
export type VoteParamsInput = VoteAmountOverload | VoteCountOverload
