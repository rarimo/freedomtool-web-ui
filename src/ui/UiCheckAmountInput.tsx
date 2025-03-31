import { TextFieldProps } from '@mui/material'
import { ChangeEvent, forwardRef } from 'react'

import UiNumberField from './UiNumberField'

type AmountInputProps = {} & TextFieldProps

const UiCheckAmountInput = forwardRef<TextFieldProps, AmountInputProps>(
  ({ ...textFieldProps }, ref) => {
    const trimToDecimals = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value

      if (value.includes('.')) {
        const [integer, decimal] = value.split('.')
        value = decimal.length > 18 ? `${integer}.${decimal.slice(0, 18)}` : value
      }

      textFieldProps.onChange?.({
        ...event,
        target: { ...event.target, value },
      } as React.ChangeEvent<HTMLInputElement>)
    }

    return <UiNumberField {...textFieldProps} inputRef={ref} onChange={e => trimToDecimals(e)} />
  },
)

UiCheckAmountInput.displayName = 'UiCheckAmountInput'

export default UiCheckAmountInput
