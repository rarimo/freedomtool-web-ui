import { t } from 'i18next'
import { z as zod } from 'zod'

import { MAX_PARTICIPANTS_PER_POLL, POLL_MIN_FUNDING_NUMBER } from '@/constants'

export const topUpDefaultValues: TopUpSchema = {
  votesCount: 0,
  amount: '0',
}

export const topUpSchema = zod.object({
  votesCount: zod.coerce.number().int().min(1).max(MAX_PARTICIPANTS_PER_POLL),
  amount: zod
    .string()
    .min(1)
    .refine(value => Number(value) > POLL_MIN_FUNDING_NUMBER, {
      message: t('create-poll.amount-error', {
        amount: POLL_MIN_FUNDING_NUMBER,
      }),
    }),
})

export type TopUpSchema = zod.infer<typeof topUpSchema>
