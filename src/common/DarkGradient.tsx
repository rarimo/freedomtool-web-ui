import { Stack, StackProps } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function DarkGradient({ sx, children, ...rest }: StackProps & PropsWithChildren) {
  return (
    <Stack
      sx={{
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6))',
        pointerEvents: 'none',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Stack>
  )
}
