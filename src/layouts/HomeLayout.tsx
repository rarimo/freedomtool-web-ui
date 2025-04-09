import { Button, Stack, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import AppLogo from '@/common/AppLogo'
import AppThemeButton from '@/common/AppThemeButton'
import { Icons, RoutePaths } from '@/enums'
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
