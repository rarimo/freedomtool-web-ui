import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { RoundedBackground } from '@/common'
import { useUiState } from '@/store'

import { HOME_CONTAINER_WIDTH, HOME_DESKTOP_HEADER_HEIGHT } from '../constants'

export default function HeroSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()
  const { isDarkMode } = useUiState()

  return (
    <RoundedBackground
      sx={{
        background: palette.background.paper,
        overflow: 'hidden',
        position: 'relative',
        height: `calc(100vh - ${HOME_DESKTOP_HEADER_HEIGHT}px - 4px)`,
        [breakpoints.down('md')]: {
          mx: 0,
          p: 4,
          py: 8,
        },
      }}
    >
      <Stack
        maxWidth={HOME_CONTAINER_WIDTH}
        spacing={{ xs: 5 }}
        m='auto'
        direction={{ xs: 'column-reverse', md: 'row' }}
        justifyContent='space-between'
        width={1}
      >
        <Stack spacing={16.25}>
          <Stack component='blockquote' m={0} spacing={8} maxWidth={656}>
            <Typography component='h1' variant='h1' typography={{ xs: 'h2', md: 'h1' }}>
              {t('landing.hero-section.title-1')}
            </Typography>
            <Typography component='p' variant='h1' typography={{ xs: 'h2', md: 'h1' }}>
              {t('landing.hero-section.title-2')}
            </Typography>
            <Typography variant='subtitle4' sx={{ fontStyle: 'italic' }}>
              {t('landing.hero-section.sign')}
            </Typography>
          </Stack>

          <Stack spacing={{ xs: 3, md: 4 }} direction='row' zIndex={2}>
            <Button sx={{ height: { md: 64 } }}>{t('landing.hero-section.cta-btn')}</Button>
            <Button sx={{ height: { md: 64 } }} variant='outlined'>
              {t('landing.hero-section.whitepaper-btn')}
            </Button>
          </Stack>
        </Stack>

        <Box
          component='img'
          src={isDarkMode ? '/images/globe-dark.png' : '/images/globe-light.png'}
          sx={{
            display: 'block',
            maxWidth: 500,
            objectFit: 'contain',
            aspectRatio: 1,
            [breakpoints.down('md')]: {
              position: 'absolute',
              top: 100,
              opacity: 0.3,
            },
          }}
        />
      </Stack>
    </RoundedBackground>
  )
}
