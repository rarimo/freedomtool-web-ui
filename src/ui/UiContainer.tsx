import { Stack, StackProps, useTheme } from '@mui/material'

export default function UiContainer(props: StackProps) {
  const { breakpoints } = useTheme()

  return (
    <Stack
      {...props}
      sx={{
        maxWidth: 1192,
        width: '100%',
        mx: 'auto',
        [breakpoints.down('md')]: { px: 4, py: 10 },
        ...props.sx,
      }}
    />
  )
}
