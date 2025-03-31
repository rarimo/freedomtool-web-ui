import { Paper, Radio, RadioGroup, Stack, Typography, useTheme } from '@mui/material'
import { memo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useCheckVoteAmount } from '@/hooks'
import { UiCheckVoteInput } from '@/ui'
import UiCheckAmountInput from '@/ui/UiCheckAmountInput'

import { CreatePollSchema } from '../createPollSchema'

export default function SettingsSection() {
  const { t } = useTranslation()
  const { isCalculating, helperText, resetHelperText, getVoteParams } = useCheckVoteAmount()
  const {
    control,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()

  return (
    <Stack component={Paper}>
      <Stack spacing={10}>
        <ShowPollResultWithMemo />

        <Controller
          name='settings.votesCount'
          control={control}
          render={({ field, fieldState }) => (
            <UiCheckVoteInput
              {...field}
              disabled={isSubmitting || isCalculating}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message || helperText}
              label={t('create-poll.votes-count-lbl')}
              onCheck={() =>
                getVoteParams({
                  type: 'vote_predict_amount',
                  votesCount: String(getValues('settings.votesCount')),
                })
              }
              onChange={e => {
                field.onChange(e)
                resetHelperText?.()
              }}
            />
          )}
        />

        <Controller
          name='settings.amount'
          control={control}
          render={({ field, fieldState }) => (
            <UiCheckAmountInput
              {...field}
              disabled={isSubmitting || isCalculating}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message || helperText}
              label={t('create-poll.amount-lbl')}
              onCheck={() =>
                getVoteParams({
                  type: 'vote_predict_count_tx',
                  amount: String(getValues('settings.amount')),
                })
              }
              onChange={e => {
                field.onChange(e)
                resetHelperText?.()
              }}
            />
          )}
        />
      </Stack>
    </Stack>
  )
}

enum ShowResultOptions {
  REALTIME,
  AFTEREND,
}

function ShowPollResult() {
  const { t } = useTranslation()
  const options = [
    {
      title: t('create-poll.show-poll-option-title-1'),
      description: t('create-poll.show-poll-option-description-1'),
      value: ShowResultOptions.REALTIME,
    },
    {
      title: t('create-poll.show-poll-option-title-2'),
      description: t('create-poll.show-poll-option-description-2'),
      value: ShowResultOptions.AFTEREND,
      isDisabled: true,
    },
  ]
  return (
    <Stack spacing={4}>
      <Typography variant='subtitle5'>{t('create-poll.show-poll-title')}</Typography>
      <RadioGroup defaultValue={ShowResultOptions.REALTIME}>
        <Stack spacing={2}>
          {options.map(option => (
            <ShowPollOption {...option} key={option.value} />
          ))}
        </Stack>
      </RadioGroup>
    </Stack>
  )
}

const ShowPollResultWithMemo = memo(ShowPollResult)

function ShowPollOption({
  title,
  description,
  value,
  isDisabled,
}: {
  title: string
  description: string
  value: ShowResultOptions
  isDisabled?: boolean
}) {
  const { palette } = useTheme()
  return (
    <Stack
      bgcolor={palette.action.active}
      direction='row'
      alignItems='center'
      spacing={2.5}
      p={5}
      pl={3}
      borderRadius={4}
    >
      <Radio
        disabled={isDisabled}
        color='default'
        sx={{ color: palette.text.primary }}
        value={value}
      />
      <Stack sx={{ opacity: isDisabled ? 0.5 : 1 }} spacing={1}>
        <Typography variant='buttonLarge'>{title}</Typography>
        <Typography variant='body4'>{description}</Typography>
      </Stack>
    </Stack>
  )
}
