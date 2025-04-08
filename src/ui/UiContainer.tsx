import { Stack, StackProps, useTheme } from '@mui/material'

export default function UiContainer(props: StackProps) {
  const { breakpoints } = useTheme()

  return (
    <Stack
      {...props}
      sx={{
        width: '100%',
        mx: 'auto',
        [breakpoints.down('md')]: { px: 4, pt: 18, pb: 20 },
        ...props.sx,
      }}
    />
  )
}
