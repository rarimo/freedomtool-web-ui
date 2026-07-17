import { Button, Stack, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LazyImage } from '@/common'

import DonateModal from './DonateModal'

// Totals contributed to date, updated manually for now
const CONTRIBUTIONS = [
  { amount: '22.08', symbol: 'ETH' },
  { amount: '12,633', symbol: 'AZTEC' },
]

export default function ContributeSection() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)

  const { palette } = useTheme()
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 1 })

  const initial = { opacity: 0 }
  const animate = isInView ? { opacity: 1 } : {}

  return (
    <>
      <Stack
        component={motion.div}
        ref={ref}
        width={1}
        p={{ xs: 6, md: 11 }}
        bgcolor={palette.action.active}
        borderRadius={8}
        alignItems='center'
        justifyContent='center'
        initial={initial}
        animate={animate}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Stack maxWidth={480} spacing={4} alignItems='center' justifyContent='center'>
          <LazyImage
            width={64}
            height={64}
            sx={{ background: 'transparent', borderRadius: '100%' }}
            src={`images/contribute/hands-with-puzzle-${palette.mode}.svg`}
            alt='Contribute Icon'
          />
          <Stack spacing={3} alignItems='center' justifyContent='center'>
            <Typography
              textAlign='center'
              component='h2'
              variant='h2'
              typography={{ xs: 'h3', md: 'h2' }}
            >
              {t('home.contribute.title')}
            </Typography>
            <Typography color={palette.text.secondary} variant='body3' textAlign='center'>
              {t('home.contribute.description')}
            </Typography>
          </Stack>

          <Stack spacing={2} alignItems='center' pt={{ xs: 2, md: 3 }}>
            <Typography variant='overline2' color={palette.text.secondary}>
              {t('home.contribute.raised-lbl')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              alignItems='stretch'
              justifyContent='center'
            >
              {CONTRIBUTIONS.map(({ amount, symbol }) => (
                <Stack
                  key={symbol}
                  direction='row'
                  spacing={2}
                  alignItems='baseline'
                  justifyContent='center'
                  sx={{
                    px: 5,
                    py: 3,
                    borderRadius: 3,
                    bgcolor: palette.background.paper,
                  }}
                >
                  <Typography variant='h5' typography={{ xs: 'h6', md: 'h5' }}>
                    {amount}
                  </Typography>
                  <Typography variant='body4' color={palette.text.secondary}>
                    {symbol}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Button
            sx={{ mt: { xs: 1, md: 2 }, width: 'fit-content' }}
            size='small'
            onClick={() => setIsDonateModalOpen(true)}
          >
            {t('home.contribute.btn')}
          </Button>
        </Stack>
      </Stack>
      <DonateModal open={isDonateModalOpen} onClose={() => setIsDonateModalOpen(false)} />
    </>
  )
}
