import { Stack, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'

import { DashboardHeader, NetworkWarningProtector } from '@/common'
import { Transitions } from '@/theme/constants'
import { vh } from '@/theme/helpers'
import { UiContainer } from '@/ui'

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { palette, breakpoints } = useTheme()

  return (
    <Stack
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
      <DashboardHeader />
      <UiContainer
        id='main-content'
        sx={{
          mt: 8,
          maxWidth: 1136,
          transition: Transitions.Default,

          [breakpoints.down('md')]: {
            mt: 4,
          },
        }}
      >
        <NetworkWarningProtector>{children}</NetworkWarningProtector>
      </UiContainer>
    </Stack>
  )
}

export default DashboardLayout
