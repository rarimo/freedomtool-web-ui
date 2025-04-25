import { IconButton, TextField, TextFieldProps } from '@mui/material'

import { Icons } from '@/enums'
import { useCopyToClipboard } from '@/hooks'
import { UiIcon } from '@/ui/index'

type Props = { value: string } & Omit<TextFieldProps, 'value'>

export default function UiCopyField({ value, label, ...rest }: Props) {
  const { copy, isCopied } = useCopyToClipboard()

  return (
    <TextField
      label={label}
      value={value}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <IconButton color='secondary' onClick={() => copy(value)}>
            <UiIcon name={isCopied ? Icons.CheckFill : Icons.FileCopyLine} size={4} />
          </IconButton>
        ),
      }}
      {...rest}
      sx={{ width: 1, ...rest.sx }}
    />
  )
}
