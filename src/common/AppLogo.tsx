import { Stack, StackProps, Typography, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'

import { RoutePaths } from '@/enums'

export default function AppLogo(props: StackProps) {
  const { palette, typography } = useTheme()

  return (
    <Stack
      component={NavLink}
      to={RoutePaths.Home}
      alignItems='center'
      direction='row'
      spacing={3}
      {...props}
      sx={{
        color: palette.text.primary,
        ...typography.h5,
        ...props.sx,
      }}
    >
      <Typography
        sx={{
          fontSize: '3rem',
          fontWeight: 700,
          color: palette.text.primary,
          opacity: 0,
          animation: 'fadeInUp 1s ease forwards, spin 2s ease infinite',
        }}
      >
        Freedom tool 2.0
      </Typography>
    </Stack>
  )
}
