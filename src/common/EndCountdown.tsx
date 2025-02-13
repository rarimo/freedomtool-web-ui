import { Stack, type StackProps, Typography } from '@mui/material'
import { ElementType } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { formatTimeLeft } from '@/helpers'
import { useCountdown } from '@/hooks'
import { UiIcon } from '@/ui'

export default function EndCountdown<T extends ElementType = 'div'>({
  endDate,
  ...rest
}: { endDate: number } & StackProps<T, { component?: T }>) {
  const { t } = useTranslation()

  const { days, hours, minutes, seconds, isCompleted } = useCountdown(
    new Date((endDate || 0) * 1000),
  )

  if (isCompleted) return null

  return (
    <Stack
      spacing={2}
      direction='row'
      justifyContent='center'
      alignItems='center'
      py={2}
      px={1.75}
      sx={{
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: theme => theme.palette.action.active,
        backgroundColor: theme => `${theme.palette.common.baseBackground}`,
        color: theme => theme.palette.common.white,
        borderRadius: 100,
        width: 'fit-content',
        ...rest.sx,
      }}
    >
      <UiIcon size={4} name={Icons.TimerLine} color='inherit' />
      <Stack direction='row' spacing={1}>
        <Typography component='span' variant='caption2'>
          {t('market-head.ends-in', {
            timeLeft: formatTimeLeft({
              days,
              hours,
              minutes,
              seconds,
              labels: { hours: 'hr', minutes: 'min', seconds: 'sec' },
            }),
          })}
        </Typography>
      </Stack>
    </Stack>
  )
}
