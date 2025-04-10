import { Button, Divider, Stack, StackProps, Typography, useTheme } from '@mui/material'
import { t } from 'i18next'
import { Link } from 'react-router-dom'

import { DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/constants'
import { useRouteTitleContext } from '@/contexts'
import { useWeb3Context } from '@/contexts/web3-context'
import { Icons, RoutePaths } from '@/enums'
import { useSignIn } from '@/hooks'
import { UiIcon } from '@/ui'

import AppLogo from './AppLogo'
import AppSettingsMenu from './AppSettingsMenu'
import AuthGuard from './AuthGuard'
export default function AppHeader(props: StackProps) {
  const { palette, zIndex } = useTheme()
  const { isConnected } = useWeb3Context()
  const { handleSignIn, isLoading, authGuardRef } = useSignIn()
  const { title } = useRouteTitleContext()

  return (
    <>
      <Stack
        {...props}
        bgcolor={palette.background.light}
        component='header'
        sx={{
          height: { xs: MOBILE_HEADER_HEIGHT, md: DESKTOP_HEADER_HEIGHT },
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          position: 'fixed',
          py: { xs: 0, md: 5 },
          px: { xs: 4, lg: 0 },
          pl: 0,
          top: 0,
          left: 0,
          right: 0,
          zIndex: zIndex.appBar,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          width: 1,

          ...props.sx,
        }}
      >
        <Stack
          sx={{
            flexDirection: { xs: 'row' },
            maxWidth: { md: 1141 },
            py: { xs: 2, md: 0, lg: 0 },
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 1,
            mx: 'auto',
          }}
        >
          {title ? (
            <Button
              component={Link}
              to={RoutePaths.Polls}
              sx={{ px: 0 }}
              size='small'
              variant='text'
            >
              <Stack
                alignItems='center'
                color={palette.text.primary}
                direction='row'
                spacing={{ xs: 2, md: 6 }}
              >
                <UiIcon sx={{ pl: 0 }} size={5} name={Icons.CloseFill} />
                <Typography maxWidth={100} noWrap textOverflow='ellipsis' variant='subtitle5'>
                  {title}
                </Typography>
              </Stack>
            </Button>
          ) : (
            <AppLogo />
          )}

          <Stack
            direction='row'
            alignItems='center'
            spacing={4}
            divider={<Divider flexItem orientation='vertical' />}
          >
            {isConnected ? (
              <AppSettingsMenu />
            ) : (
              <Button size='small' sx={{ height: 34 }} disabled={isLoading} onClick={handleSignIn}>
                {t('app-header.connect-btn')}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
      <AuthGuard ref={authGuardRef} />
    </>
  )
}
