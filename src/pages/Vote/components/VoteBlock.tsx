import { Button, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

export default function VoteBlock() {
  const { palette, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const { t } = useTranslation()

  if (isMdUp) return null

  return (
    <Stack
      justifyContent='center'
      component={Paper}
      sx={{ mb: 4, position: 'sticky', top: 60, background: palette.primary.light, zIndex: 2 }}
    >
      <Stack alignItems='center' direction='row' spacing={4}>
        <Stack
          width={40}
          height={40}
          alignItems='center'
          justifyContent='center'
          sx={{ background: palette.common.white, borderRadius: 2 }}
        >
          <UiIcon name={Icons.Rarime} />
        </Stack>
        <Stack
          flex={1}
          alignItems='center'
          width={1}
          spacing={2}
          direction='row'
          justifyContent='space-between'
        >
          <Stack spacing={0.5}>
            <Typography variant='buttonMedium' color={palette.primary.darker}>
              {t('vote.promo.title')}
            </Typography>
            <Typography variant='body4' color={palette.primary.main}>
              {t('vote.promo.description')}
            </Typography>
          </Stack>
          <Button color='primary' size='small' sx={{ width: 'fit-content' }}>
            {t('vote.promo.vote-btn')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
