import { Box, Stack, StackProps, useMediaQuery, useTheme } from '@mui/material'

const BOTTOM_BAR_HEIGHT = 68
const MARGIN_Y = 8

export default function AppScreenContainer({ children, ...rest }: StackProps) {
  const { breakpoints } = useTheme()
  const isMdDown = useMediaQuery(breakpoints.down('md'))

  return (
    <Stack flex={1} {...rest}>
      <Stack flex={1}>{children}</Stack>
      {isMdDown && (
        <Box
          style={{
            height: BOTTOM_BAR_HEIGHT + MARGIN_Y * 2,
            width: '100%',
          }}
        />
      )}
    </Stack>
  )
}
