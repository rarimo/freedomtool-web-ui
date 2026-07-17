import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { RoundedBackground } from '@/common'
import { Icons, RoutePaths } from '@/enums'
import { Transitions } from '@/theme/constants'
import { UiIcon } from '@/ui'

import { HOME_CONTAINER_WIDTH } from '../constants'
import { getRepositoryItemVariants } from '../helpers'
import ContributeSection from './ContributeSection'

export default function RepositoriesSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  const links = [
    {
      title: 'Passport ZK Circuits',
      description: 'Prove eligibility from a passport or ID chip without revealing identity',
      href: 'https://github.com/rarimo/passport-zk-circuits',
      auditHref:
        'https://github.com/rarimo/passport-zk-circuits/blob/main/audits/halborn_2024-03-16.pdf',
    },
    {
      title: 'Voting Contracts',
      description: 'Register ballots and tally results on-chain',
      href: 'https://github.com/rarimo/passport-voting-contracts',
      auditHref:
        'https://github.com/rarimo/voting-contracts/blob/main/audits/halborn_2024-03-12.pdf',
    },
    {
      title: 'Proof Verification Relayer',
      description: 'Verify proofs and submit votes, so voters never pay gas',
      href: 'https://github.com/rarimo/proof-verification-relayer/',
    },
    {
      title: 'IOS App',
      description: 'Reference voting app to fork and rebrand',
      href: 'https://github.com/rarimo/rarime-ios-app',
      auditHref: 'https://github.com/rarimo/FreedomTool/blob/main/audits/halborn_2024-03-26.pdf',
    },
    {
      title: 'Android App',
      description: 'Reference voting app to fork and rebrand',
      href: 'https://github.com/rarimo/rarime-android-app',
      auditHref: 'https://github.com/rarimo/FreedomTool/blob/main/audits/halborn_2024-03-26.pdf',
    },
    {
      title: 'Whitepaper',
      description: 'The architecture and cryptography behind Freedom Tool',
      href: RoutePaths.Whitepaper,
      internal: true,
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
        mb: 0,
        pb: 22,
        [breakpoints.down('md')]: {
          mx: 0,
          pb: 11,
          px: 4,
        },
      }}
    >
      <Stack maxWidth={HOME_CONTAINER_WIDTH} width={1}>
        <Stack component='section'>
          <Typography
            textAlign='center'
            component='h2'
            variant='h2'
            typography={{ xs: 'h3', md: 'h2' }}
          >
            {t('home.repositories.title')}
          </Typography>
          <Typography
            textAlign='center'
            color={palette.text.secondary}
            maxWidth={656}
            mx='auto'
            mt={{ xs: 4, md: 6 }}
          >
            {t('home.repositories.description')}
          </Typography>
          <Box
            sx={{
              mt: { xs: 10, md: 20 },
              width: 1,
              gap: 4,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {links.map((link, index) => (
              <RepositoryItem key={index} link={link} index={index} total={links.length} />
            ))}
          </Box>
          <Box mb={{ xs: 11, md: 22 }} />
        </Stack>

        <ContributeSection />
      </Stack>
    </RoundedBackground>
  )
}

interface RepositoryItemProps {
  link: { title: string; description: string; href: string; auditHref?: string; internal?: boolean }
  index: number
  total: number
}

function RepositoryItem({ link, index, total }: RepositoryItemProps) {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()
  const ref = useRef(null)
  const isLgDown = useMediaQuery(breakpoints.down('lg'))
  const inView = useInView(ref, { once: true, amount: 1 })

  const variants = getRepositoryItemVariants(index, total, isLgDown)

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial='hidden'
      animate={inView ? 'visible' : 'hidden'}
      style={{ position: 'relative', height: '100%' }}
    >
      <Stack
        {...(link.internal
          ? { component: Link, to: link.href }
          : { component: 'a', href: link.href, target: '_blank', rel: 'noopener' })}
        justifyContent='flex-end'
        spacing={2}
        sx={{
          borderRadius: 3,
          pt: 17,
          px: 6,
          pb: 6,
          height: '100%',
          minHeight: 172,
          color: palette.text.primary,
          border: `1px solid ${palette.action.active}`,
          transition: Transitions.Fast,
          '&:hover': {
            background: palette.action.active,
            textDecoration: 'underline',
          },
        }}
      >
        <Typography variant='buttonLarge' color={palette.text.primary}>
          {link.title}
        </Typography>
        {/* Reserve two lines so titles align across cards with 1- and 2-line descriptions */}
        <Typography variant='body4' color={palette.text.secondary} sx={{ minHeight: 40 }}>
          {link.description}
        </Typography>
      </Stack>
      {link.auditHref && (
        <Stack
          component='a'
          href={link.auditHref}
          target='_blank'
          rel='noopener'
          direction='row'
          alignItems='center'
          spacing={1}
          sx={{
            position: 'absolute',
            top: 16,
            left: 24,
            py: 1,
            px: 2,
            borderRadius: 25,
            color: palette.success.dark,
            background: palette.success.light,
            transition: Transitions.Fast,
            '&:hover': {
              background: palette.success.main,
              color: palette.success.contrastText,
            },
          }}
        >
          <UiIcon name={Icons.SealCheck} size={4} />
          <Typography variant='caption2' color='inherit'>
            {t('home.repositories.audited-badge')}
          </Typography>
        </Stack>
      )}
    </motion.div>
  )
}
