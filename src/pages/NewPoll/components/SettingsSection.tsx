import { Box, Radio, RadioGroup, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { memo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DotsLoader } from '@/common'
import { useWeb3Context } from '@/contexts/web3-context'
import { Icons } from '@/enums'
import { useProposalBalanceForm } from '@/hooks/proposal-balance-form'
import { UiCheckVoteInput, UiIcon } from '@/ui'
import UiCheckAmountInput from '@/ui/UiCheckAmountInput'

import { CreatePollSchema } from '../createPollSchema'

export default function SettingsSection() {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()
  const { palette, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const { balance } = useWeb3Context()
  const { t } = useTranslation()

  const { getValues, getFieldState, setValue, clearErrors } = useFormContext<CreatePollSchema>()

  const { isCalculating, updateFromAmount, updateFromVotes } = useProposalBalanceForm<
    CreatePollSchema,
    'settings.amount',
    'settings.votesCount'
  >(
    {
      getValues,
      getFieldState,
      setValue,
      clearErrors,
    },
    'settings.amount',
    'settings.votesCount',
  )

  return (
    <Stack>
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
              gridTemplateColumns: { md: '1fr 1fr' },
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
                  endAdornmentSx={{
                    bottom: 0,
                    top: 'unset',
                    right: 20,
                  }}
                  onChange={e => {
                    field.onChange(e)
                    updateFromAmount()
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
              {isCalculating ? <DotsLoader size={1} /> : <UiIcon size={5} name={Icons.EqualLine} />}
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
                    updateFromVotes()
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
      <Typography variant='subtitle5'>{t('create-poll.show-results-title')}</Typography>
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
