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

export interface ICreateVote {
  title: string
  description: string
  startDate: string
  endDate: string
  questions: IQuestion[]
  uniqueness: boolean
  minAge?: number
  nationalities: INationality[]
  votesCount: number
}

export interface IQuestionIpfs {
  title: string
  variants: string[]
}

export interface IVoteIpfs {
  title: string
  description: string
  acceptedOptions: IQuestionIpfs[]
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
