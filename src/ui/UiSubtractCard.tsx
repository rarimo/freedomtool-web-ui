import { Stack, StackProps, useTheme } from '@mui/material'

type Props = {
  subtractPosition?: 'top' | 'bottom'
} & StackProps

export default function UiSubtractCard({
  subtractPosition = 'bottom',
  sx,
  children,
  ...rest
}: Props) {
  const { palette } = useTheme()

  return (
    <Stack
      {...rest}
      sx={{
        background: palette.background.paper,
        p: 4,
        borderRadius: 3,
        mask:
          subtractPosition === 'top'
            ? 'radial-gradient(10px at 10px 0, #0000 98%, #000) -10px'
            : 'radial-gradient(10px at 10px 100%, #0000 98%, #000) -10px',
        ...sx,
      }}
    >
      {children}
    </Stack>
  )
}
