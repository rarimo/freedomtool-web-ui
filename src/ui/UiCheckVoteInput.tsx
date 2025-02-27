import { Button, TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_VOTE_COUNT_PER_TX } from '@/constants'

import UiNumberField from './UiNumberField'

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
      <UiNumberField
        {...textFieldProps}
        inputRef={ref}
        InputProps={{
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
