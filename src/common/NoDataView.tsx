import { Stack, StackProps, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

interface Props extends StackProps {
  icon?: ReactNode
  title?: string
  description?: string
  buttonText?: string
  action?: ReactNode
}

export default function NoDataView({
  icon = <UiIcon name={Icons.PulseFill} size={5} color={({ palette }) => palette.text.secondary} />,
  title,
  description,
  ...rest
}: Props) {
  const { palette, spacing } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack spacing={3} alignItems='center' width='100%' justifyContent='center' {...rest}>
      <Stack
        alignItems='center'
        justifyContent='center'
        bgcolor={palette.action.active}
        color={palette.text.secondary}
        borderRadius={250}
        width={spacing(12)}
        height={spacing(12)}
      >
        {icon}
      </Stack>
      <Stack spacing={1} textAlign='center'>
        <Typography variant='body3'>{title ?? t('no-data-view.title')}</Typography>
        {description && (
          <Typography variant='body3' color={palette.text.secondary}>
            {description}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
