import { time } from '@distributedlab/tools'
import { t } from 'i18next'
import { v4 as uuidv4 } from 'uuid'
import { z as zod } from 'zod'

import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_BANNER_SIZE,
  MAX_PARTICIPANTS_PER_POLL,
  POLL_MIN_FUNDING_NUMBER,
} from '@/constants'
import { Sex } from '@/types'

export const createPollDefaultValues: CreatePollSchema = {
  criteria: {
    uniqueness: false,
    nationalities: [],
    sex: Sex.Any,
  },
  questions: [
    {
      id: uuidv4(),
      options: [
        {
          id: uuidv4(),
          text: '',
        },
        {
          id: uuidv4(),
          text: '',
        },
      ],
      text: '',
    },
  ],
  details: {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  },
  settings: {
    votesCount: 0,
    amount: '0',
  },
}

export const createPollSchema = zod
  .object({
    details: zod.object({
      /*
       * Hack to validate image as File and keep its type in project
       * zod.instanceof(File) is not working properly
       */
      image: zod
        .any()
        .refine(
          file => ALLOWED_IMAGE_MIME_TYPES.includes(file?.type),
          t('create-poll.image-format-error'),
        )
        .refine(
          file => {
            return file?.size <= MAX_BANNER_SIZE
          },
          t('create-poll.image-size-error', { size: 5 }),
        )
        .transform(file => {
          if (file instanceof File) {
            return file
          }
        })
        .nullable()
        .optional(),
      title: zod.string().min(1).max(50),
      description: zod.string().min(1).max(200),
      startDate: zod.string().min(1),
      endDate: zod.string().min(1),
    }),
    criteria: zod.object({
      uniqueness: zod.boolean(),
      sex: zod.nativeEnum(Sex),
      minAge: zod.coerce.number().min(1).max(99).int().or(zod.literal('')).optional(),
      maxAge: zod.coerce.number().min(1).max(99).int().or(zod.literal('')).optional(),
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
          text: zod.string().min(5).max(50),
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
      votesCount: zod.coerce.number().int().min(1).max(MAX_PARTICIPANTS_PER_POLL),
      amount: zod
        .string()
        .min(1)
        .refine(value => Number(value) > POLL_MIN_FUNDING_NUMBER, {
          message: t('create-poll.amount-error', { amount: POLL_MIN_FUNDING_NUMBER }),
        }),
    }),
  })
  .refine(
    ({ details: { endDate, startDate } }) => time(endDate).timestamp > time(startDate).timestamp,
    {
      message: t('create-poll.end-date-error'),
      path: ['details', 'endDate'],
    },
  )
  .refine(({ criteria: { maxAge, minAge } }) => (maxAge && minAge ? maxAge >= minAge : true), {
    message: t('create-poll.max-age-error'),
    path: ['criteria', 'maxAge'],
  })

export type CreatePollSchema = zod.infer<typeof createPollSchema>
