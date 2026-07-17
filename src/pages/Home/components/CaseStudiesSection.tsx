import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LazyImage, RoundedBackground } from '@/common'
import { Icons } from '@/enums'
import { lineClamp } from '@/theme/helpers'
import { UiIcon } from '@/ui'

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
  publication: string
  href: string
}

export default function CaseStudiesSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    if (!card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
  }, [])

  const items: CaseStudiesItemProps[] = [
    {
      previewSrc: `images/case-studies/france-${palette.mode}.png`,
      title: t('home.case-studies.case-4-title'),
      description: t('home.case-studies.case-4-description'),
      links: [
        {
          title: t('home.case-studies.case-4-link-1-title'),
          previewSrc: 'images/case-studies/france-link-1.png',
          publication: 'Le Figaro',
          href: 'https://www.lefigaro.fr/vox/politique/l-application-referendum-citoyen-veut-repondre-au-vide-democratique-qui-s-installe-entre-deux-elections-20260610',
        },
        {
          title: t('home.case-studies.case-4-link-2-title'),
          previewSrc: 'images/case-studies/france-link-2.png',
          publication: 'Europe 1',
          href: 'https://www.europe1.fr/societe/application-referendum-citoyen-depuis-quelques-jours-les-francais-peuvent-choisir-la-trajectoire-du-pays-assure-robinson-jardin-955949',
        },
      ],
    },
    {
      previewSrc: `images/case-studies/georgia-${palette.mode}.png`,
      title: t('home.case-studies.case-1-title'),
      description: t('home.case-studies.case-1-description'),
      links: [
        {
          title: t('home.case-studies.case-1-link-1-tite'),
          previewSrc: 'images/case-studies/georgia-link-1.png',
          publication: 'Cointelegraph',
          href: 'https://cointelegraph.com/news/georgia-opposition-blockchain-elections',
        },
        {
          title: t('home.case-studies.case-1-link-2-title'),
          previewSrc: 'images/case-studies/georgia-link-2.png',
          publication: 'Digital Frontier',
          href: 'https://digitalfrontier.com/articles/digital-democracy-Georgia-election-blockchain-unm',
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
          publication: 'App Developer Magazine',
          href: 'https://appdevelopermagazine.com/blockchain-voting-from-iranians-vote-and-freedom-tool/',
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
          publication: 'CoinDesk',
          href: 'https://www.coindesk.com/policy/2024/05/10/exiled-russian-opposition-leader-launches-blockchain-based-referendum-on-vladimir-putins-election-win',
        },
        {
          title: t('home.case-studies.case-2-link-2-title'),
          previewSrc: 'images/case-studies/russia-link-2.png',
          publication: 'The Block',
          href: 'https://www.theblock.co/post/293528/former-pussy-riot-lawyer-launches-blockchain-powered-referendum-to-challenge-putins-inauguration',
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
          ref={scrollerRef}
          onScroll={updateScrollState}
          sx={{
            mt: { xs: 10, md: 20 },
            width: 1,
            gap: 4,
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            '& > *': {
              flex: { xs: '0 0 85%', sm: '0 0 380px' },
              scrollSnapAlign: 'start',
            },
          }}
        >
          {items.map((item, index) => (
            <CaseStudiesItem key={index} {...item} />
          ))}
        </Box>

        <Stack direction='row' spacing={2} justifyContent='center' mt={8}>
          <IconButton
            aria-label='previous case study'
            disabled={!canScrollLeft}
            onClick={() => scrollByCard(-1)}
            sx={{ border: `1px solid ${palette.action.active}` }}
          >
            <UiIcon name={Icons.ArrowLeft} size={5} />
          </IconButton>
          <IconButton
            aria-label='next case study'
            disabled={!canScrollRight}
            onClick={() => scrollByCard(1)}
            sx={{ border: `1px solid ${palette.action.active}` }}
          >
            <UiIcon name={Icons.ArrowRight} size={5} />
          </IconButton>
        </Stack>
      </Stack>
    </RoundedBackground>
  )
}

function CaseStudiesItem({ title, description, previewSrc, links }: CaseStudiesItemProps) {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.4 })

  // Fade only: a vertical offset here would create vertical overflow inside the
  // horizontal scroller, letting wheel gestures scroll the cards out of view
  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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
        <LazyImage
          src={previewSrc}
          width={136}
          height={80}
          alt='Article preview'
          sx={{ borderRadius: 2 }}
        />
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

function CaseStudiesLink({ title, publication, previewSrc, href }: CaseStudiesLinkProps) {
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
      <Stack spacing={1}>
        <Typography
          variant='body4'
          sx={{ ...lineClamp(2), textDecoration: 'underline', color: palette.text.primary }}
        >
          {title}
        </Typography>
        <Typography variant='caption2' color={palette.text.secondary}>
          {publication}
        </Typography>
      </Stack>
    </Stack>
  )
}
