import { Box, BoxProps, Fade, Skeleton } from '@mui/material'
import { useState } from 'react'

import { Transitions } from '@/theme/constants'

interface LazyImageProps extends BoxProps<'img'> {
  src: string
  alt: string
  width: number | string
  height: number | string
  imageProps?: BoxProps<'img'>
}

export default function LazyImage({
  imageProps,
  src,
  alt,
  width,
  height,
  ...rest
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        background: ({ palette }) => palette.background.light,
        ...rest.sx,
      }}
    >
      <Box
        component='img'
        src={src}
        alt={alt}
        loading='lazy'
        sx={{
          opacity: isLoading ? 0 : 1,
          transition: Transitions.Gentle,
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          ...imageProps?.sx,
        }}
        {...imageProps}
        onLoad={() => setIsLoading(false)}
      />
      <Fade in={isLoading}>
        <Skeleton
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 0 }}
        />
      </Fade>
    </Box>
  )
}
