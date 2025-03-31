import { Button, TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_TOKEN_AMOUNT_PER_TX } from '@/constants'

import UiNumberField from './UiNumberField'

type AmountInputProps = {
  onCheck: () => void
} & TextFieldProps

const UiCheckAmountInput = forwardRef<TextFieldProps, AmountInputProps>(
  ({ onCheck, ...textFieldProps }, ref) => {
    const { t } = useTranslation()

    const isDisabled =
      textFieldProps.disabled ||
      Number(textFieldProps.value) <= 0 ||
      Number(textFieldProps.value) > MAX_TOKEN_AMOUNT_PER_TX

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

UiCheckAmountInput.displayName = 'UiCheckAmountInput'

export default UiCheckAmountInput
