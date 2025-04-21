import { alpha, Box, BoxProps, Fade, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { Transitions } from '@/theme/constants'
import { UiIcon } from '@/ui'

interface LazyImageProps extends BoxProps<'img'> {
  src: string
  alt: string
  width: number | string
  height: number | string
  imageProps?: BoxProps<'img'>
}

type ImageState = 'idle' | 'loading' | 'error'

export default function LazyImage({
  imageProps,
  src,
  alt,
  width,
  height,
  ...rest
}: LazyImageProps) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const [imageState, setImageState] = useState<ImageState>('loading')

  const isLoading = imageState === 'loading'
  const isError = imageState === 'error'

  useEffect(() => {
    const checkImageAvailability = async () => {
      try {
        await fetch(src)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        setImageState('error')
      }
    }
    checkImageAvailability()
  }, [src])

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
      {!isError && (
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
          onLoad={() => setImageState('idle')}
          onError={() => setImageState('error')}
        />
      )}
      <Fade in={isLoading}>
        <Skeleton
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 0 }}
        />
      </Fade>
      <Fade in={isError}>
        <Stack
          alignItems='center'
          spacing={4}
          justifyContent='center'
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius: 0,
            background: palette.action.active,
          }}
        >
          <UiIcon size={30} color={alpha(palette.text.disabled, 0.2)} name={Icons.Warning} />
          <Typography color={palette.text.disabled} variant='subtitle4'>
            {t('lazy-image.load-error')}
          </Typography>
        </Stack>
      </Fade>
    </Box>
  )
}
