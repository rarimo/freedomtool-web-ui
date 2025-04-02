import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

export default function NoPollsData({ onPollCreate }: { onPollCreate: () => void }) {
  const { t } = useTranslation()
  const { palette } = useTheme()

  return (
    <Stack spacing={10} alignItems='center' mt={3}>
      <Box
        component='img'
        src='/images/no-polls-image.svg'
        alt='no polls data'
        width={160}
        height={200}
      />
      <Stack spacing={4} alignItems='center'>
        <Typography variant='h3'>{t('dashboard.no-polls-title')}</Typography>
        <Typography variant='body3' color={palette.text.secondary}>
          {t('dashboard.no-polls-description')}
        </Typography>
      </Stack>
      <Button
        size='large'
        onClick={onPollCreate}
        startIcon={<UiIcon name={Icons.AddLine} size={5} />}
      >
        {t('dashboard.create-poll-btn')}
      </Button>
    </Stack>
  )
}
