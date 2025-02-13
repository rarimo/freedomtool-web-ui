import { alpha, Stack, StackProps } from '@mui/material'

import LogoSpinner from './LogoSpinner'

export default function OverlaySpinner(props: StackProps) {
  return (
    <Stack
      justifyContent='center'
      alignItems='center'
      position='absolute'
      top={0}
      left={0}
      bottom={0}
      right={0}
      bgcolor={theme => alpha(theme.palette.background.light, 0.4)}
      zIndex={theme => theme.zIndex.modal}
      sx={{
        ...props.sx,
        backdropFilter: 'blur(4px)',
      }}
      {...props}
    >
      <LogoSpinner color='inherit' />
    </Stack>
  )
}
