import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
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

import { createPollDefaultValues, CreatePollSchema } from '../createPollSchema'

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
    clearErrors,
    setValue,
    getValues,
  } = useFormContext<CreatePollSchema>()

  const { palette, typography, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedKey, setSelectedKey] = useState<CriteriaKey[]>(
    [
      'nationalities',
      getValues('criteria.sex') === Sex.Any ? null : 'sex',
      getValues('criteria.minAge') || getValues('criteria.maxAge') ? 'age' : undefined,
    ].filter(Boolean) as CriteriaKey[],
  )
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
      { key: 'nationalities', label: t('create-poll.nationalities-lbl') },
      { key: 'age', label: t('create-poll.age-lbl') },
      { key: 'sex', label: t('create-poll.sex-lbl') },
    ],
    [t],
  )

  const unselectedCriteria = useMemo(
    () => criteriaOptions.filter(({ key }) => !selectedKey.includes(key)),
    [criteriaOptions, selectedKey],
  )

  const toggleCriteria = (key: CriteriaKey) => {
    setSelectedKey(prev => {
      const newSelectedKey = prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
      const criteria = createPollDefaultValues.criteria
      switch (key) {
        case 'age':
          setValue(`criteria.maxAge`, criteria.maxAge)
          setValue(`criteria.minAge`, criteria.minAge)
          clearErrors(`criteria.maxAge`)
          clearErrors(`criteria.minAge`)
          break
        default:
          setValue(`criteria.${key}`, criteria[key])
          break
      }

      return newSelectedKey
    })
  }

  useEffect(() => {
    if (unselectedCriteria.length === 0) setAnchorEl(null)
  }, [unselectedCriteria])

  return (
    <Stack gap={{ xs: 4, md: 6 }}>
      {selectedKey.includes('nationalities') && (
        <Stack gap={{ xs: 4, md: 6 }} direction='row'>
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
                  slotProps={{
                    popupIndicator: {
                      color: 'default',
                      sx: { right: 4 },
                    },
                    clearIndicator: {
                      color: 'default',
                      sx: { right: 8 },
                    },
                  }}
                  clearIcon={
                    <UiIcon name={Icons.CloseLine} color={palette.text.primary} size={4} />
                  }
                  popupIcon={
                    <UiIcon name={Icons.ArrowDownSLine} color={palette.text.primary} size={5} />
                  }
                  ChipProps={{
                    deleteIcon: (
                      <UiIcon size={4} name={Icons.CloseFill} color={palette.text.placeholder} />
                    ),
                    sx: {
                      ...typography.buttonSmall,
                      background: palette.background.paper,
                    },
                  }}
                  disableCloseOnSelect
                  disabled={field.disabled || isSubmitting}
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
        <Stack direction='row' alignItems='center' gap={{ xs: 4, md: 6 }}>
          <Stack
            flex={1}
            direction={{ md: 'row' }}
            justifyContent='space-between'
            alignItems='center'
            gap={5}
            divider={
              isMdUp ? (
                <Typography variant='body4' color={palette.text.secondary}>
                  –
                </Typography>
              ) : null
            }
          >
            <Controller
              name='criteria.minAge'
              control={control}
              render={({ field, fieldState }) => (
                <UiNumberField
                  {...field}
                  sx={{ flex: 1, width: 1 }}
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
                  sx={{ flex: 1, width: 1 }}
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
                <InputLabel shrink variant='filled'>
                  {t('create-poll.sex-lbl')}
                </InputLabel>
                <Select
                  {...field}
                  displayEmpty
                  sx={{ pt: 4 }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        p: 1,
                      },
                    },
                    MenuListProps: {
                      sx: {
                        padding: 0,
                      },
                    },
                  }}
                  slotProps={{ input: { sx: { pl: 3 } } }}
                  IconComponent={(props: SelectProps) => {
                    const iconClass = props.className

                    return (
                      <UiIcon
                        name={Icons.ArrowDownSLine}
                        size={5}
                        sx={{
                          mt: 1,
                          transition: 'transform 0.3s ease',
                          transform: iconClass?.includes('MuiSelect-iconOpen')
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                        }}
                        className={iconClass}
                      />
                    )
                  }}
                  disabled={isSubmitting}
                >
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
          size='large'
          variant='text'
          sx={{ mr: 'auto', pl: 1, py: 0, height: 'fit-content' }}
          startIcon={<UiIcon name={Icons.Plus} size={5} />}
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
    <Menu
      slotProps={{
        paper: {
          sx: { p: 0, width: 172 },
        },
      }}
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
    >
      {unselectedCriteria.map(({ key, label }) => (
        <MenuItem
          sx={{
            py: 2.5,
            pl: 4,
          }}
          key={key}
          onClick={() => toggleCriteria(key)}
        >
          <Typography variant='buttonLarge'>{label}</Typography>
        </MenuItem>
      ))}
    </Menu>
  )
}
