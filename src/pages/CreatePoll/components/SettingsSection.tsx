import {
  Box,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { formatUnits } from 'ethers'
import { debounce } from 'lodash'
import { memo, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useVoteParamsContext } from '@/contexts/vote-params/VoteParamsContext'
import { useWeb3Context } from '@/contexts/web3-context'
import { Icons } from '@/enums'
import { UiCheckVoteInput, UiIcon } from '@/ui'
import UiCheckAmountInput from '@/ui/UiCheckAmountInput'

import { CreatePollSchema } from '../createPollSchema'

export default function SettingsSection() {
  const {
    control,
    getValues,
    formState: { isSubmitting },
    setValue,
    clearErrors,
  } = useFormContext<CreatePollSchema>()
  const { palette, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const { balance } = useWeb3Context()
  const { t } = useTranslation()
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

    const formattedAmount = Number(formatUnits(votesAmount, 18)).toFixed(4)
    setValue('settings.amount', parseFloat(formattedAmount))

    setTimeout(() => {
      clearErrors('settings')
    }, 0)
  }, [votesCount, setValue, votesAmount, clearErrors])

  return (
    <Stack component={Paper}>
      <Stack spacing={10}>
        <ShowPollResultWithMemo />

        <Stack spacing={4}>
          <Typography variant='subtitle5'>{t('create-poll.budget-title')}</Typography>
          <Stack
            bgcolor={palette.info.lighter}
            color={palette.info.darker}
            borderRadius={4}
            p={3}
            maxWidth={{ md: 620 }}
            spacing={3}
            direction='row'
            alignItems='center'
            role='alert'
          >
            {isMdUp && <UiIcon sx={{ ml: 1 }} size={5} name={Icons.InformationLine} />}
            <Typography
              color={palette.info.darker}
              variant='body4'
              typography={{ xs: 'body5', md: 'body4' }}
              alignSelf='start'
            >
              {t('create-poll.fee-alert')}
            </Typography>
          </Stack>
          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gridAutoFlow: 'row',
            }}
            bgcolor={palette.action.active}
            p={4}
            borderRadius={5}
          >
            <Controller
              name='settings.amount'
              control={control}
              render={({ field, fieldState }) => (
                <UiCheckAmountInput
                  {...field}
                  disabled={isSubmitting || isCalculating}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  maxValue={balance}
                  onChange={e => {
                    field.onChange(e)
                    debouncedCheckAmount()
                  }}
                />
              )}
            />
            <Stack
              alignItems='center'
              justifyContent='center'
              sx={{
                position: 'absolute',
                color: palette.text.secondary,
                background: palette.background.paper,
                p: 4,
                borderRadius: '100%',
                width: 42,
                height: 42,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: `2px solid ${palette.action.active}`,
              }}
            >
              <UiIcon size={5} name={Icons.EqualLine} />
            </Stack>
            <Controller
              name='settings.votesCount'
              control={control}
              render={({ field, fieldState }) => (
                <UiCheckVoteInput
                  {...field}
                  disabled={isSubmitting || isCalculating}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  onChange={e => {
                    field.onChange(e)
                    debouncedCheckVotesCount()
                  }}
                />
              )}
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  )
}

enum ShowResultOptions {
  Realtime,
  Afterend,
}

function ShowPollResult() {
  const { t } = useTranslation()
  const options = [
    {
      title: t('create-poll.show-poll-option-title-1'),
      description: t('create-poll.show-poll-option-description-1'),
      value: ShowResultOptions.Realtime,
    },
    {
      title: t('create-poll.show-poll-option-title-2'),
      description: t('create-poll.show-poll-option-description-2'),
      value: ShowResultOptions.Afterend,
      isDisabled: true,
    },
  ]
  return (
    <Stack spacing={4}>
      <Typography variant='subtitle5'>{t('create-poll.show-poll-title')}</Typography>
      <RadioGroup defaultValue={ShowResultOptions.Realtime}>
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
