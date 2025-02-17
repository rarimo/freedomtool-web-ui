import { time, type TimeDate } from '@distributedlab/tools'
import { FormLabel, Stack, useTheme } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  errorMessage?: string
  onChange?: (v: string | null) => void
  hasTime?: boolean
} & Omit<DatePickerProps<TimeDate>, 'onChange'> &
  Omit<DateTimePickerProps<TimeDate>, 'onChange'>

const UiDatePicker = forwardRef<HTMLInputElement, Props>(
  ({ errorMessage, label, hasTime = false, ...rest }: Props, ref) => {
    const { palette } = useTheme()
    const fieldId = useMemo(() => `ui-date-picker-${uuidv4()}`, [])
    const [internalErrorMessage, setInternalErrorMessage] = useState<string | null>(null)

    const toDayjs = (date?: TimeDate) => (date ? time(date).utc().dayjs : undefined)

    const value = useMemo(() => toDayjs(rest.value) || null, [rest.value])
    const minDate = useMemo(() => toDayjs(rest.minDate), [rest.minDate])
    const maxDate = useMemo(() => toDayjs(rest.maxDate), [rest.maxDate])
    const minTime = useMemo(() => toDayjs(rest.minTime), [rest.minTime])
    const maxTime = useMemo(() => toDayjs(rest.maxTime), [rest.maxTime])

    const handleChange = useCallback(
      (v: TimeDate | null) => rest.onChange?.(v ? time(v).utc().format() : null),
      [rest],
    )

    const handleError = useCallback((reason: string | null) => {
      setInternalErrorMessage(
        reason === 'invalidDate' ? 'Invalid date format' : reason ? 'Invalid date' : null,
      )
    }, [])

    const pickerProps = {
      ...rest,
      inputRef: ref,
      value,
      onChange: handleChange,
      onError: handleError,
      minDate,
      maxDate,
      timezone: 'UTC',
      slotProps: {
        textField: {
          error: !!errorMessage || !!internalErrorMessage,
          helperText: errorMessage || internalErrorMessage,
        },
      },
      ...(hasTime && { ampm: false, minTime, maxTime }),
    }

    const PickerComponent = hasTime ? DateTimePicker : DatePicker

    return (
      <Stack spacing={2}>
        {label && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <PickerComponent
            {...pickerProps}
            sx={{
              '.MuiIconButton-root': {
                color: palette.text.secondary,
                pr: 2,
                '&:hover': { color: palette.text.primary },
              },
              width: '100%',
            }}
          />
        </LocalizationProvider>
      </Stack>
    )
  },
)

UiDatePicker.displayName = 'UiDatePicker'

export default UiDatePicker
