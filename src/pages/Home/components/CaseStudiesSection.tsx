import { Box, Stack, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { LazyImage, RoundedBackground } from '@/common'
import { lineClamp } from '@/theme/helpers'

import { HOME_CONTAINER_WIDTH } from '../constants'

interface CaseStudiesItemProps {
  previewSrc: string
  title: string
  description: string
  links: CaseStudiesLinkProps[]
}

interface CaseStudiesLinkProps {
  previewSrc: string
  title: string
  href: string
}

export default function CaseStudiesSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  const items: CaseStudiesItemProps[] = [
    {
      previewSrc: `images/case-studies/georgia-${palette.mode}.png`,
      title: t('home.case-studies.case-1-title'),
      description: t('home.case-studies.case-1-description'),
      links: [
        {
          title: t('home.case-studies.case-1-link-1-tite'),
          previewSrc: 'images/case-studies/georgia-link-1.png',
          href: 'https://cointelegraph.com/news/georgia-opposition-blockchain-elections',
        },
        {
          title: t('home.case-studies.case-1-link-2-title'),
          previewSrc: 'images/case-studies/georgia-link-2.png',
          href: 'https://digitalfrontier.com/articles/digital-democracy-Georgia-election-blockchain-unm',
        },
      ],
    },
    {
      previewSrc: `images/case-studies/russia-${palette.mode}.png`,
      title: t('home.case-studies.case-2-title'),
      description: t('home.case-studies.case-2-description'),
      links: [
        {
          title: t('home.case-studies.case-2-link-1-title'),
          previewSrc: 'images/case-studies/russia-link-1.png',
          href: 'https://www.coindesk.com/policy/2024/05/10/exiled-russian-opposition-leader-launches-blockchain-based-referendum-on-vladimir-putins-election-win',
        },
        {
          title: t('home.case-studies.case-2-link-2-title'),
          previewSrc: 'images/case-studies/russia-link-2.png',
          href: 'https://www.theblock.co/post/293528/former-pussy-riot-lawyer-launches-blockchain-powered-referendum-to-challenge-putins-inauguration',
        },
      ],
    },
    {
      previewSrc: `images/case-studies/iran-${palette.mode}.png`,
      title: t('home.case-studies.case-3-title'),
      description: t('home.case-studies.case-3-description'),
      links: [
        {
          title: t('home.case-studies.case-3-link-title'),
          previewSrc: 'images/case-studies/iran-link-1.png',
          href: 'https://appdevelopermagazine.com/blockchain-voting-from-iranians-vote-and-freedom-tool/',
        },
      ],
    },
  ]

  return (
    <RoundedBackground
      sx={{
        background: palette.background.paper,
        overflow: 'hidden',
        position: 'relative',
        pt: 20,
        mt: 0,
        [breakpoints.down('md')]: {
          mx: 0,
          p: 4,
          py: 8,
        },
      }}
    >
      <Stack maxWidth={HOME_CONTAINER_WIDTH} width={1}>
        <Typography
          textAlign='center'
          component='h2'
          variant='h2'
          typography={{ xs: 'h3', md: 'h2' }}
        >
          {t('home.case-studies.title')}
        </Typography>

        <Box
          sx={{
            mt: { xs: 10, md: 20 },
            width: 1,
            gap: 4,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          {items.map((item, index) => (
            <CaseStudiesItem key={index} {...item} />
          ))}
        </Box>
      </Stack>
    </RoundedBackground>
  )
}

function CaseStudiesItem({ title, description, previewSrc, links }: CaseStudiesItemProps) {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.4 })

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
    >
      <Stack
        spacing={6}
        p={6}
        sx={{ borderRadius: 4, border: `1px solid ${palette.action.active}` }}
      >
        <LazyImage src={previewSrc} width={136} height={80} alt='Link preview' />
        <Typography component='h3' variant='h3' typography={{ xs: 'h4', md: 'h3' }}>
          {title}
        </Typography>
        <Typography color={palette.text.secondary}>{description}</Typography>
        <Typography variant='overline2' color={palette.text.secondary}>
          {t('home.case-studies.resources')}
        </Typography>
        {links.map((link, index) => (
          <CaseStudiesLink {...link} key={index} />
        ))}
      </Stack>
    </motion.div>
  )
}

function CaseStudiesLink({ title, previewSrc, href }: CaseStudiesLinkProps) {
  const { palette } = useTheme()
  return (
    <Stack
      component='a'
      href={href}
      target='_blank'
      spacing={4}
      direction='row'
      alignItems='center'
    >
      <LazyImage
        src={previewSrc}
        alt={title}
        width={55}
        height={55}
        sx={{ borderRadius: 1.5, flexShrink: 0 }}
      />
      <Typography
        variant='body4'
        sx={{ ...lineClamp(2), textDecoration: 'underline', color: palette.text.primary }}
      >
        {title}
      </Typography>
    </Stack>
  )
}
