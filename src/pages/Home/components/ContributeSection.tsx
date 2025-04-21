import { Button, Stack, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DefaultDonateModal, LazyImage } from '@/common'

export default function ContributeSection() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)

  const { palette } = useTheme()
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const initial = { opacity: 0 }
  const animate = isInView ? { opacity: 1 } : {}

  return (
    <>
      <Stack
        component={motion.div}
        ref={ref}
        width={1}
        p={11}
        bgcolor={palette.action.active}
        borderRadius={8}
        alignItems='center'
        justifyContent='center'
        initial={initial}
        animate={animate}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Stack maxWidth={370} spacing={4} alignItems='center' justifyContent='center'>
          <LazyImage
            width={64}
            height={64}
            sx={{ background: 'transparent' }}
            src={`images/contribute/hands-with-puzzle-${palette.mode}.svg`}
            alt='Contribute Icon'
          />
          <Stack spacing={3} alignItems='center' justifyContent='center'>
            <Typography
              alignSelf='flex-start'
              component='h2'
              variant='h2'
              typography={{ xs: 'h3', md: 'h2' }}
            >
              {t('home.contribute.title')}
            </Typography>
            <Typography>{t('home.contribute.description')}</Typography>
          </Stack>
          <Button
            sx={{ mt: 2, width: 'fit-content' }}
            size='small'
            onClick={() => setIsDonateModalOpen(true)}
          >
            {t('home.contribute.btn')}
          </Button>
        </Stack>
      </Stack>
      <DefaultDonateModal open={isDonateModalOpen} onClose={() => setIsDonateModalOpen(false)} />
    </>
  )
}
