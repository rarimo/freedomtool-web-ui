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
  startDate: string
  endDate: string
  questions: IQuestion[]
}
