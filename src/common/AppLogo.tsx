import { Stack, StackProps, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'

import { Icons, RoutePaths } from '@/enums'
import { UiIcon } from '@/ui'

export default function AppLogo(props: StackProps) {
  const { palette, typography } = useTheme()

  return (
    <Stack
      component={NavLink}
      to={RoutePaths.Home}
      alignItems='center'
      direction='row'
      spacing={3}
      {...props}
      sx={{
        color: palette.text.primary,
        ...typography.h5,
        ...props.sx,
      }}
    >
      <UiIcon
        name={Icons.App}
        sx={{
          color: palette.text.primary,
          width: '130px',
          height: '34px',
          maxHeight: 'none',
          maxWidth: 'none',
        }}
      />
    </Stack>
  )
}
