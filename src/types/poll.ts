import { ProposalStatus } from '@/enums/proposals'
import { ProposalsState } from '@/types/contracts/ProposalState'

export interface CreatePollOption {
  id: string
  text: string
}

export interface CreatePollQuestion {
  id: string
  text: string
  options: CreatePollOption[]
}

export interface QuestionIpfs {
  title: string
  variants: string[]
}

export interface UploadedDataIpfs {
  id: string
  type: string
  hash: string
}

export interface ParsedProposal {
  cid: string
  status: ProposalStatus
  startTimestamp: number
  duration: number
  voteResults: number[][]
  votingWhitelistData: DecodedWhitelistData
  rawProposal: ProposalsState.ProposalInfoStructOutput
}

export interface Nationality {
  name: string
  codes: string[]
  flag: string
}

export enum Sex {
  Male = 'M',
  Female = 'F',
  Any = '',
}

// New types
export interface Proposal {
  type: 'proposals'
  metadata: ProposalMetadata
  id: string
  owner: string
  status: PollStatus
  total_balance: string
  remaining_balance: string
  start_timestamp: number
  end_timestamp: number
  votes_count: number
  remaining_votes_count: number
}

export enum PollStatus {
  Waiting = 'waiting',
  Started = 'started',
  Ended = 'ended',
}

export interface ProposalMetadata {
  title: string
  description: string
  imageCid?: string
  acceptedOptions: QuestionIpfs[]
}

export interface DecodedWhitelistData {
  selector: bigint
  nationalities: string[]
  identityCreationTimestampUpperBound: number
  identityCounterUpperBound: number
  sex: Sex
  birthDateLowerbound: string
  birthDateUpperbound: string
  expirationDateLowerBound: string
}
