import { TextFieldProps as NumberFieldProps, TextField } from '@mui/material'
import { forwardRef } from 'react'

import { trimLeadingZeroes } from '@/helpers'

const UiNumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ value, onChange, ...props }, ref) => {
    return (
      <TextField
        {...props}
        type='number'
        value={trimLeadingZeroes(String(value ?? ''))}
        onChange={onChange}
        inputRef={ref}
        InputProps={{
          ...props.InputProps,
          sx: {
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
              {
                WebkitAppearance: 'none',
                margin: 0,
              },
            ...(props.InputProps?.sx || {}),
          },
        }}
      />
    )
  },
)

UiNumberField.displayName = 'UiNumberField'

export default UiNumberField
