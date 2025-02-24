import { Stack, StackProps, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { RoutePaths } from '@/enums'

export default function AppLogo(props: StackProps) {
  const { palette, typography } = useTheme()
  const { t } = useTranslation()

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
          fontWeight: 400,
          color: palette.text.primary,
          opacity: 0,
          animation: 'pulse 2s ease infinite',
        }}
      >
        {t('app-logo.title')}
      </Typography>
    </Stack>
  )
}
