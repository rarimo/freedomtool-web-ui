import { Typography, useTheme } from '@mui/material'
import { ComponentProps } from 'react'

interface Props extends ComponentProps<typeof Typography> {}

export default function LogoSpinner({ ...rest }: Props) {
  const { palette } = useTheme()

  return (
    <Typography
      sx={{
        fontSize: '3rem',
        fontWeight: 700,
        color: palette.text.primary,
        opacity: 0,
        animation: 'fadeInUp 1s ease forwards, pulse 2s ease infinite',
        ...rest.sx,
      }}
      {...rest}
    >
      Freedom tool 2.0
    </Typography>
  )
}
