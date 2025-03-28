import { time } from '@distributedlab/tools'
import { Paper, Stack, TextField } from '@mui/material'
import { t } from 'i18next'
import { Controller, useFormContext } from 'react-hook-form'

import UiDatePicker from '@/common/UiDatePicker'

import { CreatePollSchema } from '../createPollSchema'

const minDate = time().utc()

export default function DetailsSection() {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()
  return (
    <Stack component={Paper} spacing={6}>
      <Controller
        name='title'
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            disabled={isSubmitting}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            placeholder={t('create-poll.proposal-title-plh')}
            label={t('create-poll.proposal-title-lbl')}
          />
        )}
      />
      <Controller
        name='description'
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            multiline
            rows={3}
            disabled={isSubmitting}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            label={t('create-poll.proposal-description-lbl')}
            placeholder={t('create-poll.proposal-description-plh')}
            sx={{
              background: 'transparent',
              '& .MuiInputBase-root': {
                height: 'unset',
              },
            }}
          />
        )}
      />
      <Stack direction={{ md: 'row' }} justifyContent='space-between' gap={5}>
        <Controller
          name='startDate'
          control={control}
          render={({ field, fieldState }) => (
            <UiDatePicker
              {...field}
              hasTime
              minDate={minDate}
              disabled={isSubmitting}
              errorMessage={fieldState.error?.message}
              label={t('create-poll.start-date-lbl')}
              slotProps={{
                textField: {
                  placeholder: t('create-poll.start-date-plh'),
                },
              }}
            />
          )}
        />
        <Controller
          name='endDate'
          control={control}
          render={({ field, fieldState }) => (
            <UiDatePicker
              {...field}
              hasTime
              minDate={minDate}
              disabled={isSubmitting}
              errorMessage={fieldState.error?.message}
              label={t('create-poll.end-date-lbl')}
              slotProps={{
                textField: {
                  placeholder: t('create-poll.end-date-plh'),
                },
              }}
            />
          )}
        />
      </Stack>
    </Stack>
  )
}
