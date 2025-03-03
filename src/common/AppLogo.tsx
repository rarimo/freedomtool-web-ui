import { Stack, StackProps, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { Icons, RoutePaths } from '@/enums'
import { UiIcon } from '@/ui'

export default function AppLogo(props: StackProps) {
  const { palette, typography, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
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
      <UiIcon name={Icons.App} color={palette.inverted.light} size={8} />
      {isMdUp && (
        <Typography
          variant='buttonMedium'
          sx={{
            fontWeight: 400,
            color: palette.text.primary,
          }}
        >
          {t('app-navbar.title')}
        </Typography>
      )}
    </Stack>
  )
}
