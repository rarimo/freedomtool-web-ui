import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { t } from 'i18next'
import { Controller, useFormContext } from 'react-hook-form'

import nationalities from '@/locales/resources/countries_en.json'
import { INationality } from '@/types'
import { UiNumberField } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'

nationalities satisfies INationality[]

export default function CriteriasSection() {
  const { palette } = useTheme()
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()

  return (
    <Stack>
      <Stack component={Paper}>
        <Stack spacing={5}>
          <Stack
            alignItems='center'
            justifyContent='space-between'
            direction='row'
            spacing={6}
            divider={
              <Typography variant='body4' color={palette.text.secondary}>
                –
              </Typography>
            }
          >
            <Controller
              name='criterias.minAge'
              control={control}
              render={({ field, fieldState }) => (
                <UiNumberField
                  {...field}
                  sx={{ flex: 1 }}
                  disabled={isSubmitting}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={t('create-poll.min-age-lbl')}
                />
              )}
            />

            <Controller
              name='criterias.maxAge'
              control={control}
              render={({ field, fieldState }) => (
                <UiNumberField
                  {...field}
                  sx={{ flex: 1 }}
                  disabled={isSubmitting}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={t('create-poll.max-age-lbl')}
                />
              )}
            />
          </Stack>

          <Controller
            name='criterias.nationalities'
            control={control}
            render={({ field, fieldState }) => (
              <FormControl {...field} error={Boolean(fieldState.error)}>
                <Autocomplete
                  multiple
                  limitTags={2}
                  disableCloseOnSelect
                  disabled={field.disabled || isSubmitting}
                  sx={{ maxWidth: 572 }}
                  options={nationalities}
                  getOptionLabel={({ name, flag }) => `${flag} ${name}`}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={Boolean(fieldState.error)}
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          '&.MuiInputBase-root:not(.MuiInputBase-multiline)': {
                            maxHeight: 'unset',
                            height: 'unset',
                          },
                        },
                      }}
                      InputLabelProps={{
                        ...params.InputLabelProps,
                        shrink: true,
                      }}
                      label={t('create-poll.nationalities-lbl')}
                    />
                  )}
                  renderOption={({ key, ...props }, { flag, name }) => {
                    return (
                      <Stack
                        alignItems='center'
                        justifyContent='center'
                        component='li'
                        direction='row'
                        spacing={2}
                        key={key}
                        {...props}
                      >
                        <Typography>{flag}</Typography>
                        <Typography>{name}</Typography>
                      </Stack>
                    )
                  }}
                  onChange={(_, value) => field.onChange(value)}
                />

                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name='criterias.uniqueness'
            control={control}
            render={({ field, fieldState }) => (
              <FormControl {...field} error={Boolean(fieldState.error)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: palette.text.secondary,
                        '&.Mui-checked': {
                          color: palette.text.secondary,
                        },
                      }}
                      disabled={field.disabled || isSubmitting}
                    />
                  }
                  label={
                    <Typography variant='caption2' color={palette.text.secondary}>
                      {t('create-poll.uniqueness-lbl')}
                    </Typography>
                  }
                />
              </FormControl>
            )}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
