import { Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

import { ThemeSwitcher } from '@/common/index'

export default function AppSettings({ children }: PropsWithChildren) {
  return (
    <Stack spacing={3}>
      <ThemeSwitcher />
      {children}
    </Stack>
  )
}
