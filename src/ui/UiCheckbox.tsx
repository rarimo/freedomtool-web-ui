import { Checkbox, type CheckboxProps, FormControlLabel } from '@mui/material'
import { forwardRef } from 'react'

interface Props extends CheckboxProps {
  label?: string
}

const UiCheckbox = forwardRef<HTMLInputElement, Props>(({ label, ...rest }, ref) => {
  return label ? (
    <FormControlLabel inputRef={ref} control={<Checkbox {...rest} />} label={label} />
  ) : (
    <Checkbox {...rest} inputRef={ref} />
  )
})

export default UiCheckbox
