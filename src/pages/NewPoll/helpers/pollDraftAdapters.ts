import { PollDraftSchema } from '@/db/schemas'

import { CreatePollSchema } from '../createPollSchema'

export const toPollDraft = (form: CreatePollSchema, id?: number): PollDraftSchema => {
  const {
    details: { image, title, description, startDate, endDate },
    criteria: { nationalities, sex, maxAge, minAge },
    questions,
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

    ...(id && { id }),
  }
}

export const toPartialPollDraft = (
  form: Partial<CreatePollSchema>,
  id?: number,
): Partial<PollDraftSchema> => ({
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
  } = pollDraft
  return {
    details: { image, title, description, startDate, endDate },
    criteria: { nationalities, minAge, maxAge, sex },
    questions,
  }
}
