import { Stack, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'

import { AppHeader, AppNavbar, NetworkWarningProtector } from '@/common'
import { RouteTitleContextProvider } from '@/contexts'
import { Transitions } from '@/theme/constants'
import { vh } from '@/theme/helpers'
import { UiContainer } from '@/ui'

const MainLayout = ({ children }: PropsWithChildren) => {
  const { palette, breakpoints } = useTheme()
  return (
    <RouteTitleContextProvider>
      <Stack
        direction='row'
        height={vh(100)}
        width='100%'
        sx={{
          backgroundColor: palette.background.default,
          [breakpoints.down('md')]: {
            flexDirection: 'column',
            gap: 0,
          },
        }}
      >
        <AppNavbar
          sx={{
            [breakpoints.up('md')]: {
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
            },
          }}
        />
        <AppHeader />
        <UiContainer
          id='main-content'
          flex={1}
          overflow='hidden auto'
          pt={{ xs: 15, md: 20 }}
          px={{ xs: 0, md: 20, lg: 0 }}
          sx={{
            transition: Transitions.Default,
          }}
        >
          <NetworkWarningProtector>{children}</NetworkWarningProtector>
        </UiContainer>
      </Stack>
    </RouteTitleContextProvider>
  )
}

export default MainLayout
