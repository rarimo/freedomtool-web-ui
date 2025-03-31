import { time } from '@distributedlab/tools'
import { t } from 'i18next'
import { v4 as uuidv4 } from 'uuid'
import { z as zod } from 'zod'

import { MAX_TOKEN_AMOUNT_PER_TX, MAX_VOTE_COUNT_PER_TX } from '@/constants'
import { SEX_OPTIONS } from '@/types'

export const defaultValues = {
  criterias: {
    uniqueness: false,
    nationalities: [],
    sex: SEX_OPTIONS[2],
  },
  questions: [
    {
      id: uuidv4(),
      options: [{ id: uuidv4() }, { id: uuidv4() }],
    },
  ],
}

export const createPollSchema = zod
  .object({
    details: zod.object({
      title: zod.string().min(1).max(50),
      description: zod.string().min(1).max(200),
      startDate: zod.string().min(1),
      endDate: zod.string().min(1),
    }),
    criterias: zod.object({
      uniqueness: zod.boolean(),
      sex: zod.enum(SEX_OPTIONS),
      minAge: zod.coerce.number().min(1).max(99).or(zod.literal('')).optional().nullable(),
      maxAge: zod.coerce.number().min(1).max(99).or(zod.literal('')).optional().nullable(),
      nationalities: zod.array(
        zod.object({
          flag: zod.string().min(1),
          name: zod.string().min(1),
          codes: zod.array(zod.string().min(1)).min(1),
        }),
      ),
    }),
    questions: zod
      .array(
        zod.object({
          id: zod.string().uuid(),
          text: zod.string().min(5).max(40),
          options: zod
            .array(
              zod.object({
                id: zod.string().uuid(),
                text: zod.string().min(2).max(25),
              }),
            )
            .min(2),
        }),
      )
      .min(1),
    settings: zod.object({
      votesCount: zod.coerce.number().int().min(1).max(MAX_VOTE_COUNT_PER_TX),
      amount: zod.coerce.number().gt(0).max(MAX_TOKEN_AMOUNT_PER_TX),
    }),
  })
  .refine(
    ({ details: { endDate, startDate } }) => time(endDate).timestamp > time(startDate).timestamp,
    {
      message: t('create-poll.end-date-error'),
      path: ['details', 'endDate'],
    },
  )
  .refine(({ criterias: { maxAge, minAge } }) => (maxAge && minAge ? maxAge >= minAge : true), {
    message: t('create-poll.max-age-error'),
    path: ['criterias', 'maxAge'],
  })

export type CreatePollSchema = zod.infer<typeof createPollSchema>
