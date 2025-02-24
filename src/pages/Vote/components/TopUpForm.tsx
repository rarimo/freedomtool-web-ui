import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'

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
  const { isCalculating, helperText, resetHelperText, getVoteAmountDetails } = useCheckVoteAmount()

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
    resolver: yupResolver<ITopUpForm>(
      Yup.object({
        votesCount: Yup.number().required().min(1).max(1_000_000),
      }),
    ),
  })

  const submit = useCallback(async () => {
    try {
      const votesCount = getValues('votesCount')
      const { isEnoughBalance, votesAmount } = await getVoteAmountDetails(votesCount)
      if (!isEnoughBalance || !id) return

      await addFundsToProposal(id, votesAmount)
      bus.emit(BusEvents.success, { message: t('vote.form.success-msg') })
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      reset()
      resetHelperText?.()
    }
  }, [addFundsToProposal, getValues, getVoteAmountDetails, id, reset, resetHelperText, t])

  const isDisabled = isSubmitting || isCalculating

  return (
    <Stack spacing={4} component='form' onSubmit={handleSubmit(submit)}>
      <Controller
        name='votesCount'
        control={control}
        render={({ field, fieldState }) => (
          <UiCheckVoteInput
            {...field}
            disabled={field.disabled || isDisabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message || helperText}
            label={t('create-vote.votes-count-lbl')}
            onCheck={() => getVoteAmountDetails(getValues('votesCount'))}
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
