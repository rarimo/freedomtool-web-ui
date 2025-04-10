import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { RoundedBackground } from '@/common'
import { RoutePaths } from '@/enums'
import { Transitions } from '@/theme/constants'

import { HOME_CONTAINER_WIDTH } from '../constants'

export default function RepositoriesSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  const links = [
    {
      title: 'Passport ZK Circuits',
      href: 'https://github.com/rarimo/passport-zk-circuits',
    },
    {
      title: 'Voting Contracts',
      href: 'https://github.com/rarimo/passport-voting-contracts',
    },
    {
      title: 'IOS App',
      href: 'https://github.com/rarimo/rarime-ios-app',
    },
    {
      title: 'Android App',
      href: 'https://github.com/rarimo/rarime-android-app',
    },
    {
      title: 'Proof Verification Relayer',
      href: 'https://github.com/rarimo/proof-verification-relayer/',
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
        pb: 0,
        [breakpoints.down('md')]: {
          mx: 0,
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
          {t('home.repositories.title')}
        </Typography>
        <Box
          sx={{
            mt: { xs: 10, md: 20 },
            width: 1,
            gap: 4,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {links.map(({ href, title }, index) => (
            <Stack
              key={index}
              component='a'
              target='_blank'
              rel='noopener'
              href={href}
              justifyContent='flex-end'
              sx={{
                borderRadius: 3,
                pt: 17,
                px: 6,
                pb: 6,
                height: 132,
                color: palette.text.primary,
                border: `1px solid ${palette.action.active}`,
                transition: Transitions.Fast,
                '&:hover': {
                  background: palette.action.active,
                  textDecoration: 'underline',
                },
              }}
            >
              <Typography variant='buttonLarge' maxWidth={80} color={palette.text.primary}>
                {title}
              </Typography>
            </Stack>
          ))}
        </Box>
        <Typography
          my={{ xs: 11, md: 22 }}
          sx={{ textDecoration: 'underline' }}
          color={palette.text.primary}
          textAlign='center'
          component='a'
          target='_blank'
          href={RoutePaths.Whitepaper}
          variant='buttonLarge'
        >
          {t('home.repositories.whitepaper')}
        </Typography>
      </Stack>
    </RoundedBackground>
  )
}
