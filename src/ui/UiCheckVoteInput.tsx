import { TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'

import UiNumberField from './UiNumberField'

type VoteCountInputProps = {} & TextFieldProps

const UiCheckVoteInput = forwardRef<TextFieldProps, VoteCountInputProps>(
  ({ ...textFieldProps }, ref) => {
    return <UiNumberField {...textFieldProps} inputRef={ref} />
  },
)

UiCheckVoteInput.displayName = 'UiCheckVoteInput'

export default UiCheckVoteInput
