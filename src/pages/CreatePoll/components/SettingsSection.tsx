import { Paper, Radio, RadioGroup, Stack, Typography, useTheme } from '@mui/material'
import { formatUnits } from 'ethers'
import { debounce } from 'lodash'
import { memo, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NATIVE_CURRENCY } from '@/constants'
import { useVoteParamsContext } from '@/contexts/vote-params/VoteParamsContext'
import { formatBalance } from '@/helpers'
import { UiCheckVoteInput } from '@/ui'
import UiCheckAmountInput from '@/ui/UiCheckAmountInput'

import { CreatePollSchema } from '../createPollSchema'

export default function SettingsSection() {
  const { t } = useTranslation()
  const {
    control,
    getValues,
    formState: { isSubmitting },
    setValue,
    clearErrors,
  } = useFormContext<CreatePollSchema>()
  const { updateVoteParams, isCalculating, votesAmount, votesCount } = useVoteParamsContext()

  /*
   * Base function for "settings" fields that updates both fields and its mirrored counterpart
   * (votesAmount and votesCount) if the input field is valid.
   *
   * The generic types <T, M> ensure type safety because
   * React Hook Form does not accept plain strings
   * for field names in this case.
   */
  const debouncedCheckField = debounce(
    <T extends keyof CreatePollSchema['settings'], M extends keyof CreatePollSchema['settings']>(
      field: `settings.${T}`,
      mirrorField: `settings.${M}`,
      updateFn: () => void,
    ) => {
      const isValid = !control._formState.errors.settings?.[field.split('.')[1] as T]

      // Clear the mirror field error for better UX
      if (!isValid) return

      clearErrors(mirrorField)

      updateFn()
    },
    500,
  )

  const debouncedCheckVotesCount = () =>
    debouncedCheckField('settings.votesCount', 'settings.amount', () =>
      updateVoteParams({
        type: 'vote_predict_amount',
        votesCount: String(getValues('settings.votesCount')),
      }),
    )

  const debouncedCheckAmount = () =>
    debouncedCheckField('settings.amount', 'settings.votesCount', () =>
      updateVoteParams({
        type: 'vote_predict_count_tx',
        amount: String(getValues('settings.amount')),
      }),
    )

  useEffect(() => {
    setValue('settings.votesCount', Number(votesCount))
  }, [votesAmount, setValue, votesCount])

  useEffect(() => {
    setValue('settings.amount', Number(formatUnits(votesAmount)))
  }, [votesCount, setValue, votesAmount])

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
              // TODO: Remove
              helperText={
                fieldState.error?.message || `${formatBalance(votesAmount)} ${NATIVE_CURRENCY}`
              }
              label={t('create-poll.votes-count-lbl')}
              onChange={e => {
                field.onChange(e)
                debouncedCheckVotesCount()
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
              // TODO: Remove
              helperText={fieldState.error?.message || `${votesCount} votes`}
              label={t('create-poll.amount-lbl')}
              onChange={e => {
                field.onChange(e)
                debouncedCheckAmount()
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
