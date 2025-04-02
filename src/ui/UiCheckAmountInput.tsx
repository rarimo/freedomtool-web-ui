import { BN, DECIMALS, isFixedPointString } from '@distributedlab/tools'
import {
  Button,
  Divider,
  Stack,
  TextFieldProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { formatUnits } from 'ethers'
import { forwardRef } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NATIVE_CURRENCY } from '@/constants'
import { formatAmount, formatInput, trimLeadingZeroes } from '@/helpers'

import UiNumberField from './UiNumberField'

type AmountInputProps = { value: string; maxValue: string } & Omit<TextFieldProps, 'value'> &
  Omit<ControllerRenderProps, 'value'>

const UiCheckAmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ onChange, error, disabled, value, maxValue }, ref) => {
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
      <UiNumberField
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
          '.MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          input: {
            position: 'absolute',
            width: '80%',
            py: 0,
            pl: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <Typography sx={{ position: 'absolute', top: 20, left: 20 }} variant='overline2'>
              {NATIVE_CURRENCY}
            </Typography>
          ),
          endAdornment: (
            <Button
              sx={{ p: 0, position: 'absolute', bottom: 0 }}
              size='small'
              variant='text'
              onClick={() => onChange(Number(formatUnits(maxValue, 18)).toFixed(4))}
            >
              <Stack
                spacing={2}
                alignItems='center'
                divider={<Divider orientation='vertical' flexItem />}
                direction='row'
              >
                {isMdUp && (
                  <Stack direction='row' spacing={1}>
                    <Typography variant='body5' color={palette.text.secondary}>
                      {t('create-poll.amount-lbl')}
                    </Typography>
                    <Typography variant='subtitle7' color={palette.text.secondary}>
                      {formatAmount(maxValue)} {NATIVE_CURRENCY}
                    </Typography>
                  </Stack>
                )}
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
    )
  },
)

UiCheckAmountInput.displayName = 'UiCheckAmountInput'

export default UiCheckAmountInput
