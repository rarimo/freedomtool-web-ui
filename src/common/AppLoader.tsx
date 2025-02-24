import { Stack } from '@mui/material'

import LogoLoader from './LogoLoader'

export default function AppLoader() {
  return (
    <Stack alignItems='center' justifyContent='center' minHeight='100vh' width='100%'>
      <LogoLoader />
    </Stack>
  )
}
