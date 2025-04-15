import { Button, Stack, Typography, useTheme } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AppThemeButton } from '@/common'
import AppLogo from '@/common/AppLogo'
import { DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/constants'
import { Icons, RoutePaths } from '@/enums'
import { FREEDOM_TOOL_EMAIL, HOME_CONTAINER_WIDTH } from '@/pages/Home/constants'
import { vh } from '@/theme/helpers'
import { UiIcon } from '@/ui'

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <Stack
      width={1}
      height={vh(100)}
      position='relative'
      sx={{
        backgroundColor: theme => theme.palette.background.default,
        overflowX: 'hidden',
      }}
    >
      <HomeHeader />
      {children}
      <HomeFooter />
    </Stack>
  )
}

function HomeHeader() {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack
      py={6}
      px={4}
      alignItems='center'
      justifyContent='center'
      height={{ xs: MOBILE_HEADER_HEIGHT, md: DESKTOP_HEADER_HEIGHT }}
      bgcolor={palette.background.paper}
      sx={{
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        position: 'sticky',
        top: 0,
        zIndex: zIndex.appBar,
      }}
    >
      <Stack
        maxWidth={HOME_CONTAINER_WIDTH}
        mx='auto'
        width={1}
        direction='row'
        spacing={2}
        justifyContent='space-between'
        alignItems='center'
      >
        <AppLogo />
        <Stack spacing={3} direction='row'>
          <Button
            component={Link}
            size='small'
            startIcon={<UiIcon size={4} name={Icons.Plus} />}
            to={RoutePaths.NewPoll}
          >
            {t('home.header.create-poll-btn')}
          </Button>
          <AppThemeButton />
        </Stack>
      </Stack>
    </Stack>
  )
}

function HomeFooter() {
  const { palette } = useTheme()
  const { t } = useTranslation()
  return (
    <Stack px={6} py={{ xs: 8, md: 12 }} justifyContent='center' width={1}>
      <Stack
        justifyContent={{ xs: 'center', md: 'space-between' }}
        alignItems='center'
        spacing={4}
        direction={{ xs: 'column', md: 'row' }}
        mx='auto'
        maxWidth={HOME_CONTAINER_WIDTH}
        width={1}
      >
        <AppLogo justifyContent='center' />
        <Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
          <Typography variant='body4'>{t('home.footer.quote')}</Typography>
          <Typography
            component='a'
            variant='body5'
            color={palette.text.primary}
            href={`mailto:${FREEDOM_TOOL_EMAIL}`}
          >
            {FREEDOM_TOOL_EMAIL}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
