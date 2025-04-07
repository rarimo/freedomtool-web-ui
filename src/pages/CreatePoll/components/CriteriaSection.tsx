import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { formatCountry } from '@/helpers'
import countries from '@/locales/resources/countries_en.json'
import { Nationality, Sex } from '@/types'
import { UiIcon, UiNumberField } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'

type CriteriaKey = 'age' | 'nationalities' | 'sex'

interface CriteriaOptions {
  key: CriteriaKey
  label: string
}

export default function CriteriaSection() {
  const { t } = useTranslation()
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()

  const { palette } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedKey, setSelectedKey] = useState<CriteriaKey[]>(['nationalities'])

  const sexOptions = useMemo(
    () => [
      {
        label: t('create-poll.sex-male'),
        value: Sex.Male,
      },
      {
        label: t('create-poll.sex-female'),
        value: Sex.Female,
      },
      {
        label: t('create-poll.sex-any'),
        value: Sex.Any,
      },
    ],
    [t],
  )

  const criteriaOptions: CriteriaOptions[] = useMemo(
    () => [
      { key: 'age', label: t('create-poll.age-lbl') },
      { key: 'nationalities', label: t('create-poll.nationalities-lbl') },
      { key: 'sex', label: t('create-poll.sex-lbl') },
    ],
    [t],
  )

  const unselectedCriteria = useMemo(
    () => criteriaOptions.filter(({ key }) => !selectedKey.includes(key)),
    [criteriaOptions, selectedKey],
  )

  const toggleCriteria = (key: CriteriaKey) => {
    setSelectedKey(prev => (prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]))
  }

  useEffect(() => {
    if (unselectedCriteria.length === 0) setAnchorEl(null)
  }, [unselectedCriteria])

  return (
    <Stack component={Paper} spacing={6}>
      {selectedKey.includes('nationalities') && (
        <Stack spacing={6} direction='row'>
          <Controller
            name='criteria.nationalities'
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={Boolean(fieldState.error)}>
                <Autocomplete
                  multiple
                  limitTags={2}
                  value={field.value}
                  isOptionEqualToValue={(option, value) =>
                    option.flag === value.flag && option.name === value.name
                  }
                  disableCloseOnSelect
                  disabled={field.disabled || isSubmitting}
                  sx={{ maxWidth: 516 }}
                  options={countries}
                  getOptionLabel={({ codes }) => formatCountry(codes[0], { withFlag: true })}
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
                  onChange={(_, newValue: Nationality[] | null) => {
                    field.onChange(newValue)
                  }}
                />
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />
          <IconButton color='secondary' onClick={() => toggleCriteria('nationalities')}>
            <UiIcon name={Icons.DeleteBin6Line} size={4} />
          </IconButton>
        </Stack>
      )}
      {selectedKey.includes('age') && (
        <Stack direction='row' alignItems='center' gap={6}>
          <Stack
            flex={1}
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            gap={5}
            divider={
              <Typography variant='body4' color={palette.text.secondary}>
                –
              </Typography>
            }
          >
            <Controller
              name='criteria.minAge'
              control={control}
              render={({ field, fieldState }) => (
                <UiNumberField
                  {...field}
                  sx={{ flex: 1 }}
                  label={t('create-poll.min-age-lbl')}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
            <Controller
              name='criteria.maxAge'
              control={control}
              render={({ field, fieldState }) => (
                <UiNumberField
                  {...field}
                  sx={{ flex: 1 }}
                  label={t('create-poll.max-age-lbl')}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Stack>
          <IconButton color='secondary' onClick={() => toggleCriteria('age')}>
            <UiIcon name={Icons.DeleteBin6Line} size={4} />
          </IconButton>
        </Stack>
      )}
      {selectedKey.includes('sex') && (
        <Stack direction='row' alignItems='center' gap={6}>
          <Controller
            name='criteria.sex'
            defaultValue={Sex.Any}
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel sx={{ background: palette.background.paper, px: 2 }}>
                  {t('create-poll.sex-lbl')}
                </InputLabel>
                <Select {...field} disabled={isSubmitting}>
                  {sexOptions.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <IconButton color='secondary' onClick={() => toggleCriteria('sex')}>
            <UiIcon name={Icons.DeleteBin6Line} size={4} />
          </IconButton>
        </Stack>
      )}

      {unselectedCriteria.length !== 0 && (
        <Button
          size='small'
          variant='text'
          sx={{ mr: 'auto', pl: 1, mt: 1 }}
          startIcon={<UiIcon name={Icons.Plus} size={4} />}
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          {t('create-poll.add-criteria')}
        </Button>
      )}
      <CriteriaMenu
        anchorEl={anchorEl}
        isOpen={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        unselectedCriteria={unselectedCriteria}
        toggleCriteria={toggleCriteria}
      />
    </Stack>
  )
}

interface CriteriaMenuProps {
  anchorEl: HTMLElement | null
  isOpen: boolean
  unselectedCriteria: CriteriaOptions[]
  onClose: () => void
  toggleCriteria: (key: CriteriaKey) => void
}

function CriteriaMenu({
  isOpen,
  anchorEl,
  onClose,
  unselectedCriteria,
  toggleCriteria,
}: CriteriaMenuProps) {
  return (
    <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
      {unselectedCriteria.map(({ key, label }) => (
        <MenuItem key={key} onClick={() => toggleCriteria(key)}>
          <Typography variant='buttonLarge'>{label}</Typography>
        </MenuItem>
      ))}
    </Menu>
  )
}
