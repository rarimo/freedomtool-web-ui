import { Box, FormLabel, FormLabelProps } from '@mui/material'
import { forwardRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { MAX_AVATAR_SIZE } from '@/constants'

interface Props extends FormLabelProps {
  onUpdate: (file: File) => void
}

const AvatarInput = forwardRef(({ onUpdate, children, ...rest }: Props, ref) => {
  const fileInputId = useMemo(() => `avatar-input-${uuidv4()}`, [])

  return (
    <FormLabel
      {...rest}
      htmlFor={fileInputId}
      sx={{
        width: 'fit-content',
        cursor: 'pointer',
        position: 'relative',
        ...rest.sx,
      }}
    >
      {children}
      <Box
        {...ref}
        component='input'
        id={fileInputId}
        type='file'
        max={MAX_AVATAR_SIZE}
        accept='image/png, image/jpeg, image/webp'
        sx={{
          clip: 'rect(0 0 0 0)',
          width: 1,
          height: 1,
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return
          onUpdate(file)
        }}
      />
    </FormLabel>
  )
})

export default AvatarInput
