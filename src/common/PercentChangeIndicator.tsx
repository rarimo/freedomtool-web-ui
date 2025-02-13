import { BN } from '@distributedlab/tools'
import { Stack, Typography, type TypographyProps, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { lineClamp } from '@/theme/helpers'
import { UiIcon } from '@/ui'

export default function PercentChangeIndicator({
  change,
  ...rest
}: {
  change: BN
} & TypographyProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const indicatorColors = useMemo(() => {
    if (change.isZero) {
      return {
        icon: theme.palette.text.secondary,
        text: theme.palette.text.secondary,
      }
    }
    if (change.isNegative) {
      return {
        icon: theme.palette.error.main,
        text: theme.palette.error.main,
      }
    }
    return {
      icon: theme.palette.primary.main,
      text: theme.palette.primary.main,
    }
  }, [change, theme])

  return (
    <Stack direction='row' alignItems='center' spacing={0.5}>
      <Typography
        {...rest}
        variant='subtitle4'
        color={indicatorColors.text}
        sx={{ ...lineClamp(1), maxWidth: 50, display: 'block' }}
        title={t('formats.percent', { value: change.value })}
      >
        {t('formats.percent', { value: change.value })}
      </Typography>
      {!change.isZero && (
        <UiIcon
          size={4}
          name={change.isNegative ? Icons.ArrowDropDown : Icons.ArrowDropUp}
          color={indicatorColors.icon}
        />
      )}
    </Stack>
  )
}
