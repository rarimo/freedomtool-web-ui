import { Stack, StackProps, Typography, useTheme } from '@mui/material'
import { ReactNode, useMemo } from 'react'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui/index'

type Props = StackProps & {
  icon?: ReactNode
  message: string
  severity: 'error' | 'success' | 'warning'
}

export default function UiInfoAlert({ icon, message, severity, ...rest }: Props) {
  const { palette, spacing } = useTheme()

  const stackStyles = useMemo(
    () =>
      ({
        error: {
          background: palette.error.lighter,
          color: palette.error.darker,
        },
        success: {
          background: palette.success.lighter,
          color: palette.success.darker,
        },
        warning: {
          background: palette.warning.lighter,
          color: palette.warning.darker,
        },
      })[severity],
    [palette, severity],
  )

  const chipIcon = useMemo(
    () =>
      icon ||
      {
        error: <UiIcon name={Icons.Info} />,
        info: <UiIcon name={Icons.Info} />,
        success: <UiIcon name={Icons.Info} />,
        warning: <UiIcon name={Icons.Info} />,
      }[severity],
    [icon, severity],
  )

  return (
    <Stack
      {...rest}
      sx={{ ...stackStyles }}
      direction='row'
      alignItems='center'
      spacing={2}
      p={2}
      borderRadius={spacing(2)}
    >
      {chipIcon}
      <Typography variant='body4'>{message}</Typography>
    </Stack>
  )
}
