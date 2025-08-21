import { Nationality, Sex } from '@/types'

export interface PollDraftSchema {
  id?: number

  image?: File | null
  title: string
  description: string
  startDate: string
  endDate: string
  isRankingBased: boolean

  sex: Sex
  minAge?: number | ''
  maxAge?: number | ''
  nationalities: Nationality[]

  questions: Question[]
}

interface Question {
  id: string
  text: string
  options: Option[]
}

interface Option {
  id: string
  text: string
}
