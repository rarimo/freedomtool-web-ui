import { Box, BoxProps, useTheme } from '@mui/material'
import { ComponentProps, ReactNode } from 'react'

import UiIcon from '@/ui/UiIcon'

type Props =
  | ({
      iconProps?: ComponentProps<typeof UiIcon>
      children?: never
    } & BoxProps)
  | ({
      children: ReactNode
      iconProps?: never
    } & BoxProps)

export default function UiCircledBadge({ iconProps, children, ...rest }: Props) {
  const { palette } = useTheme()

  return (
    <Box
      {...rest}
      sx={{
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.success.light,
        ...rest.sx,
      }}
    >
      {iconProps ? <UiIcon {...iconProps} /> : children}
    </Box>
  )
}
