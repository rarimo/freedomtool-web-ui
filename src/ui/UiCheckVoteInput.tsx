import { TextFieldProps, Typography, useMediaQuery, useTheme } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import UiNumberField from './UiNumberField'

const UiCheckVoteInput = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ ...textFieldProps }, ref) => {
    const { typography, palette, breakpoints } = useTheme()
    const isMdUp = useMediaQuery(breakpoints.up('md'))
    const { t } = useTranslation()

    return (
      <UiNumberField
        sx={{
          height: 138,
          '.MuiTextField-root': {
            border: 'none',
          },
          '.MuiFormHelperText-root': {
            position: 'absolute',
            right: 0,
            maxWidth: 100,
            top: 10,
          },
          '.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl':
            {
              minHeight: 'unset',
              height: '100%',
              typography: typography.subtitle3,
              color: textFieldProps.error ? palette.error.dark : palette.text.primary,
              overflow: 'hidden',
              borderRadius: 4,
            },
          '.MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          input: {
            position: 'absolute',
            width: '80%',
            mr: 'auto',
            overflow: 'hidden',
            bottom: isMdUp ? 20 : 40,
            py: 0,
            pl: isMdUp ? 6 : 0,
          },
        }}
        InputProps={{
          startAdornment: (
            <Typography
              sx={{ position: 'absolute', top: 20, left: isMdUp ? 40 : 20 }}
              variant='overline2'
            >
              {t('create-poll.votes-count-lbl')}
            </Typography>
          ),
        }}
        {...textFieldProps}
        inputRef={ref}
      />
    )
  },
)

UiCheckVoteInput.displayName = 'UiCheckVoteInput'

export default UiCheckVoteInput
