import { PollDraftSchema } from '@/db/schemas'

import { CreatePollSchema } from '../createPollSchema'
import { isBoolean } from 'lodash'

export const toPollDraft = (form: CreatePollSchema, id?: number): PollDraftSchema => {
  const {
    details: { image, title, description, startDate, endDate },
    criteria: { nationalities, sex, maxAge, minAge },
    questions,
    isRankingBased,
  } = form

  return {
    image,
    title,
    description,
    startDate,
    endDate,
    minAge,
    maxAge,
    questions,
    nationalities,
    sex,
    isRankingBased,

    ...(id && { id }),
  }
}

export const toPartialPollDraft = (
  form: Partial<CreatePollSchema>,
  id?: number,
): Partial<PollDraftSchema> => ({
  ...(isBoolean(form.isRankingBased) && { isRankingBased: form.isRankingBased }),
  ...(id !== undefined && { id }),

  ...(form.details ?? {}),
  ...(form.criteria ?? {}),

  ...(form.questions && { questions: form.questions }),
})

export const fromPollDraft = (pollDraft: PollDraftSchema): Partial<CreatePollSchema> => {
  const {
    image,
    title,
    description,
    startDate,
    endDate,
    nationalities,
    minAge,
    maxAge,
    sex,
    questions,
    isRankingBased,
  } = pollDraft
  return {
    details: { image, title, description, startDate, endDate },
    criteria: { nationalities, minAge, maxAge, sex },
    questions,
    isRankingBased,
  }
}
