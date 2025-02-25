import { Button, TextField, TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { trimLeadingZeroes } from '@/helpers'
import { MAX_VOTE_COUNT_PER_TX } from '@/pages/CreateVote/constants'

type VoteCountInputProps = {
  onCheck: () => void
} & TextFieldProps

const UiCheckVoteInput = forwardRef<TextFieldProps, VoteCountInputProps>(
  ({ onCheck, ...textFieldProps }, ref) => {
    const { t } = useTranslation()

    const isDisabled =
      textFieldProps.disabled ||
      Number(textFieldProps.value) <= 0 ||
      Number(textFieldProps.value) > MAX_VOTE_COUNT_PER_TX

    return (
      <TextField
        {...textFieldProps}
        type='number'
        inputRef={ref}
        value={trimLeadingZeroes(String(textFieldProps.value))}
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
            <Button variant='text' size='small' disabled={isDisabled} onClick={onCheck}>
              {t('check-vote-input.calculate-eth-btn')}
            </Button>
          ),
        }}
      />
    )
  },
)

UiCheckVoteInput.displayName = 'UiCheckVoteInput'

export default UiCheckVoteInput
