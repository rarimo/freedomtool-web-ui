import { FormLabel, Stack, TextField, type TextFieldProps } from '@mui/material'
import { forwardRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = TextFieldProps & {
  errorMessage?: string
}

const UiTextField = forwardRef(({ id, errorMessage, label, ...rest }: Props, ref) => {
  const fieldId = useMemo(() => id ?? `ui-text-field-${uuidv4()}`, [id])

  return (
    <Stack spacing={2}>
      {label && (
        <FormLabel disabled={rest.disabled} htmlFor={fieldId}>
          {label}
        </FormLabel>
      )}
      <TextField
        {...rest}
        id={fieldId}
        inputRef={ref}
        error={!!errorMessage}
        helperText={errorMessage || rest.helperText}
      />
    </Stack>
  )
})

export default UiTextField
