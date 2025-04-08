import { Stack, StackProps, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function ContainerLayout({ children, ...rest }: PropsWithChildren & StackProps) {
  const { palette } = useTheme()
  return (
    <Stack
      {...rest}
      m={0.5}
      bgcolor={palette.background.light}
      p={12}
      sx={{
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'center',
        borderRadius: 4,
        ...rest.sx,
      }}
    >
      {children}
    </Stack>
  )
}
