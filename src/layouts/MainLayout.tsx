import { Stack, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'

import { AppHeader, NetworkWarningProtector } from '@/common'
import { DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/constants'
import { RouteTitleContextProvider } from '@/contexts'
import { Transitions } from '@/theme/constants'
import { vh } from '@/theme/helpers'
import { UiContainer } from '@/ui'

const MainLayout = ({ children }: PropsWithChildren) => {
  const { breakpoints } = useTheme()
  return (
    <RouteTitleContextProvider>
      <Stack
        direction='row'
        height={vh(100)}
        width='100%'
        sx={{
          [breakpoints.down('md')]: {
            flexDirection: 'column',
            gap: 0,
          },
        }}
      >
        <UiContainer
          id='main-content'
          sx={{
            pt: { xs: MOBILE_HEADER_HEIGHT / 4, md: DESKTOP_HEADER_HEIGHT / 4 },
            transition: Transitions.Default,
            [breakpoints.down('md')]: {
              px: 0,
            },
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
