import { Button, TextField, TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

type VoteCountInputProps = {
  onCheck: () => void
} & TextFieldProps

const UiCheckVoteInput = forwardRef<TextFieldProps, VoteCountInputProps>(
  ({ onCheck, ...textFieldProps }, ref) => (
    <TextField
      {...textFieldProps}
      type='number'
      inputRef={ref}
      InputProps={{
        ...textFieldProps.InputProps,
        sx: {
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none',
              margin: 0,
            },
          ...(textFieldProps.InputProps?.sx || {}),
        },
        endAdornment: (
          <Button
            variant='text'
            size='small'
            disabled={textFieldProps.disabled || Number(textFieldProps.value) <= 0}
            onClick={onCheck}
          >
            {useTranslation().t('create-vote.form.calculate-eth-btn')}
          </Button>
        ),
      }}
    />
  ),
)

UiCheckVoteInput.displayName = 'UiCheckVoteInput'

export default UiCheckVoteInput
