import { time } from '@distributedlab/tools'
import { Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { t } from 'i18next'
import { Controller, useFormContext } from 'react-hook-form'

import { ImagePickerWithCrop } from '@/common'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'
import UiDatePicker from '@/ui/UiDatePicker'

import { CreatePollSchema } from '../createPollSchema'

const minDate = time().utc()

export default function DetailsSection() {
  const { palette, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()

  return (
    <Stack gap={{ xs: 4, md: 6 }}>
      <Controller
        name='details.image'
        control={control}
        render={({ field, fieldState }) => (
          <ImagePickerWithCrop
            ref={field.ref}
            title={t('create-poll.image-title')}
            description={t('create-poll.image-description')}
            sx={{ width: 'fit-content' }}
            labelProps={{
              width: 48,
              height: 48,
            }}
            value={field.value}
            disabled={field.disabled}
            errorMessage={fieldState.error?.message}
            onUpdate={image => {
              field.onChange(image)
            }}
            onDelete={() => {
              field.onChange(null)
            }}
          >
            <UiIcon color={palette.text.primary} name={Icons.UploadCloudLine} />
          </ImagePickerWithCrop>
        )}
      />

      <Controller
        name='details.title'
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

      <Stack
        direction={{ md: 'row' }}
        justifyContent='space-between'
        alignItems='flex-start'
        width='100%'
        gap={{ xs: 4, md: 6 }}
        divider={
          isMdUp ? (
            <Stack height={56} alignItems='center' justifyContent='center'>
              <Typography variant='body4' color={palette.text.secondary}>
                –
              </Typography>
            </Stack>
          ) : null
        }
      >
        <Controller
          name='details.startDate'
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
          name='details.endDate'
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

      <Controller
        name='details.description'
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
    </Stack>
  )
}
