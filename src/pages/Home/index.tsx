import { Stack } from '@mui/material'

import HeroSection from './components/HeroSection'
import HowItWorksSection from './components/HowItWorksSection'

export default function Home() {
  return (
    <Stack>
      <HeroSection />
      <HowItWorksSection />
    </Stack>
  )
}
