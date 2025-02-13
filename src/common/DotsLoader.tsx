import { Stack, StackProps, useTheme } from '@mui/material'

import { bouncingAnimation } from '@/theme/constants'

export default function DotsLoader({ size = 2, color, ...rest }: { size?: number } & StackProps) {
  const { spacing, palette } = useTheme()

  return (
    <Stack spacing={spacing(size / 2)} justifyContent='center' direction='row' {...rest}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Stack
          bgcolor={color || palette.grey[400]}
          key={index}
          borderRadius='100%'
          width={spacing(size)}
          height={spacing(size)}
          sx={{
            animation: `${bouncingAnimation} 0.6s infinite alternate`,
            animationDelay: `0.${index}s`,
          }}
        />
      ))}
    </Stack>
  )
}
