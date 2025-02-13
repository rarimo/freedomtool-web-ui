import { Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

import { UiContainer } from '@/ui'

const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      direction='row'
      sx={{
        backgroundColor: theme => theme.palette.background.pure,
      }}
    >
      <UiContainer sx={{ maxWidth: 1256 }}>{children}</UiContainer>
    </Stack>
  )
}

export default HomeLayout
