import { Stack, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'

import { AppHeader, NetworkWarningProtector } from '@/common'
import { RouteTitleContextProvider } from '@/contexts'
import { Transitions } from '@/theme/constants'
import { UiContainer } from '@/ui'

const MainLayout = ({ children }: PropsWithChildren) => {
  const { palette, breakpoints } = useTheme()
  return (
    <RouteTitleContextProvider>
      <Stack
        direction='row'
        width='100%'
        sx={{
          backgroundColor: palette.background.light,
          [breakpoints.down('md')]: {
            flexDirection: 'column',
            gap: 0,
          },
        }}
      >
        <UiContainer
          id='main-content'
          sx={{
            pt: { xs: 15, md: 20 },
            px: { xs: 0, md: 20, lg: 0 },
            transition: Transitions.Default,
          }}
        >
          <AppHeader />
          <NetworkWarningProtector>{children}</NetworkWarningProtector>
        </UiContainer>
      </Stack>
    </RouteTitleContextProvider>
  )
}

export default MainLayout
