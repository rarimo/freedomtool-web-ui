import { Typography, useTheme } from '@mui/material'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends ComponentProps<typeof Typography> {}

export default function LogoLoader({ ...rest }: Props) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Typography
      variant='h1'
      sx={{
        fontWeight: 400,
        color: palette.text.primary,
        opacity: 1,
        ...rest.sx,
      }}
      {...rest}
    >
      {t('logo-spinner.title')}
    </Typography>
  )
}
