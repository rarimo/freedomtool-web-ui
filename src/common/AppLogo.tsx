import { Stack, StackProps, useMediaQuery, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'

import { Icons, RoutePaths } from '@/enums'
import { UiIcon } from '@/ui'

export default function AppLogo(props: StackProps) {
  const { palette, typography, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))

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
        color={palette.text.primary}
        sx={isMdUp ? { width: 176, minWidth: 176 } : { width: 132, minWidth: 132 }}
      />
    </Stack>
  )
}
