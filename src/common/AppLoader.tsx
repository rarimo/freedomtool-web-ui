import { Stack } from '@mui/material'

import LogoSpinner from './LogoSpinner'

export default function AppLoader() {
  return (
    <Stack alignItems='center' justifyContent='center' minHeight='100vh' width='100%'>
      <LogoSpinner />
    </Stack>
  )
}
