import { Stack, useTheme } from '@mui/material'

import { Icons } from '@/enums'
import { spinAnimation } from '@/theme/constants'
import { UiIcon } from '@/ui'

export default function AppLoader() {
  const { palette } = useTheme()
  return (
    <Stack alignItems='center' justifyContent='center' minHeight='100vh' width='100%'>
      <UiIcon
        name={Icons.LoaderFill}
        size={15}
        color={palette.text.secondary}
        sx={{
          animation: `${spinAnimation} 1.2s infinite linear`,
        }}
      />
    </Stack>
  )
}
