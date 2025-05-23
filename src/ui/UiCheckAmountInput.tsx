import { BN, DECIMALS, isFixedPointString } from '@distributedlab/tools'
import {
  Button,
  ButtonProps,
  Divider,
  FormHelperText,
  Stack,
  TextFieldProps,
  Typography,
  TypographyProps,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { formatUnits } from 'ethers'
import { forwardRef } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NATIVE_CURRENCY } from '@/constants'
import { formatAmountShort, formatInput, trimLeadingZeroes } from '@/helpers'

import UiNumberField from './UiNumberField'

type AmountInputProps = {
  value: string
  maxValue: string
  endAdornmentSx?: ButtonProps['sx']
  helperTextSx?: TypographyProps['sx']
  startAdornmentSx?: TypographyProps['sx']
} & Omit<TextFieldProps, 'value'> &
  Omit<ControllerRenderProps, 'value'>

const CHARACTER_LIMIT_FOR_SCALING = 12

const UiCheckAmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      onChange,
      error,
      disabled,
      value,
      maxValue,
      helperTextSx,
      startAdornmentSx,
      endAdornmentSx,
      helperText,
      sx,
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { palette, typography, breakpoints } = useTheme()
    const isMdUp = useMediaQuery(breakpoints.up('md'))

    const maxValueBN = BN.fromBigInt(maxValue, DECIMALS.WEI)

    const handleOnChange = (_value: string) => {
      const newValue = formatInput(normalizeRange(normalizeNumber(_value)))
      onChange(newValue)
    }

    const normalizeRange = (value: string): string => {
      if (!isFixedPointString(value)) {
        return value
      }

      if (BN.fromRaw(value, DECIMALS.WEI).lt(BN.fromRaw(0, DECIMALS.WEI))) {
        return '0'
      }

      if (value && BN.fromRaw(value, DECIMALS.WEI).gt(maxValueBN)) {
        return maxValueBN.toDecimals(2).toString()
      }

      return value
    }

    const normalizeNumber = (_value: string) =>
      isNaN(Number(_value)) ? value || '0' : trimLeadingZeroes(_value)

    return (
      <Stack sx={{ position: 'relative' }}>
        <UiNumberField
          variant='outlined'
          sx={{
            height: 138,
            '.MuiTextField-root': {
              border: 'none',
            },
            '.MuiFormHelperText-root': {
              position: 'absolute',
              right: 20,
              maxWidth: 100,
              top: 10,
            },
            '.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl':
              {
                minHeight: 'unset',
                height: '100%',
                typography: typography.subtitle3,
                color: error ? palette.error.dark : palette.text.primary,
                background: palette.background.paper,
                overflow: 'hidden',
                borderRadius: 4,
              },
            '.MuiInputBase-input': {
              fontSize: value.length > CHARACTER_LIMIT_FOR_SCALING ? '1.6rem' : '2rem',
              transition: `font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
              transitionDelay: value.length < CHARACTER_LIMIT_FOR_SCALING ? '0s' : '0.05s',
              willChange: 'font-size',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            input: {
              position: 'absolute',
              width: { md: '90%' },
              bottom: { md: 40 },
              py: 0,
              pl: 1,
            },
            ...sx,
          }}
          InputProps={{
            startAdornment: (
              <Typography
                sx={{ position: 'absolute', top: 20, left: 20, ...startAdornmentSx }}
                variant='overline2'
              >
                {NATIVE_CURRENCY}
              </Typography>
            ),
            endAdornment: (
              <Button
                sx={{ p: 0, position: 'absolute', top: { xs: 8, md: 10 }, ...endAdornmentSx }}
                size='small'
                variant='text'
                onClick={() => onChange(Number(formatUnits(maxValue, 18)).toFixed(4))}
              >
                <Stack
                  data-button-stack
                  spacing={2}
                  alignItems='center'
                  justifyContent='flex-end'
                  divider={<Divider orientation='vertical' flexItem />}
                  direction='row'
                  width={200}
                >
                  <Stack direction='row' spacing={1}>
                    {isMdUp && (
                      <Typography variant='body5' color={palette.text.secondary}>
                        {t('create-poll.amount-lbl')}
                      </Typography>
                    )}
                    <Typography variant='subtitle7' color={palette.text.secondary}>
                      {formatAmountShort(maxValue)} {NATIVE_CURRENCY}
                    </Typography>
                  </Stack>
                  <Typography variant='buttonSmall'>{t('create-poll.max-btn')}</Typography>
                </Stack>
              </Button>
            ),
          }}
          value={value}
          disabled={disabled}
          inputRef={ref}
          onChange={e => handleOnChange(e.target.value)}
        />
        <FormHelperText
          sx={{ position: 'absolute', right: 20, top: 35, ...helperTextSx }}
          error={error}
        >
          {helperText}
        </FormHelperText>
      </Stack>
    )
  },
)

UiCheckAmountInput.displayName = 'UiCheckAmountInput'

export default UiCheckAmountInput
