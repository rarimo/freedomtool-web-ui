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
import { t } from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Icons } from '@/enums'
import nationalities from '@/locales/resources/countries_en.json'
import { SEX_OPTIONS } from '@/types'
import { UiIcon, UiNumberField } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'

type CriteriaKey = 'age' | 'nationalities' | 'sex'

interface ICriteria {
  key: CriteriaKey
  label: string
}

export default function CriteriasSection() {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()

  const { palette } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedKey, setSelectedKey] = useState<CriteriaKey[]>(['nationalities'])

  const sexLabels: Record<(typeof SEX_OPTIONS)[number], string> = {
    male: t('create-poll.sex-male'),
    female: t('create-poll.sex-female'),
    any: t('create-poll.sex-any'),
  }

  const criteriaOptions: ICriteria[] = useMemo(
    () => [
      { key: 'age', label: t('create-poll.age-lbl') },
      { key: 'nationalities', label: t('create-poll.nationalities-lbl') },
      { key: 'sex', label: t('create-poll.sex-lbl') },
    ],
    [],
  )

  const unselectedCriterias = useMemo(
    () => criteriaOptions.filter(({ key }) => !selectedKey.includes(key)),
    [criteriaOptions, selectedKey],
  )

  const toggleCriteria = (key: CriteriaKey) => {
    setSelectedKey(prev => (prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]))
  }

  useEffect(() => {
    if (unselectedCriterias.length === 0) setAnchorEl(null)
  }, [unselectedCriterias])

  return (
    <Stack component={Paper} spacing={6}>
      {selectedKey.includes('nationalities') && (
        <Stack spacing={6} direction='row'>
          <Controller
            name='criterias.nationalities'
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={Boolean(fieldState.error)}>
                <Autocomplete
                  multiple
                  limitTags={2}
                  disableCloseOnSelect
                  disabled={field.disabled || isSubmitting}
                  sx={{ maxWidth: 516 }}
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
              name='criterias.minAge'
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
              name='criterias.maxAge'
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
            name='criterias.sex'
            defaultValue={SEX_OPTIONS[2]}
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel sx={{ background: palette.background.paper, px: 2 }}>
                  {t('create-poll.sex-lbl')}
                </InputLabel>
                <Select {...field} disabled={isSubmitting}>
                  {SEX_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {sexLabels[option]}
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

      {unselectedCriterias.length !== 0 && (
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
      <CriteriasMenu
        anchorEl={anchorEl}
        isOpen={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        unselectedCriterias={unselectedCriterias}
        toggleCriteria={toggleCriteria}
      />
    </Stack>
  )
}

interface CriteriasMenuProps {
  anchorEl: HTMLElement | null
  isOpen: boolean
  onClose: () => void
  unselectedCriterias: ICriteria[]
  toggleCriteria: (key: CriteriaKey) => void
}

function CriteriasMenu({
  isOpen,
  anchorEl,
  onClose,
  unselectedCriterias,
  toggleCriteria,
}: CriteriasMenuProps) {
  return (
    <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
      {unselectedCriterias.map(({ key, label }) => (
        <MenuItem key={key} onClick={() => toggleCriteria(key)}>
          <Typography variant='buttonLarge'>{label}</Typography>
        </MenuItem>
      ))}
    </Menu>
  )
}
