import { TextFieldProps as NumberFieldProps, TextField } from '@mui/material'
import { forwardRef } from 'react'

import { trimLeadingZeroes } from '@/helpers'

const UiNumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ value, onChange, ...props }, ref) => {
    const preventInvalidKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevent "e" and "-e"
      if (event.key === 'e' || event.key === '-' || event.key === 'E') {
        event.preventDefault()
      }
    }

    return (
      <TextField
        {...props}
        type='number'
        value={trimLeadingZeroes(String(value ?? ''))}
        onKeyDown={preventInvalidKeys} // Handle key press to prevent invalid characters
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
