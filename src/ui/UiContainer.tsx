import { Stack, StackProps, useTheme } from '@mui/material'

export default function UiContainer(props: StackProps) {
  const { breakpoints } = useTheme()

  return (
    <Stack
      {...props}
      sx={{
        px: 4,
        maxWidth: 1192,
        width: '100%',
        mx: 'auto',
        [breakpoints.down('md')]: { px: 4, py: 20, pb: 0 },
        ...props.sx,
      }}
    />
  )
}
