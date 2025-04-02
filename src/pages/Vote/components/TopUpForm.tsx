import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack } from '@mui/material'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { z as zod } from 'zod'

import { MAX_PARTICIPANTS_PER_POLL } from '@/constants'
import { BusEvents } from '@/enums'
import { bus, ErrorHandler } from '@/helpers'
import { useCheckVoteAmount, useProposalState } from '@/hooks'
import { UiCheckVoteInput } from '@/ui'

interface ITopUpForm {
  votesCount: number
}

const defaultValues = { votesCount: 0 }

export default function TopUpForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { isCalculating, helperText, resetHelperText, updateVoteParams } = useCheckVoteAmount()

  const { addFundsToProposal } = useProposalState({ shouldFetchProposals: false })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    reset,
  } = useForm<ITopUpForm>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(
      zod.object({
        votesCount: zod.coerce.number().int().min(1).max(MAX_PARTICIPANTS_PER_POLL),
      }),
    ),
  })

  const submit = useCallback(async () => {
    try {
      const votesCount = String(getValues('votesCount'))
      const { isEnoughBalance, votesAmount } = await updateVoteParams({
        type: 'vote_predict_amount',
        votesCount,
        proposalId: String(id),
      })
      if (!isEnoughBalance || !id) return

      await addFundsToProposal(id, votesAmount)
      bus.emit(BusEvents.success, { message: t('vote.form.success-msg') })
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      reset()
      resetHelperText?.()
    }
  }, [addFundsToProposal, getValues, updateVoteParams, id, reset, resetHelperText, t])

  const isDisabled = isSubmitting || isCalculating

  return (
    <Stack spacing={4} component='form' width={300} onSubmit={handleSubmit(submit)}>
      <Controller
        name='votesCount'
        control={control}
        render={({ field, fieldState }) => (
          <UiCheckVoteInput
            {...field}
            disabled={field.disabled || isDisabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message || helperText}
            label={t('create-poll.votes-count-lbl')}
            onChange={e => {
              field.onChange(e)
              resetHelperText?.()
            }}
          />
        )}
      />
      <Button disabled={isSubmitting} type='submit'>
        {t('vote.form.top-up-button')}
      </Button>
    </Stack>
  )
}
