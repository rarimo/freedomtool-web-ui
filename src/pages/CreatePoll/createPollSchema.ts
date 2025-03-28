import { time } from '@distributedlab/tools'
import { t } from 'i18next'
import { z as zod } from 'zod'

import { MAX_VOTE_COUNT_PER_TX } from '@/constants'

export const createPollSchema = zod
  .object({
    title: zod.string().min(1).max(50),
    description: zod.string().min(1).max(200),
    votesCount: zod.coerce.number().int().min(1).max(MAX_VOTE_COUNT_PER_TX),
    startDate: zod.string().min(1),
    endDate: zod.string().min(1),
    uniqueness: zod.boolean(),
    minAge: zod.coerce.number().min(1).max(99).or(zod.literal('')).optional().nullable(),
    nationalities: zod.array(
      zod.object({
        flag: zod.string().min(1),
        name: zod.string().min(1),
        codes: zod.array(zod.string().min(1)).min(1),
      }),
    ),
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
  })
  .refine(data => time(data.endDate).timestamp > time(data.startDate).timestamp, {
    message: t('create-poll.end-date-error'),
    path: ['endDate'],
  })

export type CreatePollSchema = zod.infer<typeof createPollSchema>
