import { Button, Stack, Typography, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import AppLogo from '@/common/AppLogo'
import AppThemeButton from '@/common/AppThemeButton'
import { Icons, RoutePaths } from '@/enums'
import { FREEDOM_TOOL_MAIL, HOME_CONTAINER_WIDTH } from '@/pages/Home/constants'
import { UiIcon } from '@/ui'

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <Stack
      width={1}
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
      bgcolor={palette.background.paper}
      sx={{ borderBottomRightRadius: 16, borderBottomLeftRadius: 16 }}
    >
      <Stack
        maxWidth={1135}
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
            {t('landing.header.create-poll-btn')}
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
        justifyContent='space-between'
        alignItems='center'
        spacing={4}
        direction={{ xs: 'column', sm: 'row' }}
        mx='auto'
        maxWidth={HOME_CONTAINER_WIDTH}
        width={1}
      >
        <AppLogo />
        <Stack alignItems={{ xs: 'center', sm: 'flex-end' }}>
          <Typography variant='body4'>{t('landing.footer.quote')}</Typography>
          <Typography
            component='a'
            variant='body5'
            color={palette.text.primary}
            href={`mailto:${FREEDOM_TOOL_MAIL}`}
          >
            {FREEDOM_TOOL_MAIL}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
