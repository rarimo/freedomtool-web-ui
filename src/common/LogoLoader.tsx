import { Typography, useTheme } from '@mui/material'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends ComponentProps<typeof Typography> {}

export default function LogoLoader({ ...rest }: Props) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Typography
      sx={{
        fontSize: '3rem',
        fontWeight: 400,
        color: palette.text.primary,
        opacity: 0,
        animation: 'pulse 2s ease infinite',
        ...rest.sx,
      }}
      {...rest}
    >
      {t('logo-spinner.title')}
    </Typography>
  )
}
