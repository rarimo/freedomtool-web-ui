import { Stack, StackProps, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useCountdown } from '@/hooks'

export default function Countdown({ endDate, ...rest }: { endDate: number } & StackProps) {
  const { t } = useTranslation()

  const { days, hours, minutes, seconds, isCompleted } = useCountdown(
    new Date((endDate || 0) * 1000),
  )

  if (isCompleted) return null

  const timeArr = [
    {
      isHidden: days === 0,
      value: days,
      label: t('market-head.days-lbl'),
    },
    {
      isHidden: days === 0 && hours === 0,
      value: hours,
      label: t('market-head.hours-lbl'),
    },
    {
      isHidden: hours === 0 && minutes === 0,
      value: minutes,
      label: t('market-head.minutes-lbl'),
    },
    {
      value: seconds,
      label: t('market-head.seconds-lbl'),
    },
  ]
  return (
    <Stack spacing={3} direction='row' {...rest}>
      {timeArr.map(({ value, label, isHidden }, index) => {
        return !isHidden && <CountdownItem key={index} value={value} label={label} />
      })}
    </Stack>
  )
}

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <Stack
      justifyContent='center'
      alignItems='center'
      sx={{
        height: 48,
        width: 48,
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: theme => theme.palette.action.active,
        backgroundColor: theme => theme.palette.common.baseBackground,
        borderRadius: 2,
      }}
    >
      <Typography variant='h6' color={({ palette }) => palette.common.white}>
        {value}
      </Typography>
      <Typography variant='caption3' color={({ palette }) => palette.common.white}>
        {label}
      </Typography>
    </Stack>
  )
}
