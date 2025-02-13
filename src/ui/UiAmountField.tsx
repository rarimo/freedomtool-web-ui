import { isFixedPointString } from '@distributedlab/tools'
import {
  FormLabel,
  IconButton,
  type IconButtonProps,
  Stack,
  TextField,
  type TextFieldProps,
  Typography,
  useTheme,
} from '@mui/material'
import isFinite from 'lodash/isFinite'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Icons } from '@/enums'
import { trimLeadingZeroes } from '@/helpers'
import { UiIcon } from '@/ui'

type Props = {
  value?: string
  onChange?: (value: string) => void
  errorMessage?: string
  maxValue?: string
  snapPoints?: number[]
} & Omit<Omit<TextFieldProps, 'value'>, 'onChange'>

const UiAmountField = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      value: extValue,
      maxValue,
      errorMessage,
      onChange,
      disabled,
      snapPoints = [],
      ...rest
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = useState(extValue || '0.00')

    const fieldId = useMemo(() => id ?? `form-slider-input-${uuidv4()}`, [id])
    const theme = useTheme()

    const normalizedMaxValue = useMemo(
      () => (isFinite(Number(maxValue)) ? Number(maxValue) : undefined),
      [maxValue],
    )

    const step = useMemo(() => {
      if (normalizedMaxValue) {
        return normalizedMaxValue / 10
      }

      if (isFinite(Number(localValue))) {
        return Number(localValue) / 10
      }

      return 0
    }, [localValue, normalizedMaxValue])

    const minStep = useMemo(() => {
      if (step > 0) {
        return step
      }

      return 0.01
    }, [step])

    const decreaseValue = () => {
      if (!localValue || Number(localValue) <= 0) return

      const newValue = Number(localValue) - minStep

      setLocalValue(String(newValue))
    }

    const increaseValue = () => {
      const newValue = Number(localValue) + minStep

      setLocalValue(String(newValue))
    }

    const formatInput = (value: string) => {
      if (!value.includes('.') || value.charAt(value.length - 1) === '.') {
        return value
      }

      if (!isFinite(Number(value))) {
        return localValue
      }

      const splittedValue = value.split('.')

      if (splittedValue[1].length > 4) {
        return Number(value).toFixed(4).toString()
      }

      return value
    }

    const normalizeNumber = (_value: string) => {
      return isFinite(Number(_value)) ? trimLeadingZeroes(_value) || '' : localValue || ''
    }

    const normalizeRange = (value: string): string => {
      if (!isFixedPointString(value)) {
        return value
      }

      if (Number(localValue) < 0) {
        return '0'
      }

      if (maxValue && value > maxValue) {
        return maxValue
      }

      return value
    }

    const handleOnChange = (val: string) => {
      const normalizedValue = normalizeNumber(val)
      const normalizedRange = normalizeRange(normalizedValue)
      const formattedValue = formatInput(normalizedRange)

      setLocalValue(formattedValue)
      onChange?.(formattedValue)
    }

    useEffect(() => {
      if (!extValue) return

      setLocalValue(extValue)
    }, [extValue])

    return (
      <Stack spacing={6} alignItems='center'>
        <Stack alignItems='center'>
          <FormLabel disabled={disabled} htmlFor={fieldId}>
            <Typography variant='caption2' color={theme => theme.palette.text.secondary}>
              {label}
            </Typography>
          </FormLabel>
          <Stack direction='row' spacing={4} mt={2} alignItems='center'>
            <FormIconButton onClick={decreaseValue} disabled={disabled}>
              <UiIcon name={Icons.Minus} size={5} />
            </FormIconButton>
            <TextField
              autoComplete='off'
              value={localValue}
              onChange={e => handleOnChange(e.target.value)}
              disabled={disabled}
              id={fieldId}
              variant='standard'
              error={Boolean(errorMessage)}
              helperText={errorMessage}
              inputRef={ref}
              InputProps={{
                disableUnderline: true,
              }}
              FormHelperTextProps={{
                sx: {
                  textTransform: 'capitalize',
                },
              }}
              inputProps={{
                size: `${String(localValue || '').length || 1}`,
                min: 0,
                inputMode: 'text',
                max: maxValue,
                sx: {
                  ...theme.typography.h3,
                  maxWidth: 150,
                  textAlign: 'center',
                },
              }}
              {...rest}
            />
            <FormIconButton onClick={increaseValue} disabled={disabled}>
              <UiIcon name={Icons.Plus} size={5} />
            </FormIconButton>
          </Stack>
        </Stack>

        {snapPoints?.length && (
          <Stack direction='row' spacing={2} alignItems='center'>
            {snapPoints.map((el, idx) => (
              <IconButton
                key={idx}
                onClick={() => handleOnChange(String(el))}
                disabled={disabled}
                sx={theme => ({
                  background: 'transparent',
                  py: theme.spacing(2),
                  px: theme.spacing(4),
                  border: `1px solid ${theme.palette.action.active}`,
                })}
              >
                <Typography variant='subtitle4'>{el}</Typography>
              </IconButton>
            ))}
          </Stack>
        )}
      </Stack>
    )
  },
)

const FormIconButton = (props: IconButtonProps) => {
  return (
    <IconButton
      {...props}
      sx={theme => ({
        padding: theme.spacing(1.5),
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.action.active,
        '&:hover': {
          backgroundColor: theme.palette.action.focus,
        },
        '&:focus': {
          backgroundColor: theme.palette.action.hover,
        },
        '&:active': {
          backgroundColor: theme.palette.action.selected,
        },
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
        },
      })}
    />
  )
}

export default UiAmountField
