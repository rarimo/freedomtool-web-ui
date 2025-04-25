import { Button, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { LazyImage } from '@/common'
import { Icons, RoutePaths } from '@/enums'
import { UiIcon } from '@/ui'

export default function EmptyPollsView({
  title,
  description,
}: {
  title?: string
  description?: string
}) {
  const { t } = useTranslation()
  const { palette } = useTheme()

  return (
    <Stack spacing={10} alignItems='center' mt={3}>
      <LazyImage
        component='img'
        src={`images/no-polls-image-${palette.mode}.svg`}
        alt='no polls data'
        sx={{ background: 'transparent' }}
        width={160}
        height={200}
      />
      <Stack spacing={4} alignItems='center'>
        <Typography textAlign='center' variant='h3'>
          {title ?? t('polls.no-polls-title')}
        </Typography>
        <Typography
          maxWidth={{ xs: 300, md: 600 }}
          textAlign='center'
          variant='body3'
          color={palette.text.secondary}
        >
          {description ?? t('polls.no-polls-description')}
        </Typography>
      </Stack>
      <Button
        component={NavLink}
        size='large'
        startIcon={<UiIcon name={Icons.AddFill} size={5} />}
        to={RoutePaths.NewPoll}
      >
        {t('polls.create-poll-btn')}
      </Button>
    </Stack>
  )
}
