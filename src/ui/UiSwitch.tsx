import { FormControlLabel, Switch, type SwitchProps } from '@mui/material'
import { forwardRef, ReactNode } from 'react'

interface Props extends SwitchProps {
  label?: ReactNode
}

const UiSwitch = forwardRef(({ label, ...rest }: Props, ref) => {
  return label ? (
    <FormControlLabel
      inputRef={ref}
      control={<Switch {...rest} />}
      label={label}
      sx={{ gap: 4, mx: 0 }}
    />
  ) : (
    <Switch {...rest} inputRef={ref} />
  )
})

export default UiSwitch
