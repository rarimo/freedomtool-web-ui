import { Box, BoxProps, useTheme } from '@mui/material'

export default function DotDivider(props: BoxProps) {
  const { palette } = useTheme()

  return <Box {...props} width={4} height={4} borderRadius='50%' bgcolor={palette.action.hover} />
}
