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
import { ChangeEvent, forwardRef } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NATIVE_CURRENCY } from '@/constants'
import { formatBalance } from '@/helpers'

import UiNumberField from './UiNumberField'

const MAX_VISIBLE_DECIMALS = 4

type AmountInputProps = { decimals?: number; value: number; maxValue: string } & Omit<
  TextFieldProps,
  'value'
> &
  Omit<ControllerRenderProps, 'value'>

const UiCheckAmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ decimals = MAX_VISIBLE_DECIMALS, onChange, error, disabled, value, maxValue }, ref) => {
    const { t } = useTranslation()
    const { palette, typography, breakpoints } = useTheme()
    const isMdUp = useMediaQuery(breakpoints.up('md'))

    const normalizeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value

      if (value.includes('.')) {
        const [integer, decimal] = value.split('.')
        value = decimal.length > decimals ? `${integer}.${decimal.slice(0, decimals)}` : value
      }

      onChange(value)
    }

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
            width: '90%',
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
                      {formatBalance(maxValue)} {NATIVE_CURRENCY}
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
        onChange={normalizeInput}
      />
    )
  },
)

UiCheckAmountInput.displayName = 'UiCheckAmountInput'

export default UiCheckAmountInput
