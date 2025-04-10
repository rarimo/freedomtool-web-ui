import { Stack } from '@mui/material'

import whitepaperMD from '@/locales/resources/whitepaper_en.md'
import { UiContainer, UiMarkdown } from '@/ui'

export default function Whitepaper() {
  return (
    <Stack>
      <UiContainer maxWidth={700} sx={{ mx: 'auto' }}>
        <UiMarkdown>{whitepaperMD}</UiMarkdown>
      </UiContainer>
    </Stack>
  )
}
