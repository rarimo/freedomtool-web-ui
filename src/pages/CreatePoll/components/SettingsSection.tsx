import { Paper, Stack } from '@mui/material'
import { t } from 'i18next'
import { Controller, useFormContext } from 'react-hook-form'

import { useCheckVoteAmount } from '@/hooks'
import { UiCheckVoteInput } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'

export default function SettingsSection() {
  const { isCalculating, helperText, resetHelperText, getVoteAmountDetails } = useCheckVoteAmount()
  const {
    control,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()

  return (
    <Stack component={Paper}>
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
            onCheck={() => getVoteAmountDetails(String(getValues('settings.votesCount')))}
            onChange={e => {
              field.onChange(e)
              resetHelperText?.()
            }}
          />
        )}
      />
    </Stack>
  )
}
