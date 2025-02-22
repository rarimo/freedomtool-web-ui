import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { ErrorHandler } from '@/helpers'
import { UseCheckVoteAmount } from '@/hooks'
import { UiCheckVoteInput } from '@/ui'

interface ITopUpForm {
  votesCount: number
}

interface ITopUpFormProps extends Partial<UseCheckVoteAmount> {
  onSubmit: () => Promise<void>
}

const defaultValues = { votesCount: 0 }

export default function TopUpForm(props: ITopUpFormProps) {
  const { t } = useTranslation()
  const { checkVoteAmount, isCalculating, onSubmit } = props

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
    const isVoteAmountValid = await checkVoteAmount?.(getValues('votesCount'))
    if (!isVoteAmountValid) return

    try {
      onSubmit?.()
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      reset()
    }
  }, [checkVoteAmount, getValues, onSubmit, reset])

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
            helperText={fieldState.error?.message}
            label={t('create-vote.form.votes-count-lbl')}
            onCheck={() => checkVoteAmount?.(getValues('votesCount'))}
          />
        )}
      />
      <Button disabled={isSubmitting} type='submit'>
        {t('vote.top-up-button')}
      </Button>
    </Stack>
  )
}
