import { useTheme } from '@mui/material'
import { ComponentProps } from 'react'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

interface Props extends Omit<ComponentProps<typeof UiIcon>, 'name'> {}

export default function LogoSpinner({ size = 10, ...rest }: Props) {
  const { palette } = useTheme()

  return (
    <UiIcon
      name={Icons.App}
      size={size}
      color={palette.text.primary}
      {...rest}
      sx={{ animation: 'spin 2s ease infinite', ...rest.sx }}
    />
  )
}
