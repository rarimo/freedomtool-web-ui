import { Button, Stack, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { RoundedBackground } from '@/common'
import { RoutePaths } from '@/enums'

import { HOME_CONTAINER_WIDTH, HOME_DESKTOP_HEADER_HEIGHT } from '../constants'
import WorldGlobe from './WorldGlobe'

export default function HeroSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  return (
    <RoundedBackground
      sx={{
        background: palette.background.paper,
        overflow: 'hidden',
        position: 'relative',
        minHeight: `calc(100vh - ${HOME_DESKTOP_HEADER_HEIGHT}px)`,
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
              {t('home.hero.title-1')}
            </Typography>
            <Typography component='p' variant='h1' typography={{ xs: 'h2', md: 'h1' }}>
              {t('home.hero.title-2')}
            </Typography>
            <Typography variant='subtitle4' sx={{ fontStyle: 'italic' }}>
              {t('home.hero.sign')}
            </Typography>
          </Stack>

          <Stack spacing={{ xs: 3, md: 4 }} direction='row' zIndex={2}>
            <Button component={Link} to={RoutePaths.NewPoll} sx={{ height: { md: 64 } }}>
              {t('home.hero.cta-btn')}
            </Button>
            <Button
              component='a'
              target='_blank'
              href={RoutePaths.Whitepaper}
              variant='outlined'
              sx={{ height: { md: 64 } }}
            >
              {t('home.hero.whitepaper-btn')}
            </Button>
          </Stack>
        </Stack>

        <Stack
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{ pointerEvents: 'auto' }}
          transition={{
            type: 'spring',
            delay: 0.5,
          }}
          whileHover={{ pointerEvents: 'none' }}
          whileDrag={{ pointerEvents: 'auto' }}
          whileTap={{ pointerEvents: 'auto' }}
        >
          <WorldGlobe />
        </Stack>
      </Stack>
    </RoundedBackground>
  )
}
