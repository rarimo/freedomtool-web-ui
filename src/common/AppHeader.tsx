import { alpha, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import SettingsMenu from '@/common/SettingsMenu'
import { MOBILE_HEADER_HEIGHT } from '@/constants'
import { useRouteTitleContext } from '@/contexts'
import { Icons, RoutePaths } from '@/enums'
import { Transitions } from '@/theme/constants'
import { toRem } from '@/theme/helpers'
import { UiIcon } from '@/ui'

interface Props {
  compact?: boolean
}

export default function AppHeader({ compact = false }: Props) {
  const { title } = useRouteTitleContext()
  const { t } = useTranslation()
  const { palette, breakpoints, spacing } = useTheme()

  const isMdDown = useMediaQuery(() => breakpoints.down('md'))

  return (
    <Stack
      direction='row'
      position='fixed'
      zIndex={zIndex.appBar - 1}
      justifyContent='center'
      alignItems='center'
      top={0}
      left={{ xs: 0 }}
      right={0}
      px={6}
      bgcolor={alpha(palette.background.default, 0.8)}
      // HACK min-height is the sum of 2*py and 2*py + icon size of absolutely positioned element
      minHeight={{
        xs: MOBILE_HEADER_HEIGHT,
        md: compact ? 50 : 80,
      }}
      sx={{
        backdropFilter: 'blur(10px)',
        transition: Transitions.Default,
      }}
    >
      {isMdDown && (
        <Stack
          component={NavLink}
          to={RoutePaths.Home}
          alignItems='center'
          position='relative'
          sx={{
            [breakpoints.down('md')]: {
              position: 'absolute',
              left: spacing(3),
            },
          }}
        >
          <UiIcon name={Icons.App} size={10} color={palette.text.primary} />
          <Typography
            variant='overline3'
            color={palette.secondary.main}
            fontSize={toRem(8)}
            position='absolute'
            bottom={0}
            right={-10}
          >
            {t('app-navbar.beta-lbl')}
          </Typography>
        </Stack>
      )}
      <Typography
        variant='h5'
        color={palette.text.primary}
        sx={{
          [breakpoints.up('md')]: {
            transition: Transitions.Default,
            transform: compact ? 'scale(0.875)' : 'none',
            transformOrigin: 'bottom',
          },
        }}
      >
        {title}
      </Typography>

      {isMdDown && (
        <SettingsMenu
          sx={{
            [breakpoints.down('md')]: {
              position: 'absolute',
              right: spacing(5),
            },
          }}
        />
      )}
    </Stack>
  )
}
