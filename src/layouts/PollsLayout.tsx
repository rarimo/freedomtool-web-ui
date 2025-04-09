import { Stack, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'

import { NetworkWarningProtector } from '@/common'
import PollsHeader from '@/pages/Polls/components/PollsHeader'
import { Transitions } from '@/theme/constants'
import { vh } from '@/theme/helpers'
import { UiContainer } from '@/ui'

const PollsLayout = ({ children }: PropsWithChildren) => {
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
      <PollsHeader />
      <UiContainer
        id='main-content'
        sx={{
          my: 8,
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

export default PollsLayout
