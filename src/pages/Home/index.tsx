import { Stack } from '@mui/material'

import CaseStudiesSection from './components/CaseStudiesSection'
import HeroSection from './components/HeroSection'
import HowItWorksSection from './components/HowItWorksSection'
import RepositoriesSection from './components/RepositoriesSection'

export default function Home() {
  return (
    <Stack>
      <HeroSection />
      <HowItWorksSection />
      <CaseStudiesSection />
      <RepositoriesSection />
    </Stack>
  )
}
