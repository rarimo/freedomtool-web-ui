import { Stack, useTheme } from '@mui/material'

import { UiLineSpinner } from '@/ui'

export default function AppLoader() {
  const { palette } = useTheme()
  return (
    <Stack alignItems='center' justifyContent='center' minHeight='100vh' width='100%'>
      <UiLineSpinner stroke={4} size={15} color={palette.text.secondary} />
    </Stack>
  )
}
