import { formatUnits, parseUnits } from 'ethers'
import { t } from 'i18next'
import { z as zod } from 'zod'

import { MAX_PARTICIPANTS_PER_POLL, POLL_MIN_FUNDING_AMOUNT } from '@/constants'

export const topUpDefaultValues: TopUpSchema = {
  votesCount: 0,
  amount: '0',
}

export const topUpSchema = zod.object({
  votesCount: zod.coerce.number().int().min(1).max(MAX_PARTICIPANTS_PER_POLL),
  amount: zod
    .string()
    .min(1)
    .refine(value => parseUnits(value) > POLL_MIN_FUNDING_AMOUNT, {
      message: t('create-poll.amount-error', {
        minAmount: formatUnits(POLL_MIN_FUNDING_AMOUNT),
      }),
    }),
})

export type TopUpSchema = zod.infer<typeof topUpSchema>
